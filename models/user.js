import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/auth");

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

export default mongoose.model("user", userSchema);
