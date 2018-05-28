'use strict';

 module.exports = function(app){
 var thesisList = require('../controllers/ThesisController');

 app.route('/api/v1/thesis')
 .get(thesisList.list_all_thesis)
 //.post(thesisList.create_a_thesis);

 app.route('/api/v1/these/:thesisId')
 .get(thesisList.find_a_thesisById)
 //.put(thesisList.update_a_thesis)
 .delete(thesisList.delete_a_thesis);
};