const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors")
const app = express();

app.use(express.json()); // for parsing application/json
app.use(cors())

// MongoDB connection (replace with your MongoDB URI)
mongoose.connect('mongodb://localhost:27017/digitalBusinessCard');
console.log("DataBase connect Successfully")

// Define the schema for contact form submissions
const contactFormSchema = new mongoose.Schema({
    ownerId: String,
    name: String,
    designation: String,
    number: String,
    email: String,
    organization: String,
    createdAt: { type: Date, default: Date.now }
});

// // Create a model for the schema
const ContactForm = mongoose.model('ContactForm', contactFormSchema);

app.get("/", (req, res) => {
    return res.end("<h1>Digital Business Card api</h1>")
}
)

// // API endpoint to handle form submissions
app.post('/api/store-contact-form', async (req, res) => {
    const { ownerId } = req.query;
    const { name, designation, number, email, organization } = req.body;

    // Create a new record in the database
    const newContactForm = new ContactForm({
        ownerId,
        name,
        designation,
        number,
        email,
        organization,
    });

    try {
        await newContactForm.save();  // Save the form submission to the database
        res.json({ success: true, message: 'Form submission saved successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error saving form submission.' });
    }
});

// for get perticlur data user api is here
app.get('/api/get-submissions', async (req, res) => {
    const { ownerId } = req.query;  // Assume ownerId is passed in the query string

    try {
        const submissions = await ContactForm.find({ ownerId });
        res.json(submissions);  // Send the list of submissions to the client
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching submissions.' });
    }
});


// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
