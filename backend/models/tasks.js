const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
        // task(title, description, taskDate, status, validationDate, user)
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
        taskDate:{
          type : Date,
          default : Date.now,
        },
        status :{
          type : String,
          default : 'pending',
          enum: ['pending', 'in-progress', 'completed']
        },
        validationDate:{
          type:Date,
          default : null
        },
        userId:{
          type : mongoose.Schema.Types.ObjectId,
          ref : 'User',
        }
    },
    {
        timestamps :true,
    }
);

module.exports = mongoose.model("task", taskSchema);

