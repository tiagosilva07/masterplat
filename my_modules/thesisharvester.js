
var providerController = require('../controllers/DataProviderController');
var thesisController = require('../controllers/ThesisController');
const oaipmh = require('./oai-pmh-harvester/oai-pmh-harvester.js');
const ProviderModel = require('../models/DataProvidersModel');
var ThesisModel = require('../models/ThesisModel');
var systemLogController = require('../controllers/LogController');
var SystemLogModel = require('../models/SystemLogModel');


exports.loadData = async (req, res) => {
    let providerId = req.params.dataProviderId;
    let deleteProviderThesis = await deleteData(providerId);
    let temp = await harvestFunctionLoad(providerId);
    return res.status(200).jsonp({ message: "Loaded  Data Provider!" });  
};

exports.loadAllData = async (req, res) => {

    try {

        let allProviders = await ProviderModel.find();
        for (i = 0; i < allProviders.length; i++) {
            harvestFunctionLoad(allProviders[i]._id);
        }

        return res.status(200).jsonp({ message: "Loaded multiple Data Providers!" });
    
    } catch (error) {

        return res.status(500).jsonp({message:"Error loading all providers "+error});
    }

};

async function harvestFunctionLoad(providerId) {

    try {
        let provider = await ProviderModel.findById({ _id: providerId });
        console.log("Receiving Provider!");
        systemLog = new SystemLogModel();

        if (provider != null) {
            let count = 0;
            systemLog.systemLogURL = provider.urlName;
            systemLog.systemLogUrlDescritpion = provider.urlDescription;
            systemLog.systemLogStartOperationDate = Date.now();

            console.log("harvesting from " + provider.urlName);

            let harvester = await new oaipmh.Harvester(provider.urlName);

            harvester.harvest((item) => {

                try {
                    if ((typeof (item.metadata) !== 'undefined') &&
                        typeof (item.metadata['oai_dc:dc']) !== 'undefined' &&
                        typeof (item.metadata['oai_dc:dc']['dc:type']) !== 'undefined' &&
                        (item.metadata['oai_dc:dc']['dc:type']).includes("masterThesis")) {
                        count++;

                        thesis = new ThesisModel();


                        let creators = item.metadata['oai_dc:dc']['dc:creator'];
                        creators = (typeof creators == 'object') ? creators.join("\n") : creators;

                        let subjects = item.metadata['oai_dc:dc']['dc:subject'];
                        subjects = (typeof subjects == 'object') ? subjects.join("\n") : subjects;

                        let identifier = item.metadata['oai_dc:dc']['dc:identifier'];
                        identifier = (typeof identifier == 'object') ? identifier.join('\n') : identifier;


                        thesis.thesisTitle = item.metadata['oai_dc:dc']['dc:title'];
                        thesis["thesisCreator"] = creators;
                        thesis["thesisSubject"] = subjects;
                        thesis.thesisDescription = item.metadata['oai_dc:dc']['dc:description'];
                        thesis.thesisDate = item.metadata['oai_dc:dc']['dc:date'];
                        thesis.thesisType = item.metadata['oai_dc:dc']['dc:type'];
                        thesis.thesisFormat = item.metadata['oai_dc:dc']['dc:format'];
                        thesis["thesisIdentifier"] = identifier;
                        thesis.thesisLanguage = item.metadata['oai_dc:dc']['dc:language'];
                        thesis.thesisRights = item.metadata['oai_dc:dc']['dc:rights'];
                        thesis.respositoryId = provider._id;
                        thesisController.save_a_thesis(thesis);
                    }

                } catch (err) {
                    // handle errors here
                    console.log(err);

                }


            },
                function () {
                    console.log("Count ", count);
                    systemLog.systemLogEndtOperationDate = Date.now();
                    systemLog.systemLogNumberOfOperations = count;
                    systemLogController.save_a_log(systemLog);

                });

        }

    } catch (err) {

        console.log(err);
    }

};

async function deleteData(providerId) {
    let thesis = await ThesisModel.find();

    for (i = 0; i < thesis.length; i++) {
        if (thesis[i].respositoryId == providerId) {
            let remove = await ThesisModel.remove({ _id: thesis[i]._id });
        }
    }

};