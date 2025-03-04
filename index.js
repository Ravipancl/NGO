const mongoose = require("mongoose")
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {PORT, DATABASE_URL} = require("./config")
const passport = require("./Services/googleauth");
const authRouter = require("./ROUTES/auth");



const app = express();
const adminRouter = require("./ROUTES/admin");
const { authMiddleware } = require("./MIDDLEWARE/auth");

// connect to mongoDB
mongoose
    .connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
        console.error("MongoDB Connection Error:", err);
        process.exit(1); // Exit the process if the connection fails
    });


// to access the body when server res in json file bcoz express doesn't 
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, // Allow cookies to be sent
  })
);

// Apply authentication middleware
authMiddleware(app);

// Routes
app.use('/admin', adminRouter);
app.use("/", authRouter);

//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})