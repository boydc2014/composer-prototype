# composer-prototype
The prototype of BF composer, showing the architecure, and the extension system.

# architecture

## components

This project mainly includes three components
1. Composer app
   
    Composer app is a web app providing editing experience on the underlying bot. Composer will reference one bot in the `bots` folder. 

    Composer app can also start the bot, by invoking `bot launcher`, then allow users to test bot in composer. 

2. Bot launcher

    Bot launcher will load an bot from `bots` folder, and start a bot instance, ready to serve. It will allow composer and anyone to connect to. 

3. Bots

    Bots folder is the storage of bot assets. Here it just contains a bunch of folders and files. The storage layer holds the ground truth of each bot. 

Each bot is defined by a ".bot" file, which includes all the references to the assets this bot would use. 


## interactions
The interactions between each component looks like:

* Composer -- `Edit` --> Bots

* Composer --`Launch`--> Bot Launcher

* Bot launcher -- `load` --> Bots

Note that those interactions are one-way, thus the dependency is one-directoin. This would greatly simplify the design of each component. 

## key points

In this one-direction dependency design. A few key points about this kind of architecure that help understand are that


* `Bots` holds ground truth.

  Which means everything about the bot, not composer, not bot launcher. 
  
  Composer and bot launcher can be viewed as stateless applications, which only have a reference to bots. 

* `Bot launcher` don't design with `composer` in mind. 

  Bot launcher only depends and focus on `bots`. Nothing to do with composer. Even though composer will be able to run the launcher. 

* `Composer` knows everything about `bots` and `bot launcher` 
  
  Composer needs to know how to start the launcher with property configuration to launcher specific bot. 

## folder structure

Then let's explore the structure of each component, and dive into some config files to show how this kind of intertion is supported by those files. 

Here is a overview of the folder structure, with hightlighting on some important config files. 

    /- BotLauncher
      /- CSharp
        /- appsettings.json (has a ref to xx.bot, otherwise which bot to run?)
    /- Bots
      /- SampleBot1
        /- bot1.bot    (bot project file, maybe we can call it .botproject, all files should be referenced here)
    /- Composer
      /- config.json   (the config to the composer)
      /- launcher.json (composer use this config to start Bot Launcher)


It's very clearly divided in the top level, each component has it's own folder. 

## .bot file
The most important file in `Bots` folder is each .bot file, which defined a bot, containing all the references within this bot. 
```
/Bots/SampleBot1/bot1.bot

{
    services: [
        // luis
        // qna
    ],

    files: [
        ./**/*.lu
        ./**/*.lg
        ./**/*.dialog
    ]
    
    entry: "./dialogs/start.dialog"

}

```

.bot is basicly a project file, include all the references to all assets, and other necessary infomation to run a bot. 

## Bot launcher configuration

Since all assets are defined in bots. The bot launcher's config is simple, only need to know about where to find a bot.

```
/BotLauncher/CSharp/appsettings.json
{
    // this is the bot to be launched
    bot: {
        provider: "localDisk",
        path: "../../Bots/SampleBot1/bot1.bot
    }

    // it may include some othe info to run like
    endpoint: "localhost:3979"
}
```

## Composer configuration

### config.json

config.json in composer is where to specfic 
1. which bot we are editing (if we follow vscode convention, this should be in .composer, but let's make it simple here)
2. which launcher we are using

```
/Composer/config.json 
{
    // this is the bot we are editing\composing
    bot: {
        provider: "localDisk"
        path: "../../Bots/SampleBot1/bot1.bot"
    }
    
    launcher: {
        startCommand: "cp launcher.json '../../BotLauncher/CSharp/appsetings.json' && cd '../../BotLauncher/CSharp' && dotnet run"
    }
}
```

It's very self-explained, the "bot" section tell the composer where the bot is, the "launcher" section tell the composer how to play with the launcher. 

### launcher4[CS\NODE].json

there is also a `launcher4CS.json` inside composer, which is designed to override the config inside launcher, to make sure the launcher is started the way composer wants.

``` 
/Composer/launcher4CS.json (same schema as /BotLauncher/CSharp/appsettings.json)

this whole file will be copied to the Bot Launcher folder to start Launcher

{
    bot: {
        provider: "localDisk",
        path: "C://Bots/SampleBot1/bot1.bot"  // note there the value is faltten, become this is supposed to copied into 
    }

    // it may include some othe info to run like
    endpoint: "localhost:3979"
}

```
So, if you look at the startCommand of launcher in package.json (insider composer), you will see this launcher.json is copied to the launcher then use it to start. 

An alertative way to this "copy and start" is to tell the launcher config file using command line such as
```
  dotnet run -f launcher4CS.json
```

this may also make sense. but the way we see the benifits of the copy and start approach can help make sure the configuration is complete in the launcher folder, thus it won't block the later deployment step. 

## conclusion
that's it, the high-level architecture is simple, i guess. 





