# composer-prototype
The prototype of BF composer, showing the architecure, and the extension system.

# architecture
This project mainly includes three components
1. Composer app
   
Composer app is a web app providing editing experience on the underlying bot. Composer will reference one bot in the `bots` folder. 

Composer app can also start the bot, by invoking `bot launcher`, then allow users to test bot in composer. 

2. Bot launcher

Bot launcher will load an bot from `bots` folder, and start a bot instance, ready to serve. It will allow composer and anyone to connect to. 

3. Bots

Bots folder is the storage of bot assets. Here it just contains a bunch of folders and files. The storage layer holds the ground truth of each bot. 

Each bot is defined by a ".bot" file, which includes all the references to the assets this bot would use. A sample .bot file can be found here [TBD].


## interactions
The interactions between each component looks like:

Composer -- `Edit` --> Bots

Composer --`Launch`--> Bot Launcher

Bot launcher -- `load` --> Bots

## key points

A few key points about this kind of architecure that help understand are that

* `Bots` holds ground truth.

  Which means everything about the bot, not composer, not bot launcher. 
  
  Composer and bot launcher can be viewed as stateless applications, which only have a reference to bots. 

* `Bot launcher` don't design with `composer` in mind. 

  Bot launcher only depends and focus on `bots`. Nothing to do with composer. Even though composer will be able to run the launcher. 

* `Composer` knows everything about `bots` and `bot launcher` 
  
  Composer needs to know how to start the launcher with property configuration to launcher specific bot. 

# configurations


