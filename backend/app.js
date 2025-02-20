const express = require('express')
const mongoose = require('mongoose')
const userController = require('./controllers/userController');
const taskController = require('./controllers/taskController');
require("dotenv").config()
const cors = require('cors');


const app = express()
const port = process.env.PORT
const DbUri = process.env.mongoDbUri
app.use(express.urlencoded({extended:true}));
app.use(express.json());

    
// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:4200', // Allow requests from Angular app
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true // Allow cookies and credentials (if needed)
  }));

app.get('/' , (req, res)=>{
    return res.status(200).send('MTM app')
})

// Route for sign up
app.post('/signup', userController.signup);

// Route for sign in
app.get('/signin', userController.signin);


// Route for get all users
app.get('/users', userController.getUsers);


// Route for updating user
app.put('/users/:userId', userController.updateUser );

// Route for deleting user
app.delete('/users/:userId', userController.deleteUser );


// Route for add tasks
app.post('/tasks/add', taskController.addTasks);

// Route for add tasks
app.get('/tasks', taskController.getTasks);

// Route for update tasks
app.put('/tasks/:tasksId', taskController.updateTask);

// Route for update tasks
app.put('/tasks/status/:tasksId', taskController.updateTaskStatus);

// route for deleting task
app.delete('/tasks/:tasksId', taskController.deleteTask);


mongoose
    .connect(DbUri)
    .then(() =>{
        console.log("App connected successfully");

        app.listen(port,()=>{
            console.log(`app is listing on port :${port}`);
        })
    })
    .catch((error)=>{
        console.log("data base connection error :"+error);
    })