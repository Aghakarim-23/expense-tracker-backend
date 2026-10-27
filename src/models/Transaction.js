import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    type: {
      type: String,
      enum: ["expense", "payment"],
      required: true,
    },
    category: String,
    description: String,
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema)

export default Transaction