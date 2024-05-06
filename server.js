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

const checkProfile = async (token) => {
    const userInfo = await fetch("https://dev-yr27mck7ia3usnqt.us.auth0.com/userinfo", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const response = await userInfo.json();
    //check if email exists
    try {
        const result = await db.query(`SELECT * FROM spideyDb.dbo.Users WHERE email = '${response.email}' OR email = 'ivan@gmail.com';`);

        console.log(result.recordset);
        //TODO: if no email create record for user

    } catch (err) {
        res.status(500).send('Database Error');
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
        const result = await db.query('SELECT * FROM spideyDb.dbo.Sightings;');

        res.json(result.recordset);

    } catch (err) {
        res.status(500).send('Database Error');
    }
});

app.post('/upload', checkJwt, upload.single('image'), (req, res) => {
    const uploadedFile = req.file;
    const imageUrl = uploadedFile.location;

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