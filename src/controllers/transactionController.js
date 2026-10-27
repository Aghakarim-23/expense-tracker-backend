
import mongoose from "mongoose";
import Card from "../models/Card.js";
import Transaction from "../models/Transaction.js";

export const createTransaction = async (req, res) => {
  try {
    const { cardId, amount, type, category, description } = req.body;

    // 1. Məlumatları yoxlayırıq
    if (
      !mongoose.isValidObjectId(cardId) ||
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !["expense", "payment"].includes(type)
    ) {
      return res.status(400).json({
        message: "Məlumatlar düzgün deyil",
      });
    }

    // 2. Kartı tapırıq
    const card = await Card.findById(cardId);

    if (!card) {
      return res.status(404).json({
        message: "Kart tapılmadı",
      });
    }

    // 3. Yeni balansı hesablayırıq
    const newBalance =
      type === "expense"
        ? card.balance - amount
        : card.balance + amount;

    if (newBalance < 0 || newBalance > card.creditLimit) {
      return res.status(400).json({
        message: "Əməliyyat kart limitinə uyğun deyil",
      });
    }

    // 4. Əməliyyatı yadda saxlayırıq
    // və kart balansını yeniləyirik
    const session = await mongoose.startSession();

    let transaction;

    try {
      await session.withTransaction(async () => {
        const created = await Transaction.create(
          [{
            card: cardId,
            amount,
            type,
            category,
            description,
          }],
          { session }
        );

        transaction = created[0];

        // Transaction daxilində balansı yenidən yoxlayırıq
        const delta = type === "expense" ? -amount : amount;

        const updatedCard = await Card.findOneAndUpdate(
          {
            _id: cardId,
            balance: {
              $gte: type === "expense" ? amount : 0,
              $lte: type === "payment"
                ? card.creditLimit - amount
                : card.creditLimit,
            },
          },
          { $inc: { balance: delta } },
          { new: true, session, runValidators: true }
        );

        if (!updatedCard) {
          throw new Error("Balans dəyişib və ya limit kifayət etmir");
        }
      });
    } finally {
      await session.endSession();
    }

    return res.status(201).json({
      message: "Əməliyyat uğurla yaradıldı",
      transaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Əməliyyat zamanı xəta baş verdi",
      error: error.message,
    });
  }
};


export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("card", "bank name")
      .sort({ createdAt: -1 });

    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({
      message: "Transaction-lar gətirilə bilmədi",
      error: error.message,
    });
  }
};