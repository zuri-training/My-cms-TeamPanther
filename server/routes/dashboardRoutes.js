const router = require("express").Router();
const path = require("path");

router
    .get("/", (_, res) => {
        res.render("dashboard", {
            layout: false,
            fullName: "Oluwatowo Rosanwo",
            tagName: "@crimson",
        });
    })
    .get("/about", (_, res) => {
        res.sendFile(getFile("about.html"));
    });
module.exports = router;

const getFile = (filename) => path.join(__dirname, "../../", "client", filename);
