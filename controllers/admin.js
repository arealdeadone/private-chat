// const path = require('path');
// const fs = require('fs');


module.exports = function(formidable, Club, gcs) {
    return {
        SetRouting: function (router) {
            router.get('/dashboard', this.adminPage);

            router.post('/uploadFile', gcs.upload.single('upload'), gcs.sendUploadToGCS, this.uploadFile);
            router.post('/dashboard', this.adminPostPage);
        },

        adminPage: function (req, res) {
            res.render('admin/dashboard');
        },

        adminPostPage: function (req, res) {
            console.log(req.body);
            const newClub = new Club();
            newClub.name = req.body.club;
            newClub.country = req.body.country;
            newClub.image = req.body.fileURL;
            console.log(req.body.fileURL);
            newClub.save(err => {
                if(err){
                    console.log(err);
                }
                res.render('admin/dashboard');
            })
        },

        uploadFile: (req, res) => {
            res.json({fileURL: req.file.cloudStoragePublicUrl})
        },
    }
};