const {Storage} = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');
const secret = require('../secret/secretFile');

const storage = new Storage({
    projectId: secret.googleCloudStorage.projectId,
    keyFilename: secret.googleCloudStorage.keyFilename
});

const bucket = storage.bucket(secret.googleCloudStorage.bucketName);

function getPublicURL(filename) {
    return `https://storage.googleapis.com/${secret.googleCloudStorage.bucketName}/${filename}`
}

function sendUploadToGCS(req, res, next) {
    if (!req.file) {
        return next();
    }

    const gcsname = Date.now() + req.file.originalname;
    const file = bucket.file(gcsname);

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
        resumable: false,
    });

    stream.on('error', err => {
        req.file.cloudStorageError = err;
        next(err);
    });

    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsname;
        console.log(req.file.cloudStorageObject);
        file.makePublic().then(() => {
            req.file.cloudStoragePublicUrl = getPublicURL(gcsname);
            console.log(req.file.cloudStoragePublicUrl);
            next();
        });
    });

    stream.end(req.file.buffer);
}

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20*1024*1024
    }
});

module.exports = {
    getPublicURL,
    sendUploadToGCS,
    upload
};