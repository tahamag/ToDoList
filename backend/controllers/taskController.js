// taskController.js
const Tasks = require('../models/tasks');

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

//get all tasks
exports.getTasks = async (req, res) => {

    try {
        const tasks  = await Tasks.find({}).populate('userId', 'name _id');;
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
// task(title, description, taskDate, status, validationDate, user)
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

// Update task status
exports.updateTaskStatus  = async (req, res) => {
    const { tasksId } = req.params; // Assuming taskId is passed as a URL parameter
    const { status } = req.body; // Get the fields you want to update

    // Validate input
    if (!status) {
        return res.status(402).json({
            success: false,
            message: "Please provide status to update",
        });
    }

    try {
        const updatedTask  = await Tasks.findByIdAndUpdate(
            tasksId,
            { status }, // Update fields
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
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};
