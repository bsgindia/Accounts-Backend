const mongoose = require("mongoose");


const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "super-admin"],
        default: "admin",
    },
},{timestamps:true});

const admin = mongoose.model("admin", authSchema);

module.exports=admin;