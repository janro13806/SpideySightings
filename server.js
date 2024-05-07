const express = require("express");
const { join } = require("path");
const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./auth_config.json");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require('@aws-sdk/client-s3');
require("dotenv").config();

const db = require("./data/db.js");


const cors = require('cors');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const s3Client = new S3Client({
    region: 'eu-west-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

app.use(express.static(join(__dirname, "public")));

// middleware functions

const checkJwt = auth({
    audience: authConfig.audience,
    issuerBaseURL: `https://${authConfig.domain}`
});


//https://dev-yr27mck7ia3usnqt.us.auth0.com/userinfo

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: 'imgbckt',
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        },
    }),
});

const getUserInfo = async (token) => {
    const userInfo = await fetch("https://dev-yr27mck7ia3usnqt.us.auth0.com/userinfo", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const user = await userInfo.json();
    try {
        const result = await db.query(`SELECT * FROM spideyDb.dbo.Users WHERE email = '${user.email}';`);
        console.log('Result: ' + result.recordset);
        return result.recordset;
    } catch (err) {
        res.status(500).send('Database Error : ' + err.message);
    }
};

const checkProfile = async (token) => {
    const user = await getUserInfo(token);

    //check if email exists
    try {
        const result = await db.query(`SELECT * FROM spideyDb.dbo.Users WHERE email = '${user.email}';`);

        console.log("Email exists?: " + result.recordset);

        if (result.recordset.length === 0) {
            const InsertResult = await db.query(`INSERT INTO spideyDb.dbo.Users (email) VALUES ('${user.email}');`);

            console.log("Insert result: " + InsertResult.output);
        }

    } catch (err) {
        res.status(500).send('Database Error : ' + err.message);
    }
};

// endpoints

app.get("/api/external", checkJwt, async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    await checkProfile(token);

    res.status(200).send({
        msg: "Your access token was successfully validated!"
    });
});


app.get("/auth_config.json", (req, res) => {
    res.sendFile(join(__dirname, "auth_config.json"));
});

app.get("/sightings", async (_, res) => {
    try {
        const result = await db.query('SELECT * FROM spideyDb.dbo.Sightings ();');

        res.json(result.recordset);

    } catch (err) {
        res.status(500).send('Database Error : ' + err.message);
    }
});

app.post('/upload', checkJwt, upload.single('image'), async (req, res) => {
    const { location, description, sightingTime } = req.body;
    const uploadedFile = req.file;
    const imageUrl = uploadedFile.location;

    const UploadResult = await db.query(`INSERT INTO spidey`);

    res.json({ message: 'Image uploaded successfully : ' + imageUrl });
});

// _______________________________ALL ENDPOINTS GO ABOVE THIS LINE______________________________________________________________________________________
app.get("/", (_, res) => {
    res.sendFile(join(__dirname, "index.html"));
});

app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        return res.status(401).send({ msg: "Invalid token" });
    }

    next(err, req, res);
});


app.listen(PORT, () => console.log("Application running on port " + PORT));