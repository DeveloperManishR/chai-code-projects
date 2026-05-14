import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },

  votes: {
    type: Number,
    default: 0,
  },
});

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },

  options: {
    type: [optionSchema],
    validate: {
      validator: function (value: string | any[]) {
        return value.length >= 2;
      },
      message: "A question must have at least 2 options",
    },
  },
});

const pollSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },

    questions: {
      type: [questionSchema],
      required: true,
    },

    expiryTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "COMPLETED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Poll", pollSchema);
