'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RepositorySchema = new Schema({

    systemLogURL: {
       type: String
    },

    systemLogUrlDescription :{
        type:String,
    },
    systemLogStartOperationDate:{
    type: Date,
    },

    systemLogEndtOperationDate:{
        type: Date,

    },

    systemLogNumberOfOperations:{
        type: String
    },
   
});

module.exports = mongoose.model('MasterPlatSystemLogs',RepositorySchema);