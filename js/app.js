/* =========================================================
   TIME BROWSER
   Main Application
   ========================================================= */


/* ---------- Application State ---------- */

let activeLocation = LOCATIONS[0];

let selectedLocations = [
    LOCATIONS.find(
        location => location.city === "Jakarta"
    ),

    LOCATIONS.find(
        location => location.city === "Tokyo"
    ),

    LOCATIONS.find(
        location => location.city === "London"
    ),

    LOCATIONS.find(
        location => location.city === "New York"
    )
];


/* ---------- DOM ---------- */

const mainCity =
    document.getElementById("mainCity");

const mainRegion =
    document.getElementById("mainRegion");

const clockGrid =
    document.getElementById("clockGrid");

const emptyState =
    document.getElementById("emptyState");


/* ---------- Select Location ---------- */

function selectLocation(location) {

    activeLocation = location;


    mainCity.textContent =
        location.city;

    mainRegion.textContent =
        location.region;


    updateMainClock(
        location
    );


    /*
     * Update background sesuai
     * lokasi yang sedang aktif.
     */

    applyBackgroundForLocation(
        location
    );


    renderClockCards();

}


/* ---------- Render Clock Cards ---------- */

function renderClockCards() {

    clockGrid.innerHTML = "";


    if (selectedLocations.length === 0) {

        clockGrid.classList.add(
            "hidden"
        );

        emptyState.classList.remove(
            "hidden"
        );

        return;

    }


    clockGrid.classList.remove(
        "hidden"
    );

    emptyState.classList.add(
        "hidden"
    );


    selectedLocations.forEach(
        location => {

            const card =
                document.createElement("article");


            card.className =
                "clock-card";


            if (
                location.timezone ===
                activeLocation.timezone
            ) {

                card.classList.add(
                    "active"
                );

            }


            card.dataset.timezone =
                location.timezone;


            card.innerHTML = `

                <button
                    type="button"
                    class="remove-clock"
                    aria-label="Remove ${location.city}"
                >
                    ×
                </button>

                <div class="card-city">
                    ${location.city}
                </div>

                <div class="card-region">
                    ${location.region}
                </div>

                <div class="card-time">
                    ${getTime(location.timezone)}
                </div>

                <div class="card-offset">
                    ${getUTCOffset(location.timezone)}
                </div>

            `;


            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".remove-clock"
                        )
                    ) {
                        return;
                    }

                    selectLocation(location);

                }
            );


            const removeButton =
                card.querySelector(
                    ".remove-clock"
                );


            removeButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    removeLocation(
                        location
                    );

                }
            );


            clockGrid.appendChild(card);

        }
    );

}


/* ---------- Add Location ---------- */

function addLocation(location) {

    const exists =
        selectedLocations.some(
            item =>
                item.timezone ===
                location.timezone
        );


    if (exists) {

        selectLocation(location);

        return;

    }


    selectedLocations.push(
        location
    );


    selectLocation(
        location
    );

}


/* ---------- Remove Location ---------- */

function removeLocation(location) {

    selectedLocations =
        selectedLocations.filter(
            item =>
                item.timezone !==
                location.timezone
        );


    if (
        location.timezone ===
        activeLocation.timezone
    ) {

        if (
            selectedLocations.length > 0
        ) {

            selectLocation(
                selectedLocations[0]
            );

        } else {

            activeLocation = null;

            mainCity.textContent =
                "No Location";

            mainRegion.textContent =
                "";

            document.getElementById(
                "mainTime"
            ).textContent = "--:--:--";

            document.getElementById(
                "mainDate"
            ).textContent = "";

            document.getElementById(
                "mainTimezone"
            ).textContent = "UTC";

            renderClockCards();

        }

        return;

    }


    renderClockCards();

}


/* ---------- Clock Loop ---------- */

function updateClocks() {

    if (activeLocation) {

        updateMainClock(
            activeLocation
        );

    }


    updateClockCards(
        selectedLocations
    );

}


/* ---------- Initialize ---------- */

function initializeApp() {

    initializeSearch();

    initializeTheme();

    initializeBackgroundManager();


    selectLocation(
        activeLocation
    );


    renderClockCards();

    updateClocks();


    setInterval(
        updateClocks,
        1000
    );

}


/* ---------- Start ---------- */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);
