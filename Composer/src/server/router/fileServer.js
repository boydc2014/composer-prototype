var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var config = require('../../../package.json');

const fileList = [];

const botFilePath = config.bot.path;

router.get("/", function(req, res, next) {
    fs.readdir(botFilePath, (err, files) => {
        if(err) {
            res.status(400).json({error: 'get file list error'})
        } else {
            files.forEach((item, index) => {
                const temp = path.join(botFilePath, item)
                let stat = fs.lstatSync(temp);
                if(stat.isFile() === true) {
                    let content = fs.readFileSync(temp, "utf-8")
                    fileList[index] = {
                        name:item,
                        content:content
                    }
                }
            })
    
            res.status(200).json(fileList)
        }
    })
});

router.put("/", function(req, res, next) {
    fs.writeFile(path.join(botFilePath, req.body.name), req.body.content, {}, function (err) {
        if(err) {
            res.status(400).json({error: 'save error'})
         } else {
            res.send('OK');
         }
     });
});

module.exports = router;