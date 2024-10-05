const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors")
const app = express();
const dotenv = require("dotenv").config();
const PORT = 5000

app.use(express.json()); // for parsing application/json
app.use(cors())

// MongoDB connection (replace with your MongoDB URI)
mongoose.connect(process.env.DB_URL);
console.log("DataBase connect Successfully")

// nested links schema
const linksSchema = new mongoose.Schema({
    whatsapp: {type: String,default:undefined},
    instagram: {type: String,default:undefined},
    facebook: {type: String,default:undefined},
    mail: {type: String,default:undefined},
    website: {type: String,default:undefined},
    linkedin: {type: String,default:undefined} // Corrected spelling to 'linkedin'
});

// Define the schema for contact form submissions
const contactFormSchema = new mongoose.Schema({
    ownerId: String,
    name: String,
    designation: String,
    number: String,
    email: String,
    organization: String,
    links: linksSchema, // Embedding the nested schema
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





app.patch("/api/links", async (req, res) => {
    const { ownerId } = req.query; // Extract ownerId from query parameters
    const { links } = req.body;     // Extract links object from request body

    // Validation for optional fields
    const validLinks = {};
    if (links) {
        if (links.whatsapp) {
            validLinks.whatsapp = links.whatsapp;
        }
        if (links.instagram) {
            validLinks.instagram = links.instagram;
        }
        if (links.facebook) {
            validLinks.facebook = links.facebook;
        }
        if (links.mail) {
            validLinks.mail = links.mail;
        }
        if (links.website) {
            validLinks.website = links.website;
        }
        if (links.linkedin) {
            validLinks.linkedin = links.linkedin;
        }
    }

    try {
        // Update the existing contact form's links
        const updatedContactForm = await ContactForm.findOneAndUpdate(
            { ownerId: ownerId }, // Find by ownerId
            { $set: { links: { ...validLinks } } }, // Update only provided fields
            { new: true, runValidators: true } // Return updated document
        );

        // Check if the document was found and updated
        if (!updatedContactForm) {
            return res.status(404).json({
                success: false,
                message: "Owner not found.",
            });
        }

        // Return success response
        return res.status(200).json({
            success: true,
            message: "Links updated successfully",
            updatedContactForm
        });

    } catch (error) {
        console.error("Error updating links:", error);
        return res.status(500).json({
            success: false,
            message: "Error while updating links",
            error
        });
    }
});



app.get("/api/links", async (req, res) => {
    const { ownerId } = req.query; // Extract ownerId from query parameters

    try {
        // Find the contact form by ownerId
        const contactForm = await ContactForm.findOne({ ownerId: ownerId });

        // Check if the contact form was found
        if (!contactForm) {
            return res.status(404).json({
                success: false,
                message: "Owner not found.",
            });
        }

        // Filter out null values from the links array
        const filteredLinks = contactForm.links ? [contactForm.links].filter(link => link) : [];

        // Return success response with filtered links
        return res.status(200).json({
            success: true,
            message: "Links retrieved successfully",
            links: filteredLinks
        });

    } catch (error) {
        console.error("Error retrieving links:", error);
        return res.status(500).json({
            success: false,
            message: "Error while retrieving links",
            error
        });
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
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
