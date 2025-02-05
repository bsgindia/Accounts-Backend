const express = require("express");
const session = require('express-session');
const cors = require("cors");
const dotenv = require("dotenv");
const connectToDatabase = require("./src/config/db");
const authadmin = require('./src/routes/auth.routes.js');
const bankRoutes = require('./src/routes/bankRoutes.routes.js');
const fundRoutes = require('./src/routes/funds.routes.js'); 
const fdRoutes = require('./src/routes/fd.routes');
const particularsRoutes= require("./src/routes/particular.routes.js");
const liabilityRoutes= require("./src/routes/liability.routes.js");
const receivableRoutes=require("./src/routes/receivable.routes.js");
const receivableDetailsRoutes=require("./src/routes/receivabledeatails.routes.js");
const receivableAmountRoutes=require("./src/routes/receivableamount.routes.js")
const stateRoutes = require('./src/routes/state.routes.js');
dotenv.config();
const app = express();
app.use(
    cors({
        origin: ["https://accounts.bsgindia.tech", "http://localhost:5173"],
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
        maxAge: 24 * 60 * 60 * 1000,
    },
}));

app.use(express.json())

app.get("/", (req, res) => {
    res.send(200);
});

app.use('/api/auth', authadmin);
app.use('/api/v1/bank-accounts', bankRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/fd', fdRoutes);
app.use('/api/particulars', particularsRoutes);
app.use("/api/v1/liabilities", liabilityRoutes);
app.use("/api/v1/receivable", receivableRoutes);
app.use("/api/v1/receivabledetails",receivableDetailsRoutes);
app.use("/api/v1/receivableamount",receivableAmountRoutes);
app.use('/api/v1', stateRoutes);
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


// const express = require("express");
// const session = require('express-session');
// const cors = require("cors");
// const dotenv = require("dotenv");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const winston = require("winston");
// const connectToDatabase = require("./src/config/db");
// const authadmin = require('./src/routes/auth.routes.js');
// const bankRoutes = require('./src/routes/bankRoutes.routes.js');
// const fundRoutes = require('./src/routes/funds.routes.js');
// const fdRoutes = require('./src/routes/fd.routes');
// const particularsRoutes = require("./src/routes/particular.routes.js");
// const liabilityRoutes = require("./src/routes/liability.routes.js");
// const receivableRoutes = require("./src/routes/receivable.routes.js");
// const receivableDetailsRoutes = require("./src/routes/receivabledeatails.routes.js");
// const receivableAmountRoutes = require("./src/routes/receivableamount.routes.js")
// const stateRoutes = require('./src/routes/state.routes.js');
// dotenv.config();
// const logger = winston.createLogger({
//     level: process.env.LOG_LEVEL || "info",
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.printf(({ timestamp, level, message }) => {
//             return `${timestamp} [${level.toUpperCase()}]: ${message}`;
//         })
//     ),
//     transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({ filename: "server.log" }),
//     ],
// });
// const app = express();

// const allowedOrigins = process.env.ALLOWED_ORIGINS
//     ? process.env.ALLOWED_ORIGINS.split(",")
//     : [];

// app.use((req, res, next) => {
//     const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown IP";
//     const startTime = Date.now();

//     logger.info(`Incoming Request: ${req.method} ${req.url} from IP: ${ip} at ${new Date().toISOString()}`);

//     res.on("finish", () => {
//         const duration = Date.now() - startTime;
//         logger.info(`Completed Request: ${req.method} ${req.url} from IP: ${ip} at ${new Date().toISOString()} - Status: ${res.statusCode} - Duration: ${duration}ms`);
//     });

//     next();
// });

// app.use(
//     cors({
//         origin: allowedOrigins,
//         credentials: true,
//     })
// );

// app.use(session({
//     secret: process.env.SESSION_SECRET || 'default-secret-key',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: process.env.NODE_ENV === 'production',
//         httpOnly: true,
//         sameSite: "none",
//         maxAge: 24 * 60 * 60 * 1000,
//     },
// }));

// app.use(express.json());
// app.use(helmet());
// app.use(morgan(process.env.NODE_ENV === 'production' ? "combined" : "dev"));

// app.get("/", (req, res) => {
//     logger.info("Root endpoint hit.");
//     res.sendStatus(200);
// });

// app.use('/api/auth', authadmin);
// app.use('/api/v1/bank-accounts', bankRoutes);
// app.use('/api/funds', fundRoutes);
// app.use('/api/fd', fdRoutes);
// app.use('/api/particulars', particularsRoutes);
// app.use("/api/v1/liabilities", liabilityRoutes);
// app.use("/api/v1/receivable", receivableRoutes);
// app.use("/api/v1/receivabledetails", receivableDetailsRoutes);
// app.use("/api/v1/receivableamount", receivableAmountRoutes);
// app.use('/api/v1', stateRoutes);
// const startServer = async () => {
//     try {
//         logger.info("Starting server...");
//         await connectToDatabase();
//         logger.info("Database connected successfully.");
//         const PORT = process.env.PORT || 5001;
//         app.listen(PORT, () => {
//             logger.info(`Server is running on port ${PORT}`);
//         });
//     } catch (error) {
//         logger.error(`Error connecting to the database: ${error.message}`);
//         process.exit(1);
//     }
// };
// startServer();

// process.on("SIGINT", async () => {
//     logger.info("Shutting down gracefully...");
//     await mongoose.connection.close();
//     logger.info("Database connection closed.");
//     process.exit(0);
// });