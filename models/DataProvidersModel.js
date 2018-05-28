
'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RepositorySchema = new Schema({

    urlName: {
     type: String
    },
    urlDescription:{
    type:String
    },
    created_date:{
    type: Date,
    default:Date.now
    },
    updated_date:{
        type: Date
    }
});

module.exports = mongoose.model('DataProviders',RepositorySchema);