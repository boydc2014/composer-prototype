# Composer (prototype)

The prototype of BF composer, showing the architecure, and the extension system.

# Architecture

## components

This prototype includes two components

####application

  A web app providing an editing experience on bot assets. The application has access to any bots made available to it from the `bots` property in `config.json`. See below for more details.

  The application also has the ability to start the bot via the BotLauncher. This is a common scenario after one has used the application's dialog editing capabilities and wants to see the current state of the dialogs through conversation with the bot's runtime.

####launcher

  On command, the launcher will load an bot from `Bots` folder, and start a bot instance and have it ready to serve at a public endpoint. The application will then be able to connect to it during a conversational design session.

  The launcher watches the bot assets (.lu, .lg, .dialog) and reloads the bot runtime when a change in these files are observed.

####bots
Each bot is defined by a ".bot" file, which includes all the references to the assets this bot would use. **note** this is not the shape of the .bot file currently used in SDK v4 of Bot Framework Emulator v4. The structure of the .bot file is subject to change. 

## data flow

The bot's assets are the source of truth for the bot at any given time. The Application will hold dirty bot dialogs that will be lost until written into the bot's assets. The BotLauncher only references the state of the bot's assets and cannot read dirty bot assets held in the application.

<Needs Image>

## folder structure

Here is a overview of a potential folder structure

    /- BotLauncher
      /- CSharp
      /- Node
    /- Composer
      /- config.json   (the config to the composer)
    ...somewhere else on disk
    /-echo-bot
      /.bot

## a bot's .bot file

Here is an example of a .bot file intended to run on Node, with glob patterns for bot asset discovery.

```
{
  services: [
    {
      type: "luis",
      endpoint: ${luis_endpoint},
      app_id: ${luis_app_id},
      token: ${luis_token} 
    },
    {
      type: "qna",
      endpoint: ${qna_endpoint},
      app_id: ${qna_app_id},
      token: ${qna_token} 
    }
  ],

  files: [
    "./**/*.lu",
    "./**/*.lg",
    "./**/*.dialog"
  ]

  dialogEntry: "./dialogs/start.dialog",
  start: "node index.js"
}
```

the .bot file is used for the following:
- asset discovery via glob patterns
- service discovery for luis and qna, etc
- service credentials
- entry points for the dialog tree and the bot's runtime.

**note:** a goal to consider is the service credentials being *templated* in this file. we've made assumptions in the past about where these credentials should be stored and their shape.

## Composer configuration

### config.json

```
{
  // the path to the BotLauncher root
  launcherDir: "../../BotLauncher",
  bots: [
    //an array of bots to load in this application
    {
      path: "../../Bots/SampleBot1/bot1.bot",
      secrets: "../path/to/appsettings.json" // the path to credentials necessary to run the bot (and template into the .bot file)
    },
    {
      path: "../../Bots/SampleBot2/bot2.bot",
      secrets: "../path/to/local.env"
    }
  ]
}
```

To start the bot with updated dialogs the application references the "start" property in the .bot file and packs up up as a command line argument sent to the BotLauncher. The BotLauncher is able to infer the runtime (dotnet or node).

example: `node index.js --bot=${JSON.stringify(botFile)}`


## Editor extensions

see [Extensions](https://github.com/boydc2014/composer-prototype/blob/master/Composer/README.md#extensions)
