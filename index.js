const express = require("express");
const session = require('express-session');
const cors = require("cors");
const dotenv = require("dotenv");
const connectToDatabase = require("./src/config/db");
const authadmin = require('./src/routes/auth.routes.js');
const bankRoutes = require('./src/routes/bankRoutes.routes.js')
dotenv.config();
const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 3600000,
    },
}));
app.use(express.json())

app.get("/", (req, res) => {
    res.send(200);
});

app.use('/api/auth', authadmin);
app.use('/api/v1/bank-accounts', bankRoutes);

const startServer = async () => {
    try {
        await connectToDatabase();
        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
        process.exit(1);
    }
};

startServer();