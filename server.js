

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/googleKeepClone');

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const noteSchema = new mongoose.Schema({
    text: String,
    label: String,
    userId: mongoose.Schema.Types.ObjectId
});

const User = mongoose.model('User', userSchema);
const Note = mongoose.model('Note', noteSchema);

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered');
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id }, 'secret');
    res.send({ token });
});

app.use(async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Unauthorized');
    try {
        const { userId } = jwt.verify(token, 'secret');
        req.userId = userId;
        next();
    } catch {
        res.status(401).send('Unauthorized');
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.post('/api/notes', async (req, res) => {
    const { text, label } = req.body;
    const note = new Note({
        text,
        label,
        userId: req.userId
    });
    await note.save();
    res.status(201).send(note);
});

app.get('/api/notes', async (req, res) => {
    const notes = await Note.find({ userId: req.userId });
    res.send(notes);
});

app.put('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { text, label } = req.body;
    await Note.findByIdAndUpdate(id, { text, label });
    res.send('Note updated');
});


// deleting a note
app.delete('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send('Invalid ID');
    }
    try {
        const result = await Note.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).send('Note not found');
        }
        res.status(200).send('Note deleted');
    } catch (error) {
        res.status(500).send('Server error');
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
