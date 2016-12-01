var Cpass = require("cpass");
var cpass = new Cpass();
var spsave = require("spsave").spsave;
var fs = require('fs');
var configFile = __dirname + '/config/_private.conf.json';

if (!fs.existsSync(configFile)) {
    console.log('Missing configuration "' + configFile + '". Run "npm run serve" and save configuration settings');
    process.exit(0);
}

var config = require(configFile);

var coreOptions = {
    siteUrl: config.siteUrl,
    notification: true,
    checkin: true,
    checkinType: 1
};
var creds = {
    username: config.username,
    password: cpass.decode(config.password),
    domain: '' // [domain (on required for on premise)]
};
 
var fileOptions = {
    folder: 'apppages/showtitlerest',
    fileName: 'index.aspx',
    fileContent: String(fs.readFileSync('static/index.html')).replace('http://localhost:8081', config.siteUrl)
};

spsave(coreOptions, creds, fileOptions)
.then(function(){
    console.log('saved');
})
.catch(function(err){
    console.log(err);
});