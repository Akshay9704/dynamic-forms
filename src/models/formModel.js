import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    fieldType: {
      type: String,
      enum: ["input", "select", "textarea"],
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Form = mongoose.models.Forms || mongoose.model("Forms", formSchema);

export default Form;
