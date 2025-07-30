(async () => {
  function getText(selector) {
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : "";
  }

  function getNumber(text) {
    const match = text.match(/\d+/g);
    return match ? parseInt(match[0].replace(/,/g, ""), 10) : 0;
  }

  const data = {
    name: getText("h1"),
    url: window.location.href,
    about: getText("#about"),
    bio: getText(".text-body-medium"),
    location: getText(".text-body-small"),
    followerCount: 0,
    connectionCount: 0,
  };

  document.querySelectorAll("span").forEach((span) => {
    const t = span.textContent.toLowerCase();
    if (t.includes("follower")) data.followerCount = getNumber(t);
    if (t.includes("connection")) data.connectionCount = getNumber(t);
  });

  await fetch("http://localhost:3000/api/profiles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
})();
