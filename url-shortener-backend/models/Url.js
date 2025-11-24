const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: String,
        required: true,
    },
    urlCode: {
        type: String,
        required: true,
        unique: true,
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    expiresAt: {
        type: Date,
        default: null,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

urlSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});
module.exports = mongoose.model('Url', urlSchema);
