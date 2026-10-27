import Card from "../models/Card.js";

export const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const totalBalance = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createCard = async (req, res) => {
  try {
    const { user, bank, name, balance } = req.body;

    const card = await Card.create({
      user,
      bank,
      name,
      balance,
    });

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
