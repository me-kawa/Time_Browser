/* =========================================================
   TIME BROWSER
   Clock Engine
   ========================================================= */


/**
 * Format time for a timezone
 */
function getTime(timezone) {

    return new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).format(new Date());

}


/**
 * Format date for a timezone
 */
function getDate(timezone) {

    return new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    }).format(new Date());

}


/**
 * Get UTC offset
 *
 * Example:
 * UTC +07:00
 * UTC -04:00
 */
function getUTCOffset(timezone) {

    const now = new Date();

    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "longOffset"
    });

    const parts = formatter.formatToParts(now);

    const offsetPart = parts.find(
        part => part.type === "timeZoneName"
    );

    if (!offsetPart) {
        return "UTC";
    }

    return offsetPart.value.replace("GMT", "UTC");

}


/**
 * Update main clock
 */
function updateMainClock(location) {

    if (!location) {
        return;
    }

    const mainTime = document.getElementById("mainTime");
    const mainDate = document.getElementById("mainDate");
    const mainTimezone = document.getElementById("mainTimezone");

    mainTime.textContent =
        getTime(location.timezone);

    mainDate.textContent =
        getDate(location.timezone);

    mainTimezone.textContent =
        getUTCOffset(location.timezone);

}


/**
 * Update all small clocks
 */
function updateClockCards(locations) {

    locations.forEach(location => {

        const timeElement =
            document.querySelector(
                `[data-timezone="${location.timezone}"] .card-time`
            );

        const offsetElement =
            document.querySelector(
                `[data-timezone="${location.timezone}"] .card-offset`
            );

        if (timeElement) {

            timeElement.textContent =
                getTime(location.timezone);

        }

        if (offsetElement) {

            offsetElement.textContent =
                getUTCOffset(location.timezone);

        }

    });

}
