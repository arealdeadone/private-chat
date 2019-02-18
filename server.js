const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const container = require('./container');

container.resolve(function (users) {

    const app = setupExpress();

    function setupExpress() {
        const app = express();
        const server = http.createServer(app);
        const PORT = 3000;
        server.listen(PORT, function () {
            console.log(`Listening on port ${PORT}`)
        });
        ConfigureExpress(app);

        // Setup Router
        const router = require('express-promise-router')();
        users.SetRouting(router);
        app.use(router);
    }


    function ConfigureExpress(app) {
        app.use(express.static('public'));
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
    }
});