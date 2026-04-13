// middleware/eventEmitter.js
const EventEmitter = require('events');

class AppEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(20);
  }
}

module.exports = new AppEventEmitter();