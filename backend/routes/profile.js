const express = require("express");
const Profile = require("../models/profile.js");
const router = express.Router();

// 🟢 Add or update profile
router.post("/", async (req, res) => {
  try {
    const { name, url, about, bio, location, followerCount, connectionCount } =
      req.body;

    const existing = await Profile.findOne({ where: { url } });

    if (existing) {
      await existing.update({
        name,
        about,
        bio,
        location,
        followerCount,
        connectionCount,
      });
      return res
        .status(200)
        .json({ message: "Profile updated", profile: existing });
    }

    const newProfile = await Profile.create({
      name,
      url,
      about,
      bio,
      location,
      followerCount,
      connectionCount,
    });
    res.status(201).json({ message: "Profile created", profile: newProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔵 Get all profiles
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.findAll({ order: [["createdAt", "DESC"]] });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
