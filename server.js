const bcrypt = require('bcrypt');
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true }
}));

app.use(express.static('public'));

/* ---------- Работа со слотами ---------- */

function getSlots() {
    if (!fs.existsSync('data.json')) {
        fs.writeFileSync('data.json', JSON.stringify({
            slots: Array(16).fill(false)
        }));
    }
    return JSON.parse(fs.readFileSync('data.json')).slots;
}

function saveSlots(slots) {
    fs.writeFileSync('data.json', JSON.stringify({ slots }));
}

/* ---------- Авторизация ---------- */

app.post('/login', async (req, res) => {
    const password = req.body.password;

    const hash = process.env.ADMIN_HASH;

    const match = await bcrypt.compare(password, hash);

    if (match) {
        req.session.isAdmin = true;
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

/* ---------- Слоты ---------- */

app.get('/slots', (req, res) => {
    res.json(getSlots());
});

app.post('/toggle-slot', (req, res) => {
    if (!req.session.isAdmin)
        return res.status(403).json({ error: "Forbidden" });

    const slots = getSlots();
    const index = req.body.index;

    if (index >= 0 && index < slots.length) {
        slots[index] = !slots[index];
        saveSlots(slots);
    }

    res.json({ success: true });
});

app.listen(3000, () =>
    console.log("Server running on http://localhost:3000")
);