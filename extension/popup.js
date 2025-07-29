document.addEventListener("DOMContentLoaded", () => {
  const startScrapingBtn = document.getElementById("startScrapingBtn");
  const viewDataBtn = document.getElementById("viewDataBtn");
  const profileUrls = document.getElementById("profileUrls");
  const statusText = document.getElementById("statusText");

  let isProcessing = false;
  const chrome = window.chrome; // Declare the chrome variable

  startScrapingBtn.addEventListener("click", async () => {
    if (isProcessing) return;

    const urls = profileUrls.value
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url && url.includes("linkedin.com/in/"));

    if (urls.length < 3) {
      updateStatus(
        "Please enter at least 3 valid LinkedIn profile URLs",
        "error"
      );
      return;
    }

    isProcessing = true;
    startScrapingBtn.disabled = true;
    startScrapingBtn.textContent = "Processing...";

    updateStatus("Starting to scrape profiles...", "loading");

    try {
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        updateStatus(
          `Processing profile ${i + 1} of ${urls.length}: ${url}`,
          "loading"
        );

        // Open the LinkedIn profile in a new tab
        const tab = await chrome.tabs.create({ url, active: false });

        // Wait for the page to load
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Inject content script and scrape data
        try {
          const results = await chrome.tabs.sendMessage(tab.id, {
            action: "scrapeProfile",
          });

          if (results && results.success) {
            // Send data to backend API
            await sendToAPI(results.data);
            updateStatus(
              `✓ Successfully scraped: ${results.data.name}`,
              "success"
            );
          } else {
            updateStatus(`✗ Failed to scrape: ${url}`, "error");
          }
        } catch (error) {
          console.error("Error scraping profile:", error);
          updateStatus(`✗ Error scraping: ${url}`, "error");
        }

        // Close the tab
        await chrome.tabs.remove(tab.id);

        // Wait between requests to avoid rate limiting
        if (i < urls.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      updateStatus(`✓ Completed scraping ${urls.length} profiles!`, "success");
    } catch (error) {
      console.error("Error during scraping:", error);
      updateStatus("Error occurred during scraping", "error");
    } finally {
      isProcessing = false;
      startScrapingBtn.disabled = false;
      startScrapingBtn.textContent = "Start Scraping";
    }
  });

  viewDataBtn.addEventListener("click", async () => {
    try {
      const response = await fetch("http://localhost:3000/api/profiles");
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        updateStatus(
          `Found ${data.data.length} scraped profiles in database`,
          "success"
        );
        console.log("Scraped profiles:", data.data);
      } else {
        updateStatus("No profiles found in database", "placeholder");
      }
    } catch (error) {
      updateStatus("Error connecting to backend server", "error");
      console.error("Error fetching data:", error);
    }
  });

  async function sendToAPI(profileData) {
    try {
      const response = await fetch("http://localhost:3000/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error sending to API:", error);
      throw error;
    }
  }

  function updateStatus(message, type = "status-text") {
    statusText.textContent = message;
    statusText.className = type;
  }
});
