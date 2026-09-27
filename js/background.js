/* =========================================================
   TIME BROWSER
   Background Manager
   ========================================================= */


/* ---------- Storage Key ---------- */

const BACKGROUND_STORAGE_KEY =
    "timeBrowserBackgrounds";


/* ---------- State ---------- */

let backgroundSettings =
    loadBackgroundSettings();


/* ---------- Load Storage ---------- */

function loadBackgroundSettings() {

    try {

        const saved =
            localStorage.getItem(
                BACKGROUND_STORAGE_KEY
            );


        if (!saved) {
            return {};
        }


        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "Unable to load background settings:",
            error
        );


        return {};

    }

}


/* ---------- Save Storage ---------- */

function saveBackgroundSettings() {

    try {

        localStorage.setItem(
            BACKGROUND_STORAGE_KEY,
            JSON.stringify(
                backgroundSettings
            )
        );

    } catch (error) {

        console.error(
            "Unable to save background settings:",
            error
        );

    }

}


/* =========================================================
   YouTube URL
   ========================================================= */


/**
 * Extract YouTube video ID from common URL formats.
 *
 * Supported:
 *
 * https://www.youtube.com/watch?v=VIDEO_ID
 * https://youtu.be/VIDEO_ID
 * https://www.youtube.com/shorts/VIDEO_ID
 * https://www.youtube.com/embed/VIDEO_ID
 */

function getYouTubeVideoId(url) {

    try {

        const parsed =
            new URL(url);


        const hostname =
            parsed.hostname
                .replace("www.", "")
                .toLowerCase();


        /* youtube.com */

        if (
            hostname === "youtube.com" ||
            hostname === "m.youtube.com"
        ) {

            const videoId =
                parsed.searchParams.get("v");


            if (videoId) {
                return videoId;
            }


            const pathParts =
                parsed.pathname
                    .split("/")
                    .filter(Boolean);


            if (
                pathParts[0] === "shorts" &&
                pathParts[1]
            ) {

                return pathParts[1];

            }


            if (
                pathParts[0] === "embed" &&
                pathParts[1]
            ) {

                return pathParts[1];

            }

        }


        /* youtu.be */

        if (
            hostname === "youtu.be"
        ) {

            const videoId =
                parsed.pathname
                    .split("/")
                    .filter(Boolean)[0];


            if (videoId) {
                return videoId;
            }

        }


        return null;

    } catch {

        return null;

    }

}


/* =========================================================
   Background Type
   ========================================================= */

function detectBackgroundType(url) {

    if (
        getYouTubeVideoId(url)
    ) {

        return "youtube";

    }


    return "image";

}


/* =========================================================
   Apply Background
   ========================================================= */

function applyBackgroundForLocation(
    location
) {

    const imageElement =
        document.getElementById(
            "backgroundImage"
        );


    const videoElement =
        document.getElementById(
            "backgroundVideo"
        );


    if (
        !imageElement ||
        !videoElement
    ) {
        return;
    }


    /* Reset */

    imageElement.style.backgroundImage =
        "none";


    videoElement.src = "";

    videoElement.classList.remove(
        "visible"
    );

    imageElement.classList.remove(
        "visible"
    );


    /* No location */

    if (!location) {
        return;
    }


    const settings =
        backgroundSettings[
            location.timezone
        ];


    /* No custom background */

    if (!settings) {
        return;
    }


    /* ---------- YouTube ---------- */

    if (
        settings.type === "youtube"
    ) {

        const videoId =
            getYouTubeVideoId(
                settings.url
            );


        if (!videoId) {
            return;
        }


        /*
         * playlist=VIDEO_ID allows
         * a single YouTube video to loop.
         *
         * mute=1 is necessary for
         * autoplay in most browsers.
         */

        const embedUrl =
            `https://www.youtube.com/embed/${videoId}` +
            `?autoplay=1` +
            `&mute=1` +
            `&loop=1` +
            `&playlist=${videoId}` +
            `&controls=0` +
            `&rel=0` +
            `&modestbranding=1`;


        videoElement.src =
            embedUrl;


        videoElement.classList.add(
            "visible"
        );


        return;

    }


    /* ---------- Image ---------- */

    if (
        settings.type === "image"
    ) {

        imageElement.style.backgroundImage =
            `url("${settings.url}")`;


        imageElement.classList.add(
            "visible"
        );

    }

}


/* =========================================================
   Save Background
   ========================================================= */

function saveBackgroundForLocation(
    location,
    type,
    url
) {

    if (!location) {
        return false;
    }


    const cleanUrl =
        url.trim();


    if (!cleanUrl) {
        return false;
    }


    backgroundSettings[
        location.timezone
    ] = {

        type: type,

        url: cleanUrl

    };


    saveBackgroundSettings();


    applyBackgroundForLocation(
        location
    );


    return true;

}


/* =========================================================
   Reset Background
   ========================================================= */

function resetBackgroundForLocation(
    location
) {

    if (!location) {
        return;
    }


    delete backgroundSettings[
        location.timezone
    ];


    saveBackgroundSettings();


    applyBackgroundForLocation(
        location
    );

}


/* =========================================================
   Modal
   ========================================================= */

