var Cpass = require("cpass");
var cpass = new Cpass();
var spsave = require("spsave").spsave;
var fs = require('fs');

var argv = require('minimist')(process.argv.slice(2));
var deployAssets = argv._.length === 1 && argv._[0] === "assets"? true : false;


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
    checkinType: 2 // overwrite
};
var creds = {
    username: config.username,
    password: cpass.decode(config.password),
    domain: '' // [domain (on required for on premise)]
};
 
var indexFileOptions = {
    folder: 'apppages/showtitlepwa',
    fileName: 'index.aspx',
    fileContent: String(fs.readFileSync('static/index.html')).replace('http://localhost:8081', config.siteUrl)
};

var manifestFileOptions = {
    folder: 'apppages/showtitlepwa',
    fileName: 'manifest.webmanifest',
    fileContent: String(fs.readFileSync('static/manifest.webmanifest')).replace('index.html', 'index.aspx')
};

// var indexFileOptions = {
//     folder: 'apppages/showtitlepwa',
//     fileName: 'manifest.aspx',
//     fileContent: String(fs.readFileSync('static/manifest.aspx'))
// };

var assetFileOptions = {
    glob: 'static/**/!(*.html)',
    base: 'static',
    folder: 'apppages/showtitlepwa'
};

spsave(coreOptions, creds, indexFileOptions)
.then(function(){
    console.log('index.aspx fixed and saved');
    spsave(coreOptions, creds, manifestFileOptions)
    .then(function(){
        console.log('manifest.webmanifest fixed and saved');
        if (deployAssets) {
            spsave(coreOptions, creds, assetFileOptions)
            .then(function(){
                console.log('other artifacts saved');
            })
            .catch(function(err){
                console.log(err);
            });
        }
    }) 
})
.catch(function(err){
    console.log(err);
});
