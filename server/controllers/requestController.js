const Request = require("../models/Request");
const Donor = require("../models/Donor");
const { parseRequestText } = require("../ai/parseRequest");

// POST /api/requests  (requester types a plain sentence)
const createRequest = async (req, res) => {
  try {
    const { text } = req.body; // e.g. "Need O negative blood urgently for my father in Dehradun"

    const parsed = await parseRequestText(text);

    const request = await Request.create({
      requester: req.user.id,
      rawText: text,
      bloodType: parsed.bloodType,
      city: parsed.city,
      urgency: parsed.urgency,
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/requests/:id/matches  (simple same-city + matching blood type search)
const getMatches = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const donors = await Donor.find({
      city: new RegExp(`^${request.city}$`, "i"),
      bloodType: request.bloodType,
      available: true,
    }).populate("user", "name email");

    res.json({ request, matches: donors });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createRequest, getMatches };
