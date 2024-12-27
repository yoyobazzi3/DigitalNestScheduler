const express = require('express')
const pool = require('./database')
const port = 3000

const app = express()
app.use(express.json())
app.use(cors());



app.listen(port, () => console.log(`Server has started on port: ${port}`))