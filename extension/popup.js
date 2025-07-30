document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("start");
  const textarea = document.getElementById("urls");
  const status = document.getElementById("status");

  button.addEventListener("click", async () => {
    const urls = textarea.value
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.includes("linkedin.com/in/"));

    if (urls.length < 3) {
      status.textContent =
        "⚠️ Please enter at least 3 valid LinkedIn profile URLs.";
      return;
    }

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      status.textContent = `Opening profile ${i + 1}...`;

      const tab = await chrome.tabs.create({ url, active: true });

      await new Promise((resolve) => setTimeout(resolve, 8000)); // wait for page to load

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });

      await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for scraping

      await chrome.tabs.remove(tab.id); // close the tab

      await new Promise((resolve) => setTimeout(resolve, 2000)); // delay before next
    }

    status.textContent = "✅ All profiles scraped.";
  });
});
