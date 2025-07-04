const { Card } = require("../models");

// Add a new card
exports.addCard = async (req, res) => {
  try {
    const {
      name,
      set,
      releaseYear,
      cardNumber,
      language,
      label,
      certificationNumber,
      holographic,
      address,
      termsAgreed,
      rarity,
      image,
      image2,
      grade,
      subgrade,
      trackingStatus,
      rating,
      trackingID,
      userId,
    } = req.body;

    // Check if the card already exists
    const existingCard = await Card.findOne({ where: { cardNumber } });
    if (existingCard) {
      return res.status(400).json({ message: "Card number already exists." });
    }

    const newCard = await Card.create({
      name,
      set,
      releaseYear,
      cardNumber,
      language,
      label,
      certificationNumber,
      holographic,
      address,
      termsAgreed,
      rarity,
      image,
      image2,
      grade,
      subgrade,
      trackingStatus,
      rating,
      trackingID,
      userId,
    });

    res
      .status(201)
      .json({ message: "Card added successfully.", card: newCard });
  } catch (error) {
    console.error("Error adding card:", error);
    res
      .status(500)
      .json({ message: "Error adding card.", error: error.message });
  }
};

// Get all cards
// exports.getAllCards = async (req, res) => {
//   try {
//     const cards = await Card.findAll();
//     res.status(200).json(cards);
//   } catch (error) {
//     console.error("Error fetching cards:", error);
//     res.status(500).json({ message: "Error fetching cards.", error: error.message });
//   }
// };
exports.getAllCards = async (req, res) => {
  try {
    const cards = await Card.findAll({
      order: [["cardNumber", "ASC"]], // You can change 'ASC' to 'DESC' if needed
    });
    res.status(200).json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    res
      .status(500)
      .json({ message: "Error fetching cards.", error: error.message });
  }
};

// Get a card by cardNumber
exports.getCardByCardNumber = async (req, res) => {
  try {
    const { cardNumber } = req.params;
    const card = await Card.findOne({ where: { cardNumber } });
    if (!card) {
      return res.status(404).json({ message: "Card not found." });
    }
    res.status(200).json(card);
  } catch (error) {
    console.error("Error fetching card by card number:", error);
    res
      .status(500)
      .json({ message: "Error fetching card.", error: error.message });
  }
};

// Update card trackingStatus
exports.updateCardTrackingStatus = async (req, res) => {
  try {
    const { cardNumber } = req.params;
    const { trackingStatus, trackingID } = req.body;

    const card = await Card.findOne({ where: { cardNumber } });
    if (!card) {
      return res.status(404).json({ message: "Card not found." });
    }

    await Card.update(
      { trackingStatus, trackingID },
      { where: { cardNumber } }
    );

    res
      .status(200)
      .json({ message: "Card tracking status updated successfully." });
  } catch (error) {
    console.error("Error updating card tracking status:", error);
    res.status(500).json({
      message: "Error updating card tracking status.",
      error: error.message,
    });
  }
};

// Update card details
exports.updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      set,
      releaseYear,
      language,
      label,
      certificationNumber,
      cardNumber,
      address,
      termsAgreed,
      holographic,
      rarity,
      image,
      image2,
      grade,
      subgrade,
      trackingStatus,
      rating,
      trackingID,
      userId,
    } = req.body;

    // Find the card by cardNumber
    const card = await Card.findOne({ where: { id } });
    if (!card) {
      return res.status(404).json({ message: "Card not found." });
    }

    // Update the card with all fields
    await card.update({
      name,
      set,
      releaseYear,
      language,
      label,
      certificationNumber,
      cardNumber,
      address,
      termsAgreed,
      holographic,
      rarity,
      image,
      image2,
      grade,
      subgrade,
      trackingStatus,
      rating,
      trackingID,
      userId,
    });

    res.status(200).json({ message: "Card updated successfully.", card });
  } catch (error) {
    console.error("Error updating card details:", error);
    res
      .status(500)
      .json({ message: "Error updating card details.", error: error.message });
  }
};

// Delete a card by cardNumber
exports.deleteCardByCardNumber = async (req, res) => {
  try {
    const { cardNumber } = req.params;
    const card = await Card.findOne({ where: { cardNumber } });
    if (!card) {
      return res.status(404).json({ message: "Card not found." });
    }

    await Card.destroy({ where: { cardNumber } });

    res.status(200).json({ message: "Card deleted successfully." });
  } catch (error) {
    console.error("Error deleting card:", error);
    res
      .status(500)
      .json({ message: "Error deleting card.", error: error.message });
  }
};

exports.getCardByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const cards = await Card.findAll({
      where: { userId },
    });

    if (cards.length === 0) {
      return res.status(404).json({ message: "No cards found for this user." });
    }

    res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cards.", error });
  }
};

/**
 * Get card by userId and cardNumber
 */
exports.getCardByUserIdAndCardNumber = async (req, res) => {
  const { userId, cardNumber } = req.params;

  try {
    const card = await Card.findOne({
      where: { userId, cardNumber },
    });

    if (!card) {
      return res
        .status(404)
        .json({ message: "Card not found for this user and card number." });
    }

    res.status(200).json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch card.", error });
  }
};

// Get all cards with termsAgreed = false (new orders)
exports.getNewOrders = async (req, res) => {
  try {
    const cards = await Card.findAll({
      where: { termsAgreed: false },
      order: [["cardNumber", "ASC"]], // Optional: keep your existing sorting
    });

    if (cards.length === 0) {
      return res.status(404).json({ message: "No new orders found." });
    }

    res.status(200).json(cards);
  } catch (error) {
    console.error("Error fetching new orders:", error);
    res.status(500).json({
      message: "Error fetching new orders.",
      error: error.message,
    });
  }
};

exports.addCardDirect = async (req, res) => {
  try {
    const {
      name,
      set,
      releaseYear,
      cardNumber,
      language,
      label,
      certificationNumber,
      holographic,
      address,
      termsAgreed,
      rarity,
      image,
      image2,
      grade,
      subgrade,
      trackingStatus,
      rating,
      trackingID,
      userId,
    } = req.body;

    const newCard = await Card.create({
      name,
      set,
      releaseYear,
      cardNumber,
      language,
      label,
      certificationNumber,
      holographic,
      address,
      termsAgreed,
      rarity,
      image,
      image2,
      grade,
      subgrade,
      trackingStatus,
      rating,
      trackingID,
      userId,
    });

    res
      .status(201)
      .json({ message: "Card added successfully.", card: newCard });
  } catch (error) {
    console.error("Error adding card:", error);
    res
      .status(500)
      .json({ message: "Error adding card.", error: error.message });
  }
};
