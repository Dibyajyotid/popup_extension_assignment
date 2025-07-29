// Content script to scrape LinkedIn profile data
window.chrome = window.chrome || {};
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrapeProfile") {
    try {
      const profileData = scrapeLinkedInProfile();
      sendResponse({ success: true, data: profileData });
    } catch (error) {
      console.error("Error scraping profile:", error);
      sendResponse({ success: false, error: error.message });
    }
  }
});

function scrapeLinkedInProfile() {
  // Wait for page to fully load
  const maxWaitTime = 10000; // 10 seconds
  const startTime = Date.now();

  // Helper function to safely get text content
  function getTextContent(selector) {
    const element = document.querySelector(selector);
    return element ? element.textContent.trim() : "";
  }

  // Helper function to extract numbers from text
  function extractNumber(text) {
    if (!text) return 0;
    const match = text.match(/[\d,]+/);
    return match ? Number.parseInt(match[0].replace(/,/g, "")) : 0;
  }

  // Get profile URL
  const url = window.location.href;

  // Get name - try multiple selectors
  const name =
    getTextContent("h1.text-heading-xlarge") ||
    getTextContent("h1.break-words") ||
    getTextContent(".pv-text-details__left-panel h1") ||
    getTextContent(".ph5 h1");

  // Get location
  const location =
    getTextContent(".text-body-small.inline.t-black--light.break-words") ||
    getTextContent(".pv-text-details__left-panel .text-body-small") ||
    getTextContent(".ph5 .text-body-small");

  // Get bio/headline
  const bio =
    getTextContent(".text-body-medium.break-words") ||
    getTextContent(".pv-text-details__left-panel .text-body-medium") ||
    getTextContent(".ph5 .text-body-medium");

  // Get about section
  let about = "";
  const aboutSection =
    document.querySelector("#about") ||
    document.querySelector('[data-section="summary"]');
  if (aboutSection) {
    const aboutContainer = aboutSection.closest("section");
    if (aboutContainer) {
      const aboutText =
        aboutContainer.querySelector(
          ".pv-shared-text-with-see-more .inline-show-more-text"
        ) ||
        aboutContainer.querySelector(".pv-about__summary-text") ||
        aboutContainer.querySelector(".text-body-medium");
      about = aboutText ? aboutText.textContent.trim() : "";
    }
  }

  // Get follower count
  let followerCount = 0;
  const followerElement =
    document.querySelector(".pv-top-card--followers-count") ||
    document.querySelector(".top-card__profile-stats__followers-count") ||
    document.querySelector('[data-test-id="follower-count"]') ||
    document.querySelector('a[href*="followers"] span');

  if (followerElement) {
    followerCount = extractNumber(followerElement.textContent);
  }

  // Get connection count
  let connectionCount = 0;
  const connectionElement =
    document.querySelector(".pv-top-card--connections") ||
    document.querySelector(".top-card__profile-stats__connections-count") ||
    document.querySelector('[data-test-id="connection-count"]') ||
    document.querySelector('a[href*="connections"] span');

  if (connectionElement) {
    connectionCount = extractNumber(connectionElement.textContent);
  }

  // If we couldn't find specific counts, try alternative selectors
  if (followerCount === 0 || connectionCount === 0) {
    const networkInfo = document.querySelector(".pv-top-card--list-bullet li");
    if (networkInfo) {
      const networkText = networkInfo.textContent;
      if (networkText.includes("connection")) {
        connectionCount = extractNumber(networkText);
      }
    }
  }

  return {
    name: name || "Unknown",
    url: url,
    about: about || "",
    bio: bio || "",
    location: location || "",
    followerCount: followerCount,
    connectionCount: connectionCount,
  };
}
