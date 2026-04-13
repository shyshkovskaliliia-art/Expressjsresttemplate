// subscribers/logSubscriber.js
const fs = require('fs').promises;
const path = require('path');

class LogSubscriber {
  constructor(eventEmitter, options = {}) {
    this.eventEmitter = eventEmitter;
    this.logFile = options.logFilePath || './logs/stats.json';
    this.toConsole = options.console ?? true;
    
    this.init();
    this.subscribe();
  }
  
  async init() {
    await fs.mkdir(path.dirname(this.logFile), { recursive: true }).catch(() => {});
    try { await fs.access(this.logFile); } 
    catch { await fs.writeFile(this.logFile, '[]'); }
  }
  
  subscribe() {
    this.eventEmitter.on('requestCompleted', (data) => {
      if (this.toConsole) console.log(`⏱️ ${data.method} ${data.path} - ${data.responseTime}ms`);
      this.writeLog(data);
    });
    
    this.eventEmitter.on('statsCollected', (data) => {
      if (this.toConsole) console.log(`📊 ${data.method} ${data.path}`);
      this.writeLog(data);
    });
  }
  
  async writeLog(entry) {
    try {
      const content = await fs.readFile(this.logFile, 'utf-8').catch(() => '[]');
      const logs = JSON.parse(content || '[]');
      logs.push(entry);
      if (logs.length > 1000) logs.shift();
      await fs.writeFile(this.logFile, JSON.stringify(logs, null, 2));
    } catch (err) { console.error('Log error:', err); }
  }
}

module.exports = LogSubscriber;