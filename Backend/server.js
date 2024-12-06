const express = require('express');
const pool = require('./database')
const port = 3000;

const app = express()

app.get('/',async (req,res)=>{
    const {name,location} = req.body
    try{
       const data =  await pool.query('SELECT * FROM schools')
        res.status(200).send({children: data.rows})
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }})

app.post('/', async (req,res) =>{
    const {name,location} = req.body
    try{
        await pool.query('INSERT INTO schools(name, address) VALUES($1,$2)' [name ,location])
        res.status(200).send({message: "Successfully added child"})
    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

app.get('/setup', async (req,res)=>{
    try{
        await pool.query('CREATE TABLE schools (id SERIAL PRIMARY KEY, name VARCHAR(100),address VARCHAR(100))')
        res.status(200).send({message: "Successfully created table"})

    }catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

app.listen(port, ()=> console.log(`server running on port: localhost:${port}`))