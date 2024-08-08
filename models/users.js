const mongoose = require("mongoose");
const { authenticate } = require("passport");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// Adds on username and password to our user schema
// Plugin adds methods to the schema such as User.authenticate()
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
