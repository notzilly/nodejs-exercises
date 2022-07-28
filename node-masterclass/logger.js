const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

const emitter = new EventEmitter();
const filePath = path.join(__dirname, 'log.txt');

emitter.on('log', (message) => {
    fs.appendFile(filePath, message, (err) => {
        if (err) throw err
    })
});


function log(message) {
    emitter.emit('log', message);
}

module.exports = log;