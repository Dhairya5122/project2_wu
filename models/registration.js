const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // Used to hash passwords

const { Schema } = mongoose;
const SignupSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      default: "user", // Default role
    },
    status: {
      type: String,
      default: "active", // Default account status
    },
    admin: {
      type: Boolean,
      default: false, // Only admin accounts are true
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Hash the password before saving the document
SignupSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model("user", SignupSchema);
