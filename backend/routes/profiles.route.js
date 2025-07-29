const express = require("express");
const Profile = require("../models/profile.model.js");
const router = express.Router();

// POST API to create a new profile
router.post("/", async (req, res) => {
  try {
    const { name, url, about, bio, location, followerCount, connectionCount } =
      req.body;

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ where: { url } });

    if (existingProfile) {
      // Update existing profile
      await existingProfile.update({
        name,
        about,
        bio,
        location,
        followerCount,
        connectionCount,
      });

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: existingProfile,
      });
    }

    // Create new profile
    const profile = await Profile.create({
      name,
      url,
      about,
      bio,
      location,
      followerCount,
      connectionCount,
    });

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error creating profile",
      error: error.message,
    });
  }
});

// GET API to fetch all profiles
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: profiles,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profiles",
      error: error.message,
    });
  }
});

module.exports = router;
