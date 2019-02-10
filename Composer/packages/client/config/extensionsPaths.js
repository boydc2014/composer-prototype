'use strict';

const fs = require('fs');
const path = require('path');
const paths = require('./paths');

function getEditorHtml(dirPath) {
    let copyInfo = {};
    let hasConfig = false;
    let hasHtml = false;
    const files = fs.readdirSync(dirPath);
    files.forEach((item, index) => {
        if(item == 'package.json') {
            let config = fs.readFileSync(dirPath + "/" + item)
            config = JSON.parse(config);
            if(typeof config.contributes.name !== 'undefined') {
                hasConfig = true
                copyInfo['to'] = `static/extensions/${config.contributes.name}.html`
            }
        }

        if(item == 'index.html') {
            hasHtml = true
        }
    })

    if(hasConfig && hasHtml) {
        console.log(dirPath)
        copyInfo['from'] = path.join(dirPath, 'index.html');
        return copyInfo
    }

    return null
}

function getExtensionPaths() {
    let copyList = []
    const files = fs.readdirSync(paths.extensionsSrc);
    files.forEach((item, index) => {
        const temp = path.join(paths.extensionsSrc, item)
        let stat = fs.lstatSync(temp);

        if(stat.isDirectory() === true) {
            const info = getEditorHtml(temp);
            if(info !== null) {
                copyList.push(info)
            }
        }
    })
    
    return copyList
}

module.exports = getExtensionPaths;
