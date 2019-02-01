# Composer
The web app that can edit bots in OBI format, and can use Bot Launcher to run bot.

# Instructions

prerequisite:
* node\npm
* yarn

in this folder

```
$ yarn install // install dependencies
$ yarn server // start api server
// open a new command line window
$ yarn start  // start front end
```
then go to http://localhost:3000/, make sure you use Chrome


# Extensions
Composer is built with an extension system, this project shows samples of the extension system

## What's an extension for
An extention is used to provide an editor for a certain type of bot content. It can be .lu, .lg, .dialog, etc.

All editors is loaded as extensions.

We are NOT targeting non-editor extension at this time, even thought the mechanism described here is a general extension system for any html page.

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

Then if you put this package under `src/extensions`, you've already finished the registeration. 

### discovery

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

## How an extension interacts with composer?


### messaging API
We use IFrame as container for extension since it's a starndard approach. 

The way the window inside IFrame conmunicate with the parent window is usually using two standard API
* [window.postMesssage](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API) 

  this allows you to send a message to a certain window. Both sides in the IFrame holds each other's reference, so it can use this api to post message. 
* [window.addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

  This allows you to listen on the messages being passed in. the postMessage api will pass data in the `message` endpoint. So usually a call is looks like this 

    ```
    window.addEventListener("message", receiveMessage, false);
    function receiveMessage(event) {
    if (event.origin !== "http://example.org:8080")
        return;

        // ...
    }
  ```

two good reference to this approach are
1. [Two way iframe communication](https://gist.github.com/pbojinov/8965299)
2. [VSCode webview api](https://code.visualstudio.com/api/extension-guides/webview#scripts-and-message-passing)

Because of the nature of `messaging`, comunication is not done by one single api call. It's requires the sender properly (at the right time, in the right way) send data with certain schema, the receiver also properly get and understand the schema. It requires a protocol or convention here. We followed the convention used in VSCode. 

### data-in story
Let's give some real examples and references to code to show data is passed in.

In data-in, the composer is the sender, the extension is the receiver. The convention here, is 
1. The composer will send the data, right after the extension is loaded
```
  /Composer/src/component/Editor.tsx
  
  handleLoad = () => {
    window.frames[0].postMessage({
      type: 'init',
      data: this.props.content
    });
  }

  public render() {
    return (
        <iframe onLoad={this.handleLoad}
        />
    );
  }
```
2. The schema is simple with two field, `type` and `data`.
3. So the extension should be already listening on this message after loaded, here is sample code from an extension
```
  /Composer/src/extensions/jsoneditor/src/App.tsx
  
  componentDidMount() {
    window.addEventListener('message',this.handleMessage, false);
  }

  handleMessage = (event: any) => {

    try {
      const data = event.data;
      switch(data.type) {
        case 'init':
          ...
      }
```
That's the real extension initlization process, with data passed from composer to extension. You can image, there are other type of messages, can be encoded into this message schema. 

### data-out story

Let's out give an example of data-out story: the saving process.

After the composer init the extension with some sort of data, the extension will take from there, taking control all the rendering and interacting with users. Whenever an user make some changes, the changes is first kept in the editor, and then saved to composer.

In the saving process, the extension is the sender, the composer is the receiver

1. The extension can assume the composer is always listening at certain point for saving data, so just send it
```
    /Composer/src/extensions/jsoneditor/src/composerApi.tsx


    constructor() {
        this.originalPostMessage = window.parent.postMessage.bind(window.parent);
    }

    postMessage = (msg: any) => {
        return this.originalPostMessage({ command: 'onmessage', data: msg }, '*');
    }

    save = (code: string) => {
        const data = {
            'type':'save',
            'message': code 
        }
        this.postMessage(data);
    }
    
```
   here the send is done in this composerApi.tsx, it's just a helper class to send message
   
2. In the receiver side, it should already listening that
```
   /Composer/src/component/Editor.tsx
   handleMessageEvent = (e:any) => {
    if(e.data.command && e.data.command === 'onmessage') {
      const data = e.data.data;
     
      switch(data.type) {
        case 'save':
          ....
      }
    }
  }
```
it's similar to the data-in story, with a slightly difference that: at the main window, too much events can happen, so we have an extra field (command==='onmessage') to identify this is a message from extension.  This might not be necessary, but we just borrow that from VS code.

### other types of interactions
With this data-in\data-out stories, the core mechanism is clear, a simple messaging API with some kind of message schema defined and agreed with both side, aka, it's a protocol here. 

With this protocol, it's easy for us to expose more capability to the extension, for sth that can be done easily in composer but difficult in the extension itself, such as
* Send an alert
* Create a modal window

It's all done with this message protocol. See more details in [message protocol] 

## FAQ

### 1. Can I only develop an extension with javascript? 
No, you can use your prefered language and tooling, just need to make sure put a package.json and html artifact into `src/extensions`
But you do it in javascript and React, we have pretty useful sample and helper classes for you. 

### 2. Only html? what if I have something else, js, css to include in?
You can have compiled\packed into one single html, or you can refer those assets in your html, just make sure your assests can be accessed from the intented user's browser.

### 3. Can I control what time, what location my extension would be shown?
No, you can't at this point. 
Your extension can only specify what kind of data your extension is interested in. Composer will load\init your extension when this data needs to be edited. 
In the furture, we may expose more control to the extensions. 




# Appendix

## extension serving
## messaging protocol
Not needed to be defined perfectly at this time.
