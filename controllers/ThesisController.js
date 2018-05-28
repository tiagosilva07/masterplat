var mongoose = require('mongoose');
var aqp = require('api-query-params');
const Thesis = require('../models/ThesisModel');

exports.list_all_thesis =  (req, res) => {

  const { filter, skip, limit, sort, projection } = aqp(req.query);
  Thesis
    .find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)  
    .exec(async (err, result) => {

      if (err) {
         return res.status(500).jsonp({message:"There was an error listing all thesis " +err});
      } 

      let count = await Thesis.find().count()
      

      res.status(200).jsonp({
        limit: limit,
        skip: skip,
        total: count,
        data: result
      });
     });

  };
      
  
 exports.save_a_thesis = (thesis) => {

  try{
      let masterThesis = new Thesis();
      masterThesis = thesis;
      let save = masterThesis.save();
      

  }catch(err)
  {
    return res.status(500).jsonp({message:"There was an error saving the thesis " + err});
  }
 

 };
  
  //Find a Thesis
  exports.find_a_thesisById = async (req, res) => {
  
    let thesis = await Thesis.findById(req.params.thesisId, function (err, thesis) {
      if (err) {

        res.status(500).jsonp({message:"There was an error finding the selected thesis " +err});

      }
      else if(thesis==null){

        res.status(400).jsonp({message:'There is no thesis with that id!'});      
  
      }
      else{
        
        res.status(200).jsonp(thesis);
  
      }
    });
  
  };
    
  //Delete a thesis
  exports.delete_a_thesis = async (req, res) => {
   
   let thesisId =req.params.thesisId;
    try {
  
      let thesis = await Thesis.findById(thesisId);
  
      if (thesis) {
  
        let remove = await Thesis.remove({_id:thesisId});
  
        if (remove) {
  
          return res.status(200).jsonp({message: 'Thesis was Removed!'});
  
        }
  
      } else {
  
        return res.status(404).jsonp({message: "Thesis not found!"});
  
      }
  
      return res.status(200).jsonp({ message:"Thesis was removed successfully" });
  
    } catch (error) {
  
      res.status(500).jsonp({message:"There was an error deleting the selected thesis "+ error});
  
    }
  };