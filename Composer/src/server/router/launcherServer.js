var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var process = require('child_process');
var config = require('../../../config.json');


var isStart = false;

var child = null;

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
        if(isStart)
            throw new Error('has already started');

            let originCommand = config.launcher.startCommand;
            let command = originCommand + parseConfigIntoParams();
            console.log(command)
            child = process.exec(command, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
         });
         isStart = true;
         res.send('OK');
    } catch (error) {
        res.status(400).json({error:'Start error'});
    }
});

router.get("/stop", function(req, res, next) {
    try {
        if(!isStart)
            throw new Error();

        // This line, for some reason, can not kill the web service
        // TODO: totally revisit this, and use a more reasonable approach for managing subprocesses
        child.kill();
        isStart = false;
        res.send('OK');
    } catch (error) {
        res.status(400).json({error: 'Stop error'});
    }
});

router.get("/status", function(req, res, next) {
    res.send(isStart ? "Running":"Stopped");
})

module.exports = router;