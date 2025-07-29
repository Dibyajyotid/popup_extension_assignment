// Function to extract profile data
function extractProfileData() {
  // LinkedIn's structure changes frequently, these selectors might need adjustment
  const name =
    document.querySelector(".text-heading-xlarge")?.innerText.trim() || "";
  const about =
    document
      .querySelector(".pv-about-section .pv-about__summary-text")
      ?.innerText.trim() || "";
  const bio =
    document
      .querySelector(".pv-shared-text-with-see-more .visually-hidden")
      ?.innerText.trim() || "";
  const location =
    document
      .querySelector(".pv-text-details__left-panel .text-body-small")
      ?.innerText.trim() || "";

  // Follower count - this selector is particularly fragile
  const followerCountText =
    document
      .querySelector(".pv-recent-activity-section__follower-count")
      ?.innerText.trim() || "";
  const followerCount = followerCountText
    ? parseInt(followerCountText.replace(/\D+/g, ""))
    : 0;

  // Connection count - this selector is particularly fragile
  const connectionCountText =
    document.querySelector(".pv-top-card--list li")?.innerText.trim() || "";
  const connectionCount = connectionCountText
    ? parseInt(connectionCountText.replace(/\D+/g, ""))
    : 0;

  // Bio line - often the headline under the name
  const bioLine =
    document.querySelector(".text-body-medium")?.innerText.trim() || "";

  return {
    name,
    url: window.location.href,
    about,
    bio,
    location,
    followerCount,
    connectionCount,
    bioLine,
  };
}

// Extract data and send to background script
const profileData = extractProfileData();
chrome.runtime.sendMessage(
  {
    action: "profileData",
    data: profileData,
  },
  (response) => {
    if (response.success) {
      // Move to next profile
      window.close(); // Close the tab after processing
    } else {
      console.error("Error:", response.error);
    }
  }
);
