const sql = require('mssql');
const express = require("express");
const { join } = require("path");
const app = express();
const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./auth_config.json");
const dotenv = require("dotenv").config();

//Hellooooooooooooooo
//Timo is my naam Janro
///www.web-shooters.com/
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

// async () => {
//      // make sure that any items are correctly URL encoded in the connection string
//      await sql.connect(sqlConfig)
//      const result = await sql.query`select * from mytable
//      console.dir(result)
// }

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

app.listen(PORT, () => console.log("Application running on port " + PORT));