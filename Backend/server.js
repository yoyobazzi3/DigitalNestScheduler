import express from 'express';
import cors from 'cors'
const app = express();
import db from './database.js'


app.use(express.json());
app.use(cors())

// Your middleware and routes here
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
