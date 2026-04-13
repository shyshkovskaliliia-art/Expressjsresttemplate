const fs = require('fs').promises;
const path = require('path');

class LogSubscriber {
  constructor(eventEmitter, options = {}) {
    this.eventEmitter = eventEmitter;
    this.logFilePath = options.logFilePath || path.join(__dirname, '../logs/stats.json');
    this.outputToConsole = options.console ?? true;
    this.outputToFile = options.file ?? true;
    
    this.subscribe();
  }
  
  subscribe() {
    // Handle timing events
    this.eventEmitter.on('requestCompleted', (data) => {
      if (this.outputToConsole) {
        console.log(`[Timing] ${data.method} ${data.path} - ${data.responseTime}ms`);
      }
      if (this.outputToFile) {
        this.appendToFile('timing', data);
      }
    });
    
    // Handle stats events
    this.eventEmitter.on('statsCollected', (data) => {
      if (this.outputToConsole) {
        console.log(`[Stats] ${data.method} ${data.path} from ${data.userAgent}`);
      }
      if (this.outputToFile) {
        this.appendToFile('statistics', data);
      }
    });
  }
  
  async appendToFile(type, data) {
    try {
      const logEntry = { type, ...data };
      const content = await fs.readFile(this.logFilePath, 'utf-8').catch(() => '[]');
      const logs = JSON.parse(content || '[]');
      logs.push(logEntry);
      await fs.writeFile(this.logFilePath, JSON.stringify(logs, null, 2));
    } catch (err) {
      console.error('Failed to write log:', err);
    }
  }
}

module.exports = LogSubscriber;