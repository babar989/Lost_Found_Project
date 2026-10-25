const router = require('express').Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ msg: 'Naam, email, mozu aur paigham lazmi hain.' });
    }

    const newContact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
    });

    res.status(201).json({
      msg: 'Shukriya! Aapka paigham hamari team tak pohnch gaya hai. Hum jald rabta karein ge.',
      id: newContact._id,
    });
  } catch (e) {
    res.status(500).json({ msg: 'Paigham bhejne mein masla hua: ' + e.message });
  }
});

module.exports = router;
