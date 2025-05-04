// Tech stack: Node.js (Express), MongoDB (MongoDB Atlas), React (Vite), PDF.js, and free hosting with Render (backend) + Netlify (frontend)

// ----------------------- // Backend: Express server // File: server/index.js // -----------------------

const express = require('express'); const mongoose = require('mongoose'); const cors = require('cors'); const bodyParser = require('body-parser'); require('dotenv').config();

const app = express(); app.use(cors()); app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const KeySchema = new mongoose.Schema({ key: String, ip: String, used: Boolean, isAdmin: Boolean, createdAt: { type: Date, default: Date.now } });

const Key = mongoose.model('Key', KeySchema);

app.post('/api/validate-key', async (req, res) => { const { key } = req.body; const ip = req.ip;

const found = await Key.findOne({ key }); if (!found) return res.status(404).json({ message: 'Invalid key' });

if (found.isAdmin) return res.json({ valid: true, isAdmin: true });

if (found.used && found.ip !== ip) return res.status(403).json({ message: 'Key already used from another IP' });

if (!found.used) { found.ip = ip; found.used = true; await found.save(); }

res.json({ valid: true, isAdmin: false }); });

app.get('/api/pdf', async (req, res) => { const { key } = req.query; const found = await Key.findOne({ key });

if (!found || (found.used && found.ip !== req.ip)) { return res.status(403).send('Access Denied'); }

res.sendFile(__dirname + '/pdfs/yourfile.pdf'); });

const PORT = process.env.PORT || 5000; app.listen(PORT, () => console.log(Server running on port ${PORT}));

// ----------------------- // Frontend: React (Vite) // File: client/src/App.jsx // -----------------------

import React, { useState } from 'react'; import './App.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() { const [key, setKey] = useState(''); const [validated, setValidated] = useState(false); const [error, setError] = useState('');

const handleSubmit = async (e) => { e.preventDefault(); try { const res = await fetch(${BACKEND_URL}/api/validate-key, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }); const data = await res.json(); if (data.valid) { setValidated(true); setError(''); } else { setError('Invalid key'); } } catch (err) { setError('Server error'); } };

return ( <div className="app"> {!validated ? ( <form onSubmit={handleSubmit}> <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter your access key" /> <button type="submit">View PDF</button> {error && <p className="error">{error}</p>} </form> ) : ( <iframe src={${BACKEND_URL}/api/pdf?key=${key}} width="100%" height="600px" title="Secure PDF Viewer" ></iframe> )} </div> ); }

export default App;

