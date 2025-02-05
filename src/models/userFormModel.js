import mongoose from "mongoose";

const userFormSchema = new mongoose.Schema(
  {
    users: {
      type: Object,
    },
  },
  { timestamps: true }
);

const UserForm =
  mongoose.models.UserForm || mongoose.model("UserForm", userFormSchema);

export default UserForm;
