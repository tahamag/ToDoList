// userController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs/dist/bcrypt');

// add new user
exports.signup = async (req, res) => {
    const { email } = req.body;
    const { password } = req.body;
    const { role } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
        return res.status(401).json({
            success: false,
            message: "E-mail already exists",
        });
    }
    if(!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password)){
        return res.status(401).json({
            success: false,
            message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, at least 6 characters length",
        });
    }

    if(role !="Project manager" && role!='Developer'){
        return res.status(401).json({
            success: false,
            message: "Role should be Project manager or Developer",
        });
    }

    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

//get users
exports.getUsers = async (req, res) => {

    try {
        const user  = await User.find();
        res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
//get user
exports.signin = async (req, res) => {
  try {
    const { email , password } = req.body;
    if(!email || !password){
        res.status(400).json({
            success: false,
            message: 'please enter valid email and password',
            });
    }else{
        // Verify user password
        const user  = await User.findOne({ email });

        if(user == null){
            res.status(404).json({
                success: false,
                message: 'invalid email',
            });
        }else{
            const isMatched = await user.comparePassword(password);
            if (!isMatched) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid password",
                });
            }
            res.status(201).json({
                success: true,
                user,
            });
        }
    }
    } catch (error) {
        console.log(error);
        res.status(400).json({
        success: false,
        message: error.message,
        });
    }
};

//get developpers
exports.getDeveloppers = async (req, res) => {

    try {
        const user  = await User.find()
                                .select('_id name')
                                .where('role').equals('Developer');;
        res.status(201).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

 //Update User
exports.updateUser  = async (req, res) => {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter
    const { email, name, role, password } = req.body; // Get the fields you want to update
    let updatedUser ;

    try {
        // Prepare the update object
        const updateData = { email, name };

        // If a new password is provided, hash it
        if (password) {
          if(!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password)){
              return res.status(401).json({
                  success: false,
                  message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, at least 6 characters length",
              });
          }else
            updateData.password = await bcrypt.hash(password, 10);
        }

        // If a role is provided, add it to the update object
        if (role) {
          if(role !="Project manager" && role!='Developer'){
            return res.status(401).json({
                success: false,
                message: "Role should be Project manager or Developer",
            });
          }else
            updateData.role = role;
        }

        // Update the user
        updatedUser  = await User.findByIdAndUpdate(
            userId,
            updateData, // Update fields
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!updatedUser ) {
            return res.status(404).json({
                success: false,
                message: "User  not found",
            });
        }

        res.status(200).json({
            success: true,
            user: updatedUser ,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete User
exports.deleteUser  = async (req, res) => {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter

    try {
        const deletedUser  = await User.findByIdAndDelete(userId);

        if (!deletedUser ) {
            return res.status(404).json({
                success: false,
                message: "User  not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User  deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
