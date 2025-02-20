// taskController.js
const Tasks = require('../models/tasks');

// add new task
exports.addTasks = async (req, res) => {
    const { title } = req.body;
    const taskExist = await Tasks.findOne({ title });

    if (taskExist) {
        return res.status(400).json({
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
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

//get all tasks
exports.getTasks = async (req, res) => {

    try {
        const tasks  = await Tasks.find({});
        res.status(201).json({
            success: true,
            tasks,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
        success: false,
        message: error.message,
        });
    }
};

// Update task
exports.updateTask  = async (req, res) => {
    const { tasksId } = req.params; // Assuming taskId is passed as a URL parameter
    const { title, description , completed } = req.body; // Get the fields you want to update

    // Validate input
    if (!title && !description && !completed) {
        return res.status(400).json({
            success: false,
            message: "Please provide at least one field to update (title, description , completed).",
        });
    }

    try {
        const updatedTask  = await Tasks.findByIdAndUpdate(
            tasksId,
            { title, description , completed }, // Update fields
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
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Update task status
exports.updateTaskStatus  = async (req, res) => {
    const { tasksId } = req.params; // Assuming taskId is passed as a URL parameter
    const { completed } = req.body; // Get the fields you want to update

    // Validate input
    if (!completed) {
        return res.status(400).json({
            success: false,
            message: "Please provide status to update",
        });
    }

    try {
        const updatedTask  = await Tasks.findByIdAndUpdate(
            tasksId,
            { completed }, // Update fields
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
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete task
exports.deleteTask  = async (req, res) => {
    const { tasksId } = req.params; // Assuming taskId is passed as a URL parameter

    try {
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
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
