import Item from '../schema/itemSchema.js';

// Fetch all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

// Add a new item
export const addItem = async (req, res) => {
  try {
    const { name, category, brandname, images } = req.body;
    const newItem = await Item.create({ name, category, brandname, images });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item' });
  }
};
