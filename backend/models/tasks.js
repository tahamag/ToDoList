const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        // task(title, description, completed)
        title :{
            type : String,
            trim: true,
            required: [true, 'Please add a title'],
            unique: [true , 'title should not be duplicated'],
            minlength: [4, 'title must have at least four(4) caracters'],
        },
        description :{
            type : String,
            trim: true,
        },
        completed :{
            type : Boolean,
            default : false,
        },
    },
    {
        timestamps :true,
    }
);

module.exports = mongoose.model("task", taskSchema);

