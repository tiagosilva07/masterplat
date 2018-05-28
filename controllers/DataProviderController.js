
var mongoose = require('mongoose');
var aqp = require('api-query-params');
const Provider = require('../models/DataProvidersModel');

//List All Providers
exports.list_all_dataProviders = async (req, res) => {

  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Provider
    .find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .exec(async (err, result) => {

      if (err) {
        return res.status(500).jsonp({message:"There was an internal error listing all the providers " + err});
      }

      let count = await Provider.find().count()


      res.status(200).jsonp({
        limit: limit,
        skip: skip,
        total: count,
        data: result
      });
    });

};
//Add a new Provider

exports.create_a_dataProvider = async (req, res) => {

  let provider = new Provider({

    urlName: req.body.urlName,

    urlDescription: req.body.urlDescription

  });
  let allproviders = await Provider.find(); 
 if(checkIfExists(allproviders,req.body.urlName))
 {
   res.status(400).jsonp({message:"The provider already exists"})
 }else{
  try{

          let saveProvider = await provider.save();

          return res.status(200).jsonp({

            message: "Provider Created"

          });

        } catch (err) {

          res.status(500).jsonp({message:"There was an error on the creation of the provider "+err});

        }
      }
      };

//Find a Provider
exports.find_a_dataProviderById = async (req, res) => {

  let provider = await Provider.findById(req.params.dataProviderId, (err, provider) => {
    if (err) {

      res.status(500).jsonp({message:"There was an error searching the provider " + err});
    } else if (provider == null) {
      res.status(400).jsonp({ message: 'There is no provider with that id!' });

    } else {

      res.status(200).jsonp(provider);

    }
  });

};

//Update a Provider
exports.update_a_dataProvider = async (req, res) => {
  let date = Date.now();
  let providerId = req.params.dataProviderId;
  try {
    let updateProvider = await Provider.findByIdAndUpdate({ _id: providerId }, { urlName: req.body.urlName,urlDescription: req.body.urlDescription,updated_date: date }, { new: true });
    res.status(200).jsonp(updateProvider);

  } catch (err) {
    res.status(500).jsonp({message:"There was an error updating the selected provider " +err});

  }

};

//Delete a Provider
exports.delete_a_dataProvider = async (req, res) => {

  let providerId = req.params.dataProviderId;
  try {

    let provider = await Provider.findById(providerId);

    if (provider) {

      let remove = await Provider.remove({ _id: providerId });

      if (remove) {

        return res.status(200).jsonp({

          message: 'Provider Removed!'

        });

      }

    } else {

      return res.status(404).jsonp({

        erro: "Provider not found!"

      });

    }

    return res.status(200).jsonp({ thesis });

  } catch (error) {

    res.status(500).jsonp({message:"There was an error deleting the selected provider "+error});

  }
};

var checkIfExists = (providers,url)=>{

for(i=0;i<providers.length;i++)
{
  if(providers[i].urlName == url)
  {
    return true;
  }
}
return false;
}