function openBackgroundModal() {

    const modal =
        document.getElementById(
            "backgroundModal"
        );


    const locationName =
        document.getElementById(
            "backgroundLocationName"
        );


    const urlInput =
        document.getElementById(
            "backgroundUrl"
        );


    if (!activeLocation) {
        return;
    }


    locationName.textContent =
        `${activeLocation.city}, ${activeLocation.region}`;


    const settings =
        backgroundSettings[
            activeLocation.timezone
        ];


    if (settings) {

        urlInput.value =
            settings.url;


        const radio =
            document.querySelector(
                `input[name="backgroundType"][value="${settings.type}"]`
            );


        if (radio) {
            radio.checked = true;
        }

    } else {

        urlInput.value = "";

        document.querySelector(
            'input[name="backgroundType"][value="image"]'
        ).checked = true;

    }


    updateBackgroundFormHelp();


    modal.classList.remove(
        "hidden"
    );

}


/* ---------- Close Modal ---------- */

function closeBackgroundModal() {

    const modal =
        document.getElementById(
            "backgroundModal"
        );


    modal.classList.add(
        "hidden"
    );

}


/* =========================================================
   Form
   ========================================================= */

function getSelectedBackgroundType() {

    const selected =
        document.querySelector(
            'input[name="backgroundType"]:checked'
        );


    return selected
        ? selected.value
        : "image";

}


/* ---------- Help Text ---------- */

function updateBackgroundFormHelp() {

    const type =
        getSelectedBackgroundType();


    const urlInput =
        document.getElementById(
            "backgroundUrl"
        );


    const help =
        document.getElementById(
            "backgroundHelp"
        );


    if (type === "youtube") {

        urlInput.placeholder =
            "https://www.youtube.com/watch?v=...";


        help.textContent =
            "Use a public YouTube video that allows embedding.";

    } else {

        urlInput.placeholder =
            "https://example.com/image.jpg";


        help.textContent =
            "Use a direct public image URL.";

    }

}


/* =========================================================
   Preview
   ========================================================= */

function previewBackground() {

    const type =
        getSelectedBackgroundType();


    const url =
        document.getElementById(
            "backgroundUrl"
        ).value.trim();


    const preview =
        document.getElementById(
            "backgroundPreview"
        );


    preview.innerHTML = "";


    if (!url) {

        preview.innerHTML = `
            <div class="preview-placeholder">
                Enter a URL first.
            </div>
        `;

        return;

    }


    /* ---------- YouTube ---------- */

    if (type === "youtube") {

        const videoId =
            getYouTubeVideoId(url);


        if (!videoId) {

            preview.innerHTML = `
                <div class="preview-error">
                    Invalid YouTube URL.
                </div>
            `;

            return;

        }


        const iframe =
            document.createElement(
                "iframe"
            );


        iframe.src =
            `https://www.youtube.com/embed/${videoId}` +
            `?autoplay=1` +
            `&mute=1` +
            `&loop=1` +
            `&playlist=${videoId}` +
            `&controls=0` +
            `&rel=0`;


        iframe.allow =
            "autoplay; fullscreen";


        preview.appendChild(
            iframe
        );


        return;

    }


    /* ---------- Image ---------- */

    const image =
        document.createElement(
            "img"
        );


    image.src =
        url;


    image.alt =
        "Background preview";


    image.onload =
        () => {

            preview.innerHTML = "";

            preview.appendChild(
                image
            );

        };


    image.onerror =
        () => {

            preview.innerHTML = `
                <div class="preview-error">
                    Image could not be loaded.
                </div>
            `;

        };

}


/* =========================================================
   Initialize Background Manager
   ========================================================= */

function initializeBackgroundManager() {

    const settingsButton =
        document.getElementById(
            "backgroundSettings"
        );


    const closeButton =
        document.getElementById(
            "closeBackgroundModal"
        );


    const backdrop =
        document.getElementById(
            "modalBackdrop"
        );


    const previewButton =
        document.getElementById(
            "previewBackground"
        );


    const applyButton =
        document.getElementById(
            "applyBackground"
        );


    const resetButton =
        document.getElementById(
            "resetBackground"
        );


    const typeInputs =
        document.querySelectorAll(
            'input[name="backgroundType"]'
        );


    settingsButton.addEventListener(
        "click",
        openBackgroundModal
    );


    closeButton.addEventListener(
        "click",
        closeBackgroundModal
    );


    backdrop.addEventListener(
        "click",
        closeBackgroundModal
    );


    previewButton.addEventListener(
        "click",
        previewBackground
    );


    typeInputs.forEach(
        input => {

            input.addEventListener(
                "change",
                updateBackgroundFormHelp
            );

        }
    );


    applyButton.addEventListener(
        "click",
        () => {

            if (!activeLocation) {
                return;
            }


            const type =
                getSelectedBackgroundType();


            const url =
                document.getElementById(
                    "backgroundUrl"
                ).value;


            /* Validate YouTube */

            if (
                type === "youtube" &&
                !getYouTubeVideoId(url)
            ) {

                alert(
                    "Please enter a valid YouTube URL."
                );

                return;

            }


            /* Validate Image */

            if (
                type === "image" &&
                !url.trim()
            ) {

                alert(
                    "Please enter an image URL."
                );

                return;

            }


            saveBackgroundForLocation(
                activeLocation,
                type,
                url
            );


            closeBackgroundModal();

        }
    );


    resetButton.addEventListener(
        "click",
        () => {

            if (!activeLocation) {
                return;
            }


            resetBackgroundForLocation(
                activeLocation
            );


            document.getElementById(
                "backgroundUrl"
            ).value = "";


            document.querySelector(
                'input[name="backgroundType"][value="image"]'
            ).checked = true;


            updateBackgroundFormHelp();


            document.getElementById(
                "backgroundPreview"
            ).innerHTML = `
                <div class="preview-placeholder">
                    Background reset.
                </div>
            `;

        }
    );


    /*
     * Close modal with Escape.
     */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeBackgroundModal();

            }

        }
    );

}