require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

mongoose.connect(process.env.MONGO_DB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
})

app.use(cors({origin: ['https://cuvette-assignment-frontend.vercel.app', 'http://localhost:3000'], credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req,res) => {
    res.send('Server is running');
})

app.listen(5000, () => {
    console.log('Server is running on port 5000');
})

//routes import
const user = require('./routes/userRoute');
const auth = require('./routes/authRoute');
const note = require('./routes/noteRoute');

app.use('/api/user', user);
app.use('/api/auth', auth);
app.use('/api/note', note);

//error handling
app.use((err,req,res,next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        error : message,
        statusCode: statusCode,
    })
})

//404 error handling
app.get("*", (req,res)=>{
    res.status(404).json({
        message: "Route not found",
        status: 404
    })
})

module.exports = app;