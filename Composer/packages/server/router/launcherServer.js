var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var process = require('child_process');
var config = require('../config.json');


var connectorFactory = require('../launcher-connectors/connectorFactory').ConnectorFactory;
var launcherStatus = require('../launcher-connectors/interface').LauncherStatus;

var connector = new connectorFactory().CreateConnector(config.launcherConnector);

const parseConfigIntoParams = () => {
    //format:
    //dotnet run --key1=value1 --key2:childkey2=value2 --key3:childkey3:grandsonkey3=value3
    let result = '';
    result += ` --bot:provider=${config.bot.provider}`;
    result += ` --bot:path=${config.bot.path}`;
    return result;
}

router.get("/start", function(req, res, next) {
    try {
         if (connector.status == launcherStatus.Running) {
             throw new Error("Already running");
         }

         connector.start();
         res.send('OK');
    } catch (error) {
        res.status(400).json({error:'Start error'});
    }
});

router.get("/stop", function(req, res, next) {
    try {
        if (connector.status == launcherStatus.Stopped) {
            throw new Error("Already stopped");
        }

        connector.stop();
        res.send('OK');
    } catch (error) {
        res.status(400).json({error: 'Stop error'});
    }
});

router.get("/status", function(req, res, next) {
    res.send(connector.status == launcherStatus.Runnig ? "Running":"Stopped");
})

module.exports = router;