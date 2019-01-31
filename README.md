# composer-prototype
The prototype of BF composer, showing the architecure, and the extension system.

# architecture
This project mainly includes three components
- Composer app
   
Composer app is a web app providing editing experience on the underlying bot. Composer will reference one bot in the `bots` folder. 

Composer app can also start the bot, by invoking `bot launcher`, then allow users to test bot in composer. 

- Bot launcher

Bot launcher will load an bot from `bots` folder, and start a bot instance, ready to serve. It will allow composer and anyone to connect to. 

- Bots

Bots folder is the storage of bot assets. Here it just contains a bunch of folders and files. The storage layer holds the ground truth of each bot. 

Each bot is defined by a ".bot" file, which includes all the references to the assets this bot would use. A sample .bot file can be found here [TBD].