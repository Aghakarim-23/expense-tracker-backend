import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bank: {
      type: String,
      enum: ["BirKart", "Unibank"],
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    balance: {
      type: Number,
      default: 0,
    },
    creditLimit: {
      type: Number,
      default: 0,
    },
    usedLimit: {
      type: Number,
      default: 0,
    },
    availableLimit: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Card = mongoose.model("Card", cardSchema);

export default Card;
