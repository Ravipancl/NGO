const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

async function hashP(next) {
    if (!this.isModified("password") || !this.password) return next(); // Skip if password is unchanged

    try {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        console.error("Error hashing password:", error);
        next(error);
    }
};

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["superadmin", "admin"], default: "admin" }
});
AdminSchema.pre("save", hashP);


// Participant Schema
const ParticipantSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: function(){ return !this.isOAuthUser; }, select: false },
    isOAuthUser: { type: Boolean, default: false},
    eventsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }]
});
ParticipantSchema.pre("save", hashP);

// NGO Schema
const NgoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false},
    verified: { type: Boolean, default: false },
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }]
});
NgoSchema.pre("save", hashP);

// Event Schema
const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: {
        address: String,  // Human-readable address
        latitude: Number, // GPS coordinates
        longitude: Number,
        googleMapsLink: String // Direct link to Google Maps
    },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "Ngo", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Participant" }]
});

const Admin = mongoose.model("Admin", AdminSchema);
const Ngo = mongoose.model("Ngo", NgoSchema);
const Participant = mongoose.model("Participant", ParticipantSchema);
const Event = mongoose.model("Event", EventSchema);

module.exports = {
    Admin,
    Ngo,
    Participant,
    Event
}