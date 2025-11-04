// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;




const sqlite3 = require('sqlite3');


const db = new sqlite3.Database('./scholl.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {


    return console.error(err.message);


  } else {

    return console.log('Connected to the SQLite database.');
  }



});



const table = `CREATE TABLE student(id INTEGER PRIMARY KEY, s_id, fristname , surname,  course)`;


db.run(table, (err) => {
  if (err) {

    return console.error(err.message);

  } else {

    return console.log('Table created.');
  }


}





)