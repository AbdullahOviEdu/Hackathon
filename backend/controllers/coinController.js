const UserCoins = require('../models/UserCoins');

// Get user's coins
const getUserCoins = async (req, res) => {
  try {
    const userId = req.user._id;
    const userModel = req.user.role === 'teacher' ? 'Teacher' : 'Student';
    
    let userCoins = await UserCoins.findOne({ userId });
    
    if (!userCoins) {
      userCoins = await UserCoins.create({ 
        userId, 
        userModel,
        coins: 0 
      });
    }
    
    res.json({ coins: userCoins.coins });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coins', error: error.message });
  }
};

// Add coins to user
const addCoins = async (req, res) => {
  try {
    const userId = req.user._id;
    const userModel = req.user.role === 'teacher' ? 'Teacher' : 'Student';
    const { amount, questionId } = req.body;
    
    // Validate amount
    const coinAmount = parseInt(amount);
    if (isNaN(coinAmount) || coinAmount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid coin amount' 
      });
    }
    
    // Maximum coins per request to prevent abuse
    if (coinAmount > 10) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot add more than 10 coins at once' 
      });
    }
    
    let userCoins = await UserCoins.findOne({ userId });
    
    if (!userCoins) {
      userCoins = await UserCoins.create({ 
        userId, 
        userModel,
        coins: coinAmount 
      });
      console.log(`Created new user coins record with ${coinAmount} coins`);
    } else {
      userCoins.coins += coinAmount;
      userCoins.lastUpdated = Date.now();
      await userCoins.save();
      console.log(`Added ${coinAmount} coins to user. New total: ${userCoins.coins}`);
    }
    
    res.json({ 
      success: true,
      coins: userCoins.coins 
    });
  } catch (error) {
    console.error('Error adding coins:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error adding coins', 
      error: error.message 
    });
  }
};

module.exports = {
  getUserCoins,
  addCoins
}; 