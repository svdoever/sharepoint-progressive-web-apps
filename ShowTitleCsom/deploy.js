var spsave = require("spsave").spsave;
var fs = require('fs');

var coreOptions = {
    siteUrl: process.env.SPONLINE_APPS_DOCLIB,
    notification: true,
    checkin: true,
    checkinType: 1
};
var creds = {
    username: process.env.SPONLINE_USERNAME,
    password: process.env.SPONLINE_PASSWORD,
    domain: '' // [domain (on required for on premise)]
};
 
var fileOptions = {
    folder: 'showtitlecsom',
    fileName: 'index.aspx',
    fileContent: fs.readFileSync('index.aspx')
};

spsave(coreOptions, creds, fileOptions)
.then(function(){
    console.log('saved');
})
.catch(function(err){
    console.log(err);
});