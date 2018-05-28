'use strict';

module.exports = function (app) {
    var dataProvidersList = require('../controllers/DataProviderController');
    var harvestFunctions = require('../my_modules/thesisharvester.js');


    app.route('/api/v1/dataproviders/load/')
        .get(harvestFunctions.loadAllData);

    app.route('/api/v1/dataproviders')
        .get(dataProvidersList.list_all_dataProviders)
        .post(dataProvidersList.create_a_dataProvider);

    app.route('/api/v1/dataproviders/:dataProviderId')
        .get(dataProvidersList.find_a_dataProviderById)
        .put(dataProvidersList.update_a_dataProvider)
        .delete(dataProvidersList.delete_a_dataProvider);

    app.route('/api/v1/dataproviders/:dataProviderId/load')
        .get(harvestFunctions.loadData);

};
