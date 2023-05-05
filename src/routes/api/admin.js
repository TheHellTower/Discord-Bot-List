const { Router } = require("express");

const approve = require("@routes/api/admin/approve");
const deny = require("@routes/api/admin/deny");
const markNsfw = require("@routes/api/admin/mark_nsfw");

const route = Router();

route.use("/approve", approve);
route.use("/deny", deny);
route.use("/mark_nsfw", markNsfw);

module.exports = route;
