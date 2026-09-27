/* =========================================================
   TIME BROWSER
   Search Engine
   ========================================================= */


/* ---------- Search Locations ---------- */

function searchLocations(query) {

    const searchTerm =
        query
            .toLowerCase()
            .trim();


    if (!searchTerm) {
        return [];
    }


    return LOCATIONS
        .filter(location => {

            const city =
                location.city.toLowerCase();

            const region =
                location.region.toLowerCase();

            const timezone =
                location.timezone.toLowerCase();


            return (
                city.includes(searchTerm) ||
                region.includes(searchTerm) ||
                timezone.includes(searchTerm)
            );

        })
        .slice(0, 8);

}

/* ---------- Render Search Results ---------- */

function renderSearchResults(results) {

    const container =
        document.getElementById(
            "searchResults"
        );


    container.innerHTML = "";


    /* ---------- No Results ---------- */

    if (results.length === 0) {

        container.innerHTML = `
            <div class="search-result no-result">

                <div>

                    <div class="result-city">
                        No location found
                    </div>

                    <div class="result-region">
                        Try another city or region.
                    </div>

                </div>

            </div>
        `;


        container.classList.remove(
            "hidden"
        );


        return;

    }


    /* ---------- Results ---------- */

    results.forEach(location => {

        const result =
            document.createElement("div");


        result.className =
            "search-result";


        /*
         * Check apakah lokasi sudah
         * berada di Multi Clock.
         */

        const isAdded =
            selectedLocations.some(
                item =>
                    item.timezone ===
                    location.timezone
            );


        result.innerHTML = `

            <div class="result-information">

                <div class="result-city">
                    ${location.city}
                </div>

                <div class="result-region">
                    ${location.region}
                </div>

                <div class="result-timezone">
                    ${location.timezone}
                </div>

            </div>


            <button
                type="button"
                class="result-add-button ${isAdded ? "added" : ""}"
                ${isAdded ? "disabled" : ""}
            >
                ${isAdded ? "✓ Added" : "Add"}
            </button>

        `;


        /* -----------------------------------------
           Click information
           = Main Clock
           ----------------------------------------- */

        result
            .querySelector(
                ".result-information"
            )
            .addEventListener(
                "click",
                () => {

                    selectLocation(
                        location
                    );

                    closeSearchResults();

                    clearSearchInput();

                }
            );


        /* -----------------------------------------
           Add Button
           ----------------------------------------- */

        const addButton =
            result.querySelector(
                ".result-add-button"
            );


        if (!isAdded) {

            addButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();


                    addLocation(
                        location
                    );


                    /*
                     * Setelah berhasil ditambahkan,
                     * langsung refresh hasil search
                     * supaya tombol berubah menjadi
                     * "✓ Added".
                     */

                    renderSearchResults(
                        searchLocations(
                            document.getElementById(
                                "locationSearch"
                            ).value
                        )
                    );

                }
            );

        }


        container.appendChild(
            result
        );

    });


    container.classList.remove(
        "hidden"
    );

}


/* ---------- Clear Search ---------- */

function clearSearchInput() {

    const input =
        document.getElementById(
            "locationSearch"
        );


    const clearButton =
        document.getElementById(
            "clearSearch"
        );


    input.value = "";


    clearButton.classList.add(
        "hidden"
    );

}


/* ---------- Close Results ---------- */

function closeSearchResults() {

    const container =
        document.getElementById(
            "searchResults"
        );


    container.classList.add(
        "hidden"
    );

}


/* ---------- Initialize Search ---------- */

function initializeSearch() {

    const input =
        document.getElementById(
            "locationSearch"
        );


    const clearButton =
        document.getElementById(
            "clearSearch"
        );


    /* ---------- Typing ---------- */

    input.addEventListener(
        "input",
        () => {

            const query =
                input.value;


            if (
                query.trim()
            ) {

                clearButton.classList.remove(
                    "hidden"
                );


                const results =
                    searchLocations(
                        query
                    );


                renderSearchResults(
                    results
                );

            } else {

                clearButton.classList.add(
                    "hidden"
                );


                closeSearchResults();

            }

        }
    );


    /* ---------- Clear Button ---------- */

    clearButton.addEventListener(
        "click",
        () => {

            clearSearchInput();

            closeSearchResults();

            input.focus();

        }
    );


    /* ---------- Click Outside ---------- */

    document.addEventListener(
        "click",
        event => {

            if (
                !event.target.closest(
                    ".search-section"
                )
            ) {

                closeSearchResults();

            }

        }
    );

}
