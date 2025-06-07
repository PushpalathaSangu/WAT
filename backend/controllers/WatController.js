const Wat = require('../models/Wat');

exports.getAllWats = async (req, res) => {
  try {
    const wats = await Wat.find({});
    res.status(200).json(wats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching WATs', error });
  }
};
