var RestProxy = require("sp-rest-proxy");
 
var settings = {
    configPath: __dirname + "/config/_private.conf.json", // Location for SharePoint instance mapping and credentials 
    port: 8080,                                           // Local server port 
    staticRoot: __dirname + "/static"                     // Root folder for static content 
};
 
var restProxy = new RestProxy(settings);
restProxy.serve();