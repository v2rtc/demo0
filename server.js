const express   = require('express');
const path      = require('path');
const https     = require('https');
const fs        = require('fs');

const app = express();

const keysPath = path.join(__dirname, './keys/');

const options = {
    key:    fs.readFileSync(keysPath + 'server.key'),
    cert:   fs.readFileSync(keysPath + 'server.crt')
};
const httpsServer = https.createServer(options, app);

app.use(express.static(path.join(__dirname, './www')));
app.use('/node_modules', express.static(path.join(__dirname, './node_modules')));

httpsServer.listen(3000, () => {
    console.log('https server is running on 3000');
    console.log('Please open web broswer with url: https://localhost:3000');
});