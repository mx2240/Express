

const express = require('express');
const app = express();
const port = 5000;
const AccountRouter = require('./routes/Account');
const PageRouter = require('./routes/Pages');
const UserRouter = require('./routes/users');



app.use('/', AccountRouter);
app.use('/', PageRouter);
app.use('/', UserRouter);




// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});


module.exports = app;