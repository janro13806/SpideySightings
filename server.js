const express = require("express");
const { join } = require("path");
const app = express();
const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./auth_config.json");

app.use(express.static(join(__dirname, "public")));

// create the JWT middleware
const checkJwt = auth({
    audience: authConfig.audience,
    issuerBaseURL: `https://${authConfig.domain}`
  });


app.get("/api/external", checkJwt, (req, res) => {
    res.send({
        msg: "Your access token was successfully validated!"
    });
});

app.get("/auth_config.json", (req, res) => {
    res.sendFile(join(__dirname, "auth_config.json"));
});

app.get("/*", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        return res.status(401).send({ msg: "Invalid token" });
    }

    next(err, req, res);
});

app.listen(3000, () => console.log("Application running on port 3000"));