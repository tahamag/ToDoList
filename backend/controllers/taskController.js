// taskController.js
const Tasks = require('../models/tasks');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
// add new task
exports.addTasks = async (req, res) => {
    const { title } = req.body;
    const taskExist = await Tasks.findOne({ title });

    if (title.length < 4)  {
        return res.status(401).json({
            success: false,
            message: "title must have at least four caracters",
        });
    }

    if (taskExist) {
        return res.status(401).json({
            success: false,
            message: "this title already exists",
        });
    }

    try {
        const tasks = await Tasks.create(req.body);
        res.status(201).json({
            success: true,
            tasks,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

//get all tasks or by developper

exports.getTasks = async (req, res) => {
    try {
        const {UserId} = req.params;
        let tasks;
        if(UserId){
          tasks  = await Tasks.find({userId: new ObjectId(UserId)}).populate('userId', 'name _id');
        }else
          tasks  = await Tasks.find().populate('userId', 'name _id');

        res.status(201).json({
            success: true,
            tasks,
        });
    }
    catch (error) {
        res.status(400).json({
        success: false,
        message: error.message,
        });
    }
};


// Update task
exports.updateTask  = async (req, res) => {
    const { tasksId } = req.params; // Assuming taskId is passed as a URL parameter
    const { title, description, taskDate, status, validationDate, userId} = req.body; // Get the fields you want to update

    // Validate input
    if (!title) {
        return res.status(402).json({
            success: false,
            message: "Please provide title to modify",
        });
    }
    if (!status) {
        return res.status(402).json({
            success: false,
            message: "Please provide valid status to modify.",
        });
    }
    if (!userId) {
        return res.status(402).json({
            success: false,
            message: "Please provide valid user.",
        });
    }

    try {
        const updatedTask  = await Tasks.findByIdAndUpdate(
            tasksId,
            { title, description , taskDate, status, validationDate, userId }, // Update fields
            { new: true, runValidators: true } // Return the updated document and run validators
        );
        if (!updatedTask ) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        res.status(200).json({
            success: true,
            task: updatedTask ,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};


//db.tasks.find({userId:ObjectId('67483cece7a689e1b2d95f52')})
// Delete task
exports.deleteTask  = async (req, res) => {
    const { tasksId } = req.params; // Assuming taskId is passed as a URL parameter

    try {
        const VerifyTask = await Tasks.findOne({_id: new ObjectId(tasksId) , status : {$ne : 'pending'} })
        if(VerifyTask){
          console.log(VerifyTask.status)
          return res.status(201).json({
              success: false,
              message: "you can not delete this task, it has the status : "+VerifyTask.status ,
          });

        }

        const deletedTask  = await Tasks.findByIdAndDelete(tasksId);

        if (!deletedTask ) {
            return res.status(404).json({
                success: false,
                message: "Task  not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Task  deleted successfully",
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};


exports.updateTaskStatus = async (req, res) => {
  // Validate input
  if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
          success: false,
          message: "Please provide an array of tasks to update",
      });
  }

  try {
      // Use Promise.all to wait for all updates to complete
      const updatePromises = req.body.map(async (task) => {
          const { _id, status, validationDate } = task;

          const updatedTask = await Tasks.findByIdAndUpdate(
              _id,
              { status, validationDate }, // Update fields
              { new: true, runValidators: true } // Return the updated document and run validators
          );
          if (!updatedTask) {
              throw new Error(`Task with ID ${_id} not found`);
          }
          return updatedTask; // Return the updated task
      });

      // Wait for all updates to complete
      const updatedTasks = await Promise.all(updatePromises);

      res.status(200).json({
          success: true,
          tasks: updatedTasks // Return the updated tasks
      });
  } catch (error) {
      res.status(400).json({
          success: false,
          message: error.message,
      });
  }
};

