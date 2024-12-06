import express from 'express';
import { getAllItems, addItem } from '../controllers/baseCtrl.js';
const router = express.Router();

router.get('/items', getAllItems);
router.post('/items', addItem);

export default router;
