const fs = require('fs').promises;
const path = require('path');

class LogSubscriber {
  constructor(eventEmitter, options = {}) {
    this.eventEmitter = eventEmitter;
    this.logDir = options.logDir || './logs';
    this.statsFile = path.join(this.logDir, 'stats.json');
    this.timingFile = path.join(this.logDir, 'timing.json');
    this.toConsole = options.console ?? true;
    
    this.init();
    this.subscribe();
  }
  
  async init() {
    await fs.mkdir(this.logDir, { recursive: true }).catch(() => {});
    // Ініціалізуємо файли з порожнім масивом
    for (const file of [this.statsFile, this.timingFile]) {
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, '[]', 'utf-8');
      }
    }
  }
  
  subscribe() {
    this.eventEmitter.on('requestCompleted', (data) => {
      if (this.toConsole) {
        console.log(`⏱️ [${data.statusCode}] ${data.method} ${data.path} - ${data.responseTime}ms`);
      }
      this.writeLog(this.timingFile, { type: 'timing', ...data });
    });
    
    this.eventEmitter.on('statsCollected', (data) => {
      if (this.toConsole) {
        console.log(`📊 [STATS] ${data.method} ${data.path}`);
      }
      this.writeLog(this.statsFile, { type: 'statistics', ...data });
    });
  }
  
  async writeLog(filePath, entry) {
    try {
      let logs = [];
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        // Безпечний парсинг з обробкою помилок
        logs = JSON.parse(content.trim() || '[]');
        if (!Array.isArray(logs)) logs = [];
      } catch (parseErr) {
        // Якщо файл пошкоджено — починаємо з нового масиву
        console.warn(`⚠️ Resetting corrupted log file: ${filePath}`);
        logs = [];
      }
      
      logs.push(entry);
      
      // Обмежуємо розмір (останні 1000 записів)
      if (logs.length > 1000) logs = logs.slice(-1000);
      
      await fs.writeFile(filePath, JSON.stringify(logs, null, 2), 'utf-8');
    } catch (err) {
      console.error('❌ Log write error:', err.message);
    }
  }
}

module.exports = LogSubscriber;