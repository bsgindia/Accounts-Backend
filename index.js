// const express = require("express");
// const session = require('express-session');
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectToDatabase = require("./src/config/db");
// const authadmin = require('./src/routes/auth.routes.js');
// const bankRoutes = require('./src/routes/bankRoutes.routes.js');
// const fundRoutes = require('./src/routes/funds.routes.js'); 
// const fdRoutes = require('./src/routes/fd.routes');
// const particularsRoutes= require("./src/routes/particular.routes.js");
// const liabilityRoutes= require("./src/routes/liability.routes.js")
// dotenv.config();
// const app = express();
// app.use(
//     cors({
//         origin: ["https://accounts.bsgindia.tech", "http://localhost:5173"],
//         credentials: true,
//     })
// );
// app.use(session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false,
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000,
//     },
// }));

// app.use(express.json())

// app.get("/", (req, res) => {
//     res.send(200);
// });

// app.use('/api/auth', authadmin);
// app.use('/api/v1/bank-accounts', bankRoutes);
// app.use('/api/funds', fundRoutes);
// app.use('/api/fd', fdRoutes);
// app.use('/api/particulars', particularsRoutes);
// app.use("/api/v1/liabilities", liabilityRoutes);
// const startServer = async () => {
//     try {
//         await connectToDatabase();
//         const PORT = process.env.PORT || 5001;
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     } catch (error) {
//         console.error("Error connecting to the database:", error.message);
//         process.exit(1);
//     }
// };

// startServer();



const express = require("express");
const session = require('express-session');
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const connectToDatabase = require("./src/config/db");
const authadmin = require('./src/routes/auth.routes.js');
const bankRoutes = require('./src/routes/bankRoutes.routes.js');
const fundRoutes = require('./src/routes/funds.routes.js'); 
const fdRoutes = require('./src/routes/fd.routes');
const particularsRoutes= require("./src/routes/particular.routes.js");
const liabilityRoutes= require("./src/routes/liability.routes.js")
dotenv.config();

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
    },
}));

app.use(express.json());
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? "combined" : "dev"));

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.use('/api/auth', authadmin);
app.use('/api/v1/bank-accounts', bankRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/fd', fdRoutes);
app.use('/api/particulars', particularsRoutes);
app.use("/api/v1/liabilities", liabilityRoutes);

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

process.on("SIGINT", async () => {
    console.log("Shutting down gracefully...");
    await mongoose.connection.close();
    process.exit(0);
});
