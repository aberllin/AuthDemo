const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required!'],
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
  },
});

/**
  In the first snippet (function declaration), `this` inside the function refers to the schema itself. Mongoose automatically binds the function to the schema instance.
  In the second snippet (arrow function), `this` is not bound by the function, and it will depend on the context where the function is called. If you need access to the schema within the function, you might run into issues using an arrow function. 
  The arrow function doesn't have its own this and inherits it from the surrounding scope.
 */
userSchema.statics.findUserAndValidate = async function (username, password) {
  const user = await this.findOne({ username });
  const isValid = bcrypt.compare(password, user.password);

  return isValid ? user : false;
};

module.exports = mongoose.model('User', userSchema);
