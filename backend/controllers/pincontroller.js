const Pin = require("../model/pin");

const createPin = async (req, res) => {
    const { title, rating, description, username, lat, long } = req.body;

    if (!title || !rating || !description || !username || !lat || !long) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newPin = new Pin(req.body);

    try {
        const savedPin = await newPin.save();
        return res.status(201).json(savedPin);
    } catch (error) {
        console.error('Error saving pin:', error);
        return res.status(500).json({ message: 'Server error!' });
    }
};

const getAllPin = async (req, res) => {
    try {
        const pins = await Pin.find();
        return res.status(200).json(pins);
    } catch (error) {
        return res.status(500).json({ message: 'Server error!' });
    }
};

module.exports = { createPin, getAllPin };
