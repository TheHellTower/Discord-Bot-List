const { Router } = require("express");

const route = Router();

route.get("/", async (req, res) => {
    let theme = req.cookies["theme"], l = "light", d = "dark";
    res.cookie("theme", theme === undefined ? l : theme === d ? l : d);
    res.redirect(req.header('Referer') || '/');
});

module.exports = route;
