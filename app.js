require('./connection');
const express = require('express');
const student = require('./routers/student-api');
const admin = require('./routers/admin-api');
const book = require('./routers/book-api');
const booking = require('./routers/booking-api');
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs');
app.use(express.json());

app.use('/', student);
app.use("/books", book);
app.use("/admin",admin);
app.use('/booking',booking);
app.set('views', [path.join(__dirname, 'views'),
path.join(__dirname, 'views/book/'),
path.join(__dirname, 'views/student/'),
path.join(__dirname, 'views/admin/')]);


app.listen(4000, (req, res) => {
    console.log("Server is listening...");
});
