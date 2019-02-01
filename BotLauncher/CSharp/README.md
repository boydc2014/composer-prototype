# Bot Launcher
The launcher project for the bot written in OBI format

# Instructions
1. config the reference to bot in appsettings.json
```
  An example
    "Bot": {
      "provider": "localDisk",
      "path": "../../Bots/SampleBot3/bot3.bot"
    }
```
2. build&run bot

   dotnet build & dotnet run
   
3. test bot

   After dotnet run, there will be a webservice started and listening at http://localhost:3979.

   You can start the BotBuilderTestBot.bot to test the bot.

   Or you can set you emulator to connect to http://localhost:3979/api/messages.


   