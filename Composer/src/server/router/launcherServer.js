var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var process = require('child_process');
var config = require('../../../config.json');


var isStart = false;

var child = null;

router.get("/start", function(req, res, next) {
    try {
        if(isStart)
            throw new Error('has already started');

            child = process.exec(config.launcher.startCommand, (err, stdout, stderr) => {
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