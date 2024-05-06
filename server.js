const sql = require('mssql');
const express = require("express");
const { join } = require("path");
const app = express();
const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./auth_config.json");
const dotenv = require("dotenv").config();
const { Upload } = require("@aws-sdk/lib-storage");
const { S3Client } = require("@aws-sdk/client-s3");
const formidable = require('formidable');


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

app.get("/sightings", async (_, res) => {

    try {
        await sql.connect(config);

        const result = await sql.query('SELECT * FROM spideyDb.dbo.Sightings;');

        res.json(result.recordset);

    }catch (err) {
        res.status(500).send('Database Error');

    }finally {
        await sql.close();
    }

});

app.post('/upload', (req, res) => {
    const formData = new formidable.IncomingForm();

    formData.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: err });
        }

        const file = files.image;
        const fileStream = fs.createReadStream(file.path);
        const uploadParams = {
            Bucket: 'imgbckt',
            Key: file.name,
            Body: fileStream
        };

        const upload = new Upload({
            client: new S3Client({
                region: 'eu-west-1',
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
                }
            }),
            params: uploadParams
        });

        upload.done().then(() => {
            res.status(200).send('Upload done!');   
        }).catch((error) => {
            console.log('Error uploading:', error);
            res.status(500).send('Error uploading file.');
        });

    });

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