require('dotenv').config()
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import passport from "passport";
import bodyParser from "body-parser";
var cookieParser = require('cookie-parser');
const app = express();

const port = process.env.PORT || 8000;

const colorText: (textColor: string) => (val: any) => string = (textColor) => (val) => `${textColor}${val}\x1b[0m`;
const goodText = colorText("\x1b[32m");
const errorText = colorText("\x1b[31m");


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB successfully connected !"))
    .catch(err => console.log(`MongoDB error: ${errorText(err)}`));


// Config passport strategies
require("./config/passport")(passport);


// Enable parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.SECRET));
app.use(cors());


app.all('/api/v1/test', (req, res) => {
    return res.status(200).json({
        message: "good"
    })
})

// Routes
app.use("/api/v1/auth", require("./routes/api/auth"));
//use auth on all other api/v1 routes
app.use("/api/v1", passport.authenticate('jwt-cookiecombo', { session: false }));

//test route on auth route
app.all('/api/v1/test', (req, res) => {
    res.status(200).send("Authenticated");
})


app.all("*", (req, res) => {
    return res.status(404);
})


app.listen(port, () => console.log(`Server up and running on port ${goodText(port)} !`));