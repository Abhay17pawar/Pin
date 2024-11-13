const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const app = express();
const pinRoute = require("./routes/pinroute");
const userRoute = require("./routes/userroute");
const path = require("path");
require('dotenv').config();

const _dirname = path.resolve();

app.use(express.json());
app.use(cookieParser()); 
app.use(cors());
app.use("/api/user",userRoute);
app.use("/api/pins" ,pinRoute);

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => {
    console.log("connected to mongoDB");
})    
.catch(() => {
    console.log("error connecting to mongoDB");
    
})    

app.use(express.static(path.join(_dirname,"/frontend/dist")))
app.use('*',(req,res) => {
    res.sendFile(path.resolve(_dirname,"frontend","dist","index.html"))
})

app.listen(PORT,() => console.log("sevrer is listening on port 3000..."));