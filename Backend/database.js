const mysql = require('mysql2');


const pool = mysql.createPool({
    host: '100.75.138.62',
    user: 'root',
    password: 'gilroy',
    port: 3306, // MySQL server port
});


const promisePool = pool.promise();

pool.getConnection((err, connection)=>{
    if(err){
        console.error('Error connecting to the databse', err.message);
        return;
    }
    console.log('Connected to the MySQL database successfully!');
    connection.release();
});


module.exports = promisePool;