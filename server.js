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
    region: process.env.REGION,
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

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.BUCKET,
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * 10 // 10 MB limit
    }
});

const getUserInfo = async (token, res) => {
    const userInfo = await fetch(process.env.USER_INFO, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const user = await userInfo.json();

    try {
        const result = await db.query(`SELECT * FROM spideyDb.dbo.Users WHERE email = '${user.email}';`);
        return result.recordset[0];
    } catch (err) {
        res.status(500).send({ msg: 'Database Error : ' + err.message });
    }
};

const checkProfile = async (token, res) => {
    const userInfo = await fetch(process.env.USER_INFO, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    const user = await userInfo.json();

    //check if email exists
    try {
        const result = await db.query(`SELECT * FROM spideyDb.dbo.Users WHERE email = '${user.email}';`);

        if (result.recordset.length === 0) {
            const InsertResult = await db.query(`INSERT INTO spideyDb.dbo.Users (email) VALUES ('${user.email}');`);

            res.status(201).send({ msg: 'Profile created' });
        }

    } catch (err) {
        res.status(500).send({ msg: 'Database Error : ' + err.message });
    }
};

// endpoints

app.get("/api/external", checkJwt, async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    await checkProfile(token, res);

    res.status(200).send({
        msg: "Your access token was successfully validated!"
    });
});


app.get("/auth_config.json", (_, res) => {
    res.sendFile(join(__dirname, "auth_config.json"));
});

app.get("/sightings", async (_, res) => {
    try {
        const result = await db.query('SELECT * FROM spideyDb.dbo.Sightings;');

        res.status(200).send(result.recordset);

    } catch (err) {
        res.status(500).send({ msg: 'Database Error : ' + err.message });
    }
});

app.get("/sightingsbyid", async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM spideyDb.dbo.Sightings WHERE userId=1;');

        res.status(200).send(result.recordset);

    } catch (err) {
        res.status(500).send({ msg: 'Database Error : ' + err.message });
    }
});

app.post('/upload', checkJwt, upload.single('image'), async (req, res) => {
    let { location, description, sightingTime } = req.body;
    sightingTime = sightingTime.replace('T', ' ');
    const uploadedFile = req.file;
    const imageUrl = uploadedFile.location;

    const authHeader = req.headers.authorization;
    const token = authHeader.split(' ')[1];
    const user = await getUserInfo(token, res);

    try {
        const UploadResult = await db.query(`INSERT INTO spideyDb.dbo.Sightings (userId, location, image, description, timestamp) VALUES (${user.userId},'${location}','${imageUrl}','${description}','${sightingTime}');`);
        
        res.status(201).send({ msg: 'Sighting uploaded successfully' });

    } catch (err) {
        res.status(500).send({ msg: 'Database Error : ' + err.message });
    }
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

app.use(function (_, res) {
    res.status(404).send({
        error: 404,
        message: 'Not found'
    });
});

app.listen(PORT, () => console.log("Application running on port " + PORT));