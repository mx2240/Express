// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var AccountRouter = require('./routes/Account');
// // n


// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/Account', AccountRouter);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });


// app.listen(3000, () => {
//     console.log('sever running on port 3000');
// })


// module.exports = app;

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