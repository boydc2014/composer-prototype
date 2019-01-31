# Composer
The web app that can edit bots in OBI format, and can config\start Bot Launcher

# Extensions
Composer is built with an extension system, this project shows samples of the extension system

## What's an extension for
An extention is used to provide an editor for a certain type of bot content. It can be .lu, .lg or certain type of dialog

## What's an extension? what's in it
An extension is an standalone javascript package located under `src/extensions`. 

An extension should produce an html page to be loaded in the composer. 

An extension must have a package.json which describe two things
1. What's type of content is this extension used for