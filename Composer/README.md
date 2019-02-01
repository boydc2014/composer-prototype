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

We are NOT targeting non-editor extension at this time, even thought the mechanism described here is a general extension system for any html pages.

## What's an extension? what's in it
An extension is an standalone javascript package located under `src/extensions`. 

An extension should produce one and only one html page to be loaded in the composer. 

An extension must have a package.json which describe two things
1. The name of this extension
2. The type of content is this extension used for
3. The location where to find it's output

A sample package.json looks like this
```
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

## How an extension is registered, discovered, loaded, hosted?

### registeration
In the configuration above, with the "contributes" section in package.json, an extension has already declared what this  extension is used for: it's an extension targeting .lu files.

### discovery
Then if you put this package under `src/extension`, you've already finished the registeration. 

All packages under `src/extensions` folder would be discovered, and the output of each extensoin (it's html) will be copied into the build artificat folder of the composer app. Then served by the composer. See more details about [extension serving]. 

The discovery process will produce an mapping from target => extension. Target usally means a certain file type, or dialog type.

### loading

The loading of the extension is totally controlled by composer, it can be a lazy-loading or pre-loading (for the sake of better performace). 

Here in this protoype, we showed how a typical laze-loading process looks like:

When the composer starts up, composer will try to read all bot assets, starting from the .bot file, then resolve all it's dependencies. And list all files into the sidebar on the left.

When user click a ".lu" file, the composer knows which extension can hanlde this ".lu" file, based on the mapping produced in the discovery phrase. Then load this extension, and pass data (file content) to this extensoin to properly render ui. 

### hosting

Extensoins are guranteed to be hosted in an isolated (from the main composer window) container, like IFrame in this case.

But it's up to composer to put extension into IFrame, which means composer may use

* `shared mode`.  only one IFrame is created a certain display area, shared by all the extensions that may show up there
* `dedicated mode`. one dedicated IFrame for one extension.

Shared mode is good for simplicity. Dedicated mode may add effort to schedule the show\hide logic of a bunch extensions, but it's more performance friendly for pre-loading extensions.

We may use a combine of shared mode and dedicated mode. In this prototype, we should how a shared mode work.

Either or, the extension don't have to worry about how it's gone to be loaded, and hosted, it should focus on how to interact with composer. 

## how to interact with the host(composer)?














# Appendix

## extension serving