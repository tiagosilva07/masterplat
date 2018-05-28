'use strict';
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var RepositorySchema = new Schema({

    thesisTitle: {
       type: String
    },

    thesisCreator:[{
        type:String
    }],

    thesisSubject:[{
        type: String
    }],

    thesisDescription:{
        type:String
    },

    thesisDate:[{
    type: Date,
    }],

    thesisType:{
        type: String
    },

    thesisFormat:{
        type: String
    },
    thesisIdentifier:[{
        type: String
    }],

    thesisLanguage:{
        type: String
    },

    thesisRights:{
        type: String
    },

    respositoryId:{
        type: String 
    },
});

module.exports = mongoose.model('Thesis',RepositorySchema);