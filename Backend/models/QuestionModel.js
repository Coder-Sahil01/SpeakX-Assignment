    const mongoose = require('mongoose');

    const optionsSchema = new mongoose.Schema({
        text:{
            type:String,
            required:true,
        },
        isCorrect:{
            type:Boolean,
            required:true,
        },
    });

    const blockSchema = new mongoose.Schema({
        text: {
            type: String,
            required: true
        },
        showInOption: {
            type: Boolean,
            required: true
        },
        isAnswer: {
            type: Boolean,
            required: true
        }
    });

    const questionSchema = new mongoose.Schema({

        type:{
            type:String,
            required:true,
            
        },
        anagramType:{
            type:String,
            
        },
        title:{
            type:String,
            required:true,
        },
        solution:{
            type:String,
        },
        options:{
            type:[optionsSchema],
            
        },
        blocks:{
            type:[blockSchema],
            
        },
        siblingId:{
            type:mongoose.Schema.Types.ObjectId,
            
        }


    },{
        collection:'questions'
    });

    const Question = mongoose.model('Question', questionSchema);
    module.exports = Question;