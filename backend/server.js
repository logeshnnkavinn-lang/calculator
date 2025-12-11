const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// #region agent log helper
const DEBUG_ENDPOINT = 'http://127.0.0.1:7242/ingest/fd4c1e6a-b2b7-4a70-9236-270436ac30cb';
if (typeof fetch === 'undefined') {
    // Node <18 fallback for fetch so logging works everywhere
    global.fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
}
const agentLog = (payload) => {
    return fetch(DEBUG_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionId: 'debug-session',
            runId: 'pre-fix',
            timestamp: Date.now(),
            ...payload
        })
    }).catch(() => {});
};
// #endregion
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// --- 1. Database Connection (Unga Link) ---
// Note: 'LoveProDB' nu pudhu database name vachiruken
mongoose.connect("mongodb+srv://logeshnnkavinn_db_user:Logeshnnkavinn7@cluster0.z9yk07k.mongodb.net/lovecalcpro?appName=Cluster0")
.then(() => {
    console.log("✅ Database Connected Successfully!");
    // #region agent log
    agentLog({
        hypothesisId:'A',
        location:'server.js:mongoose.connect.then',
        message:'Mongo connected',
        data:{readyState: mongoose.connection.readyState}
    });
    // #endregion
})
.catch(err => console.log("❌ DB Connection Error:", err));

// --- 2. Schema (Namma thevaiyana details) ---
const UserSchema = new mongoose.Schema({
    myName: String,
    partnerName: String,
    myAge: String,
    partnerAge: String,
    place: String,
    college: String,
    degree: String,
    percentage: String,
    date: { type: Date, default: Date.now }
});
const LoveMatch = mongoose.model("lovecalcpro", UserSchema , "lovecalcpro");

// --- 3. Calculation Logic (API) ---
app.post('/api/calculate', async (req, res) => {
    const { myName, partnerName, myAge, partnerAge, place, college, degree } = req.body;

    // Logic: College name perusa irundha extra marks! 😉
    let percentage = Math.floor(Math.random() * (100 - 60 + 1)) + 60; // 60 to 100%
    
    if (college && college.length > 5) percentage += 5;
    if (percentage > 100) percentage = 100;

    // #region agent log
    agentLog({
        hypothesisId:'B',
        location:'server.js:/api/calculate:entry',
        message:'Calculate request payload',
        data:{myName,partnerName,place,college,degree}
    });
    // #endregion

    // Save to Database
    const newData = new LoveMatch({
        myName, partnerName, myAge, partnerAge, place, college, degree,
        percentage: percentage + "%"
    });
    
    // #region agent log
    agentLog({
        hypothesisId:'C',
        location:'server.js:/api/calculate:pre-save',
        message:'Document before save',
        data:{percentage: newData.percentage}
    });
    // #endregion

    await newData.save();
    console.log("💾 Data Saved to MongoDB:", myName, "&", partnerName);

    // #region agent log
    agentLog({
        hypothesisId:'D',
        location:'server.js:/api/calculate:post-save',
        message:'Save succeeded',
        data:{id:newData._id,percentage:newData.percentage}
    });
    // #endregion

    res.json({ success: true, result: percentage });
});

// Start Server
app.listen(5000, () => console.log("🚀 Server Started on Port 5000"));