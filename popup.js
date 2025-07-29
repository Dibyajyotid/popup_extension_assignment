document.getElementById("scrapeButton").addEventListener("click", async () => {
  const statusEl = document.getElementById("status");
  const profileLinksText = document.getElementById("profileLinks").value.trim();
  const profileLinks = profileLinksText
    .split("\n")
    .filter((link) => link.trim() !== "");

  if (profileLinks.length < 3) {
    statusEl.textContent = "Please enter at least 3 profile URLs";
    return;
  }

  statusEl.textContent = "Starting scraping process...";

  try {
    // Send the links to the background script
    chrome.runtime.sendMessage(
      {
        action: "scrapeProfiles",
        profileLinks: profileLinks,
      },
      (response) => {
        if (response.success) {
          statusEl.textContent = "Scraping initiated! Check the opened tabs.";
        } else {
          statusEl.textContent = "Error: " + response.error;
        }
      }
    );
  } catch (error) {
    statusEl.textContent = "Error: " + error.message;
  }
});
