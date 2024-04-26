const CACHE_NAME = "my-app-cache-v1";
//const dhaiu = require("./views/front/images/logo/4.png");
const dhaiu = require("../views/front");
const urlsToCache = [
  "/",
  "/views/front/login.html", // Path to your main HTML file
  "/views/front/style.css", // Path to your main CSS file
  "./app.js", // Path to your JavaScript file
  "/views/front/images/logo/4.png", // Path to the logo image
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
