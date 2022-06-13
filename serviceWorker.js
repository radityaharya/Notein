const staticNotein = 'dev-notein-static';
const assets = [
    "/",
    "/index.html",
    "/assets/css/style.css",
    "/assets/css/settings.css",
    "/notein_dark.svg",
    "/notein_light.svg",
    "/assets/js/sidebar.js",
    "/assets/js/app.js",
    "/assets/js/settings.js",
    "/settings.html",
    "/assets/img/default_profile.jpg",
    "https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css",
    "https://fonts.googleapis.com/css?family=PT+Mono",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/@editorjs/header@latest",
    "https://cdn.jsdelivr.net/npm/@editorjs/simple-image@latest",
    "https://cdn.jsdelivr.net/npm/@editorjs/delimiter@latest",
    "https://cdn.jsdelivr.net/npm/@editorjs/list@latest",
    "https://cdn.jsdelivr.net/npm/@editorjs/checklist@latest",
    "https://cdn.jsdelivr.net/npm/@editorjs/quote@latest",
    "https://cdn.jsdelivr.net/npm/@editorjs/code@latest",
    "https://cdn.jsdelivr.net/npm/@editorjs/embed@latest",
    "https://cdn.jsdelivr.net/npm/@editorjs/table@latest",
    "https://cdn.jsdelivr.net/npm/@editorjs/link@latest",
    "https://cdn.jsdelivr.net/npm/@editorjs/warning@latest",
    "https://cdn.jsdelivr.net/npm/@editorjs/marker@latest",
    "https://cdn.jsdelivr.net/npm/@editorjs/inline-code@latest",
    "https://unpkg.com/editorjs-undo@2.0.1/dist/bundle.js",
    "https://cdn.jsdelivr.net/npm/editorjs-text-color-plugin@latest/dist/bundle.js",
    "https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"
]


self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(staticNotein).then(cache => {
            cache.addAll(assets)
        })
    )
})


self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})