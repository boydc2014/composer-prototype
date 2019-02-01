var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var process = require('child_process');
var config = require('../../../config.json');


var isStart = false;

router.post("/start", function(req, res, next) {
    try {
        if(isStart)
            throw new Error('has already started');

        let configFile = config.launcher.configFile;
        
        if(configFile == undefined)
            throw new Error('configFile noe defined');
        
        let configFilePath = path.join('./',configFile);
        
        let launchFileContent = fs.readFileSync(configFilePath, "utf-8");
        
        let launchFile = JSON.parse(launchFileContent);
        launchFile.bot = config.bot;

        fs.writeFile(configFilePath, JSON.stringify(launchFile), {}, function (err) {
            if(err) {
                throw new Error('write file error');
             }
         });

         process.exec(config.launcher.startCommand);
         isStart = true;
         res.send('OK');
    } catch (error) {
        res.status(400).json({error:'Start error'});
    }
});

router.post("/stop", function(req, res, next) {
    try {
        if(!isStart)
            throw new Error();
        //TODO
        
    } catch (error) {
        res.status(400).json({error: 'Stop error'});
    }
});

module.exports = router;