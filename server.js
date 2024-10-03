
// Import some dependencies/ packages
const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');


app.use(express.json());
app.use(cors());
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


db.connect((err) => {
    if(err) return console.log("Error connecting to MYSQL");

    console.log("Connected to MYSQL as id: ", db.threadId);
})


//Your code goes here
//GET METHOD example

app.set('view engine method', 'ejs');
app.set('views', __dirname + '/views');

//Data is the name of the file inside views folder
// Question 1: Retrieve all patients
app.get('/data', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
  // Question 2: Retrieve all providers
  app.get('/data2', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
  // Question 3: Filter patients by first name
  app.get('/data3/filter', (req, res) => {
    const firstName = req.query.first_name;
    if (!firstName) {
      return res.status(400).json({ error: 'First name is required' });
    }
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [firstName], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
  // Question 4: Retrieve all providers by their specialty
  app.get('/data4/filter', (req, res) => {
    const specialty = req.query.provider_specialty;
    if (!specialty) {
      return res.status(400).json({ error: 'Provider specialty is required' });
    }
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(query, [specialty], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);

    console.log('Sending message to browser...');
    app.get('/', (req,res) => {
        res.send('Server Started Successfully!');
    });

});