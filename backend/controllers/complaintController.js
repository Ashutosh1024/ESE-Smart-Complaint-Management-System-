const Complaint = require('../models/Complaint');

// @route   POST /api/complaints
// @desc    Add Complaint
// @access  Private
exports.addComplaint = async (req, res) => {
    const { name, email, title, description, category, location } = req.body;

    try {
        if (!title) {
            return res.status(400).json({ message: 'Validation error: Title is required' });
        }

        const newComplaint = new Complaint({
            name,
            email,
            title,
            description,
            category,
            location
        });

        const complaint = await newComplaint.save();
        res.json({ message: 'Complaint stored successfully', complaint });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error message: ' + err.message });
    }
};

// @route   GET /api/complaints
// @desc    Get All Complaints
// @access  Private
exports.getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   PUT /api/complaints/:id
// @desc    Update Complaint Status
// @access  Private (Admin typically, but sticking to simple auth here)
exports.updateComplaintStatus = async (req, res) => {
    const { status } = req.body;

    try {
        let complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        complaint.status = status;
        await complaint.save();

        res.json(complaint);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/complaints/search
// @desc    Search Complaint by Location
// @access  Private
exports.searchComplaints = async (req, res) => {
    const { location } = req.query;

    try {
        if (!location) {
            return res.status(400).json({ message: 'Please provide a location to search' });
        }

        // Case-insensitive search using regex
        const complaints = await Complaint.find({ location: { $regex: location, $options: 'i' } });
        res.json(complaints);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
