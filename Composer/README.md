# Composer
The web app that can edit bots in OBI format, and can use Bot Launcher to run bot.

# Instructions

Pre-require:
* node\npm
* yarn

in this folder

```
$ yarn install // install dependencies
$ yarn server // start api server
$ yarn start  // start front end
```
then go to http://localhost:3000/, make sure you use Chrome


# Extensions
Composer is built with an extension system, this project shows samples of the extension system

## What's an extension for
An extention is used to provide an editor for a certain type of bot content. It can be .lu, .lg, .dialog, etc.

All editors is loaded as extensions.

## What's an extension? what's in it
An extension is an standalone javascript package located under `src/extensions`. 

An extension should produce one and only one html page to be loaded in the composer. 

An extension must have a package.json which describe two things
1. The name of this extension
2. The type of content is this extension used for
3. The location where to find it's output

A sample package.json looks like this
```jsonc
/src/extensions/lueditor/package.json

{
    contributes: {
        name: "luEditor",
        target: {
            type: "fileExtension"
            value: ".lu"
        }
        path: "./index.html"
    }
}
```

## How an extension is discovered, loaded, hosted?

All packages under `src/extensions` folder would be loaded into composer when building the composer.

## how to interact with the host(composer)?