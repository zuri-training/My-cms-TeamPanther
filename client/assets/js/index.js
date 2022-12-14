const menu = document.querySelector(".menu");
const nav = document.querySelector("header nav");

if (menu) {
    menu.addEventListener("click", function () {
        this.classList.toggle("open");
        if (nav) {
            if (this.classList.contains("open")) {
                nav.classList.add("open");
            } else {
                nav.classList.remove("open");
            }
        }
    });
}
