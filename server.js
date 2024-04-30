const sql = require('mssql');
const express = require("express");
const { join } = require("path");
const app = express();
const https = require("https");
const fs = require("fs");
const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./auth_config.json");
const dotenv = require("dotenv").config();

const options = {
    key: fs.readFileSync("./security/cert.key"),
    cert: fs.readFileSync("./security/cert.crt"),
};

const PORT = process.env.PORT || 3000;
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: 'rdsadmin',
    options: {
        trustedConnection: false,
        encrypt: false
      }
};

sql.connect(config, err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }    console.log('Connected to SQL Server');
});

app.use(express.static(join(__dirname, "public")));

// create the JWT middleware
const checkJwt = auth({
    audience: authConfig.audience,
    issuerBaseURL: `https://${authConfig.domain}`
  });


app.get("/api/external", checkJwt, (req, res) => {
    res.status(200).send({
        msg: "Your access token was successfully validated!"
    });
});

app.get("/auth_config.json", (req, res) => {
    res.sendFile(join(__dirname, "auth_config.json"));
});

// _______________________________ALL ENDPOINTS GO ABOVE THIS LINE______________________________________________________________________________________
app.get("/*", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        return res.status(401).send({ msg: "Invalid token" });
    }

    next(err, req, res);
});

app.listen(8000, () => console.log("Application running on port " + 8000));

https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS server started on port ${PORT}`);
});