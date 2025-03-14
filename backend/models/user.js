    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs/dist/bcrypt');

    const UserSchema = mongoose.Schema(
        {
            // user(name, email, password)
            name :{
                type : String,
                trim: true,
                required: [true, 'Please add a name'],
                maxlength: [30, 'Name cannot be more than 30 characters']
            },
            email :{
                type : String,
                trim: true,
                required: [true, 'Please add a email'],
                maxlength: [80, 'email  cannot be more than 80 characters'],
                unique: [true , 'email should not be duplicated'],
                match: [
                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    'Please add a valid E-mail'
                ]
            },
            password :{
                type : String,
                trim: true,
                match: [
                    /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                    'Password must contain at least 1 uppercase letter, 1 lowercase letter, at least 6 characters length'
                ],
                validate: {
                    validator: function(value) {
                        // Only validate if the password is being set
                        if (this.isNew) {
                            return value != null && value.length > 0; // Check if password is provided
                        }
                        return true; // Skip validation for updates if password is not provided
                    },
                    message: 'Please add a Password'
                }
            },
            role :{
                type : String,
                trim: true,
                validate: {
                  validator: function(value) {
                      // Only validate if the role is being set
                      if (this.isNew) {
                          return value != null && value.length > 0; // Check if role is provided
                      }
                      return true; // Skip validation for updates if role is not provided
                  },
                  message: 'Please select Role'
              }
            },
        },
        {
            timestamps :true,
        }
    );

    // encrypting password before saving
    UserSchema.pre('save', async function(next) {
        if (!this.isModified('password')) {
            return next();
        }
        this.password = await bcrypt.hash(this.password, 10);
    });

    // verify password
    UserSchema.methods.comparePassword = async function(yourPassword) {
        return await bcrypt.compare(yourPassword, this.password);
    }

    module.exports = mongoose.model("User", UserSchema);

