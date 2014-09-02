var mongo = require('mongoose');
mongo.connect('mongodb://localhost/blog');

var db = mongo.connection;
db.on('error', console.error.bind(console, 'connection error:'));
console.log('connected to db');

module.exports = db;