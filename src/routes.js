const express = require("express");
const routes = express.Router();

const basepath = __dirname+"/views/";

const profile = {
    name: "Diogo Santiago",
    avatar: "https://avatars.githubusercontent.com/u/6208518?v=4",
    "monthly-budget": 3000,
    "hours-per-day": 5,
    "days-per-week": 5,
    "vacation-per-year": 4
}

routes.get('/', (req, res) => res.render(basepath+"index") );
routes.get('/job', (req, res) => res.render(basepath+"job") );
routes.get('/job/edit', (req, res) => res.render(basepath+"job-edit") );
routes.get('/profile', (req, res) => res.render(basepath+"profile", {profile}) );


module.exports = routes;