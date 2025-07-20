document.addEventListener("DOMContentLoaded", () => {
  // Getting the references to the button and text elements
  const getTitleBtn = document.getElementById("getTitleBtn");
  const titleText = document.getElementById("titleText");

  getTitleBtn.addEventListener("click", async () => {
    try {
      // UI updates
      getTitleBtn.disabled = true;
      getTitleBtn.textContent = "Getting Title...";
      titleText.textContent = "Loading...";
      titleText.className = "loading";

      // Query chrome for the active tab in the current window
      const [tab] = await window.chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab && tab.title) {
        // Displaying the current tab title
        titleText.textContent = tab.title;
        titleText.className = "title-text";
      } else {
        titleText.textContent = "Could not retrieve tab title";
        titleText.className = "placeholder";
      }
    } catch (error) {
      console.error("Error getting tab title:", error);
      titleText.textContent = "Error: Could not get tab title";
      titleText.className = "placeholder";
    } finally {
      // Re-enable button and reset text regardless of outcome
      getTitleBtn.disabled = false;
      getTitleBtn.textContent = "Get Current Tab Title";
    }
  });
});
