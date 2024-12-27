const mysql = require('mysql2');




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
