const mongoose = require('mongoose');
const connectToDatabase = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
        const db = mongoose.connection.db;
        const stats = await db.stats();
        const dataSizeMB = (stats.dataSize / 1048576).toFixed(2);
        const storageSizeMB = (stats.storageSize / 1048576).toFixed(2);
        const indexSizeMB = (stats.indexSize / 1048576).toFixed(2)

        console.log(`Database Size: ${dataSizeMB} MB`);
        console.log(`Storage Size: ${storageSizeMB} MB`);
        console.log(`Index Size: ${indexSizeMB} MB`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

module.exports = connectToDatabase;