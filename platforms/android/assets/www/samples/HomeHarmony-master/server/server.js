var express = require('express');
var app = express();
var middleware = require('./util/middleware.js');

middleware(app, express);

app.set('port', process.env.PORT || 8080);

module.exports = app;
