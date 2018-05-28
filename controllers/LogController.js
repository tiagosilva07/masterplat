var mongoose = require('mongoose');
var aqp = require('api-query-params');
const SystemLog = require('../models/SystemLogModel');

exports.list_all_logs = (req, res) => {

  const { filter, skip, limit, sort, projection } = aqp(req.query);
  SystemLog
    .find(filter)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(projection)
    .exec(async (err, result) => {

      if (err) {
        return res.status(500).jsonp({message:"There was an error listing all logs from the server "+err});
      }

      let count = await SystemLog.find().count()


      res.status(200).jsonp({
        limit: limit,
        skip: skip,
        total: count,
        data: result
      });
    });

};


exports.save_a_log = (log) => {

  try {
    let systemLog = new SystemLog();
    systemLog = log;
    let save = systemLog.save();

  }
  catch (err) {

    return res.status(500).jsonp({message:"There was an error saving the system logs please contact someone responsible for the api!"+ err});

  }


};

