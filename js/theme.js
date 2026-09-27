/* =========================================================
   TIME BROWSER
   Theme Manager
   ========================================================= */


function initializeTheme() {

    const toggle =
        document.getElementById("themeToggle");


    const savedTheme =
        localStorage.getItem(
            "timeBrowserTheme"
        );


    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        toggle.textContent = "☀";

    }


    toggle.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            const isDark =
                document.body.classList.contains(
                    "dark"
                );


            localStorage.setItem(
                "timeBrowserTheme",
                isDark ? "dark" : "light"
            );


            toggle.textContent =
                isDark ? "☀" : "☾";

        }
    );

}
