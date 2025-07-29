// Configuration - Update with your backend URL
const BACKEND_URL = "http://localhost:5000/api/profiles";

// Store the current profile being processed
let currentProfileIndex = 0;
let profileLinks = [];
let tabId = null;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scrapeProfiles") {
    profileLinks = request.profileLinks;
    currentProfileIndex = 0;

    // Open the first profile
    chrome.tabs.create(
      {
        url: profileLinks[currentProfileIndex],
        active: true,
      },
      (tab) => {
        tabId = tab.id;
        sendResponse({ success: true });
      }
    );

    return true; // Keep the message channel open for sendResponse
  }
});

// Listen for tab updates to detect when profile is loaded
chrome.tabs.onUpdated.addListener((updatedTabId, changeInfo, tab) => {
  if (tabId === updatedTabId && changeInfo.status === "complete") {
    // Wait a bit for the page to fully render
    setTimeout(() => {
      // Execute the content script to scrape data
      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          files: ["contentScript.js"],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error("Script injection failed:", chrome.runtime.lastError);
          }
        }
      );
    }, 3000);
  }
});

// Function to process the next profile
function processNextProfile() {
  currentProfileIndex++;
  if (currentProfileIndex < profileLinks.length) {
    chrome.tabs.update(tabId, {
      url: profileLinks[currentProfileIndex],
    });
  } else {
    // All profiles processed
    chrome.tabs.remove(tabId);
    tabId = null;
    profileLinks = [];
    currentProfileIndex = 0;
  }
}

// Function to send scraped data to backend
async function sendProfileData(profileData) {
  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending data to backend:", error);
    throw error;
  }
}
