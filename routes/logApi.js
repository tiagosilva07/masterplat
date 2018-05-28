'use strict';

 module.exports = function(app){
 var thesisList = require('../controllers/LogController');

 app.route('/api/v1/logs')
 .get(thesisList.list_all_logs)
 };