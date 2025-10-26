const express = require('express');
const { body, validationResult } = require('express-validator');
const { Wallet } = require('../models');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Connect wallet
router.post('/connect', verifyToken, [
  body('public_key').trim().isLength({ min: 56, max: 56 }),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { public_key } = req.body;

    // Validate Stellar public key format
    if (!public_key.startsWith('G')) {
      return res.status(400).json({ message: 'Invalid Stellar public key format' });
    }

    // Check if wallet already exists
    let wallet = await Wallet.findOne({ where: { publicKey: public_key } });
    
    if (wallet) {
      if (wallet.userId !== req.user.id) {
        return res.status(400).json({ message: 'Wallet already connected to another account' });
      }
    } else {
      // Create new wallet
      wallet = await Wallet.create({
        userId: req.user.id,
        publicKey: public_key,
        isConnected: true,
        xlmBalance: 0,
        usdcBalance: 0,
      });
    }

    res.json(wallet);
  } catch (error) {
    next(error);
  }
});

// Get wallet balance
router.get('/:id/balance', verifyToken, async (req, res, next) => {
  try {
    const wallet = await Wallet.findByPk(req.params.id);
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (wallet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not enough permissions' });
    }

    res.json(wallet);
  } catch (error) {
    next(error);
  }
});

// Get user's wallet
router.get('/user/:userId', verifyToken, async (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(req.params.userId)) {
      return res.status(403).json({ message: 'Not enough permissions' });
    }

    const wallet = await Wallet.findOne({ where: { userId: req.params.userId } });
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json(wallet);
  } catch (error) {
    next(error);
  }
});

// Disconnect wallet
router.post('/:id/disconnect', verifyToken, async (req, res, next) => {
  try {
    const wallet = await Wallet.findByPk(req.params.id);
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (wallet.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not enough permissions' });
    }

    wallet.isConnected = false;
    await wallet.save();

    res.json({ message: 'Wallet disconnected successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
