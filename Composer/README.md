# Composer
The web app that can edit bots in OBI format, and can use Bot Launcher to run bot.

### Instructions

prerequisite:
* node > 8.0
* yarn

in this folder

```
$ yarn install // install dependencies
$ yarn server // start api server
// open a new command line window
$ yarn start  // start front end
```

then go to http://localhost:3000/, best experienced in Chrome 

###Extensions
Composer is built with an extension system, this project shows samples of the extension system

#### What's an extension for
An extention is used to provide an editor for a certain type of bot content. It can be .lu, .lg, .dialog, etc.

All editors are loaded as extensions.

Non-editor extensions are not supported at this time, though the mechanisms for providing extensions will scale outside the dialog editor's.

#### What's an extension? what's in it
Each extension is a dependency inside the Composer's `extensions` package (managed via yarn workspaces)

Example path:

`/src/extensions/node_modules/@botframework/editors`

An extension should produce a single React component that can render 1..N editors that it wants to provide editing an experience for.

An extension must have a package.json which describes the following:
1. The name of this extension
2. The type of content this extension used for
3. The location where to find it's output

A sample package.json looks like this
```

{
  contributes: {
    target: {
        type: "fileExtension"
        value: ".lu"
    }
    path: "./index.js"
  }
}
```

### How an extension is discovered, registered, loaded, & hosted

#### discovery & registration

When Composer starts up, it traverses provided extensions and the dialogs for which it wishes to load for. During the design session with a Dialog is selected to be inspected, Composer looks up this mapping to find the appropriate editor to load for the Dialog. Full list of Dialog types to configure Editors for are TBD.

#### loading

The loading of the extension is totally controlled by composer, common loading patterns (lazy, prefetch) can be utilized but is not a concern of the extension.

Here in this protoype, we showed how a typical lazy-loading process looks like:

When the composer starts up, composer will try to read all bot assets, starting from the .bot file, then resolve all it's dependencies. And list all files into the sidebar on the left.

When user click a ".lu" file, the composer knows which extension can handle this ".lu" file, based on the mapping produced in the discovery phrase. The Composer sends a signal to the mounted Extension and an appropriate payload to give it the data and interface it needs for Composer to edit the current Dialog.

Loading an editor in the json-schema sense is the following:

1. Edit sends a signal to the Extension that it is time to render, and a payload representing the current `formData`
2. Extension loads its schemas `schema`, `uiSchema` (descriptions on what and how the form is the be rendered) with the given `formData`
3. On change of a value in a form control, we construct a not-yet-saved Dialog that when saved persists it to the Bot asset. Saving conventions are not yet defined, but could be a debounced auto-save, or save on demand, etc.

#### hosting

Extensions are gauranteed to be hosted in an isolated (from the main composer window) container, like `<iframe />`. Communication between the Composer window and the child windows are over the `frames` WebAPI.

The outer window renders the `<iframe />` tags - the extensions don't explicitly know this detail. They only communicate over our documented API.

* `shared mode`. only one `<iframe />` is created a certain display area, shared by all the extensions that may show up there
* `dedicated mode`. one dedicated `<iframe />`for one extension.

Shared mode is good for simplicity. Dedicated mode may add effort to schedule the show\hide logic of a bunch extensions, but it's more performance friendly for pre-loading extensions. We will be mostly using dedicated mode.

We may use a combine of shared mode and dedicated mode. In this prototype, we should how a shared mode work.

## The Extentions API

### messaging API
The way the window inside the `<iframe />` conmunicates with the parent window is usually using two standard API
* [window.postMesssage](https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API) 

  this allows you to send a message to a certain window. Both sides in the `<iframe />` holds each other's reference, so it can use this api to post message.

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

As a reference, these articles explain how `<iframes/>` can be used.
1. [Two way iframe communication](https://gist.github.com/pbojinov/8965299)
2. [VSCode webview api](https://code.visualstudio.com/api/extension-guides/webview#scripts-and-message-passing)

### data coming in to the extension
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
2. The schema is simple with two field, `type` and `data`. (final schema TBD)
3. So the extension should be already listening on this message after loaded, here is sample code from an extension
```
  /Composer/src/extensions/jsoneditor/src/App.tsx
  
  componentDidMount() {
    window.addEventListener('message', this.handleMessage, false);
  }

  handleMessage = (event: any) => {

    try {
      const data = event.data;
      switch(data.type) {
        case 'init':
          ...
      }
```

### data-out story


_thoughts (chris)_

_we should consider the data-out of the extension coming through the Component API (functions passed in when first mounted). Because we're on React we should utilize the framework to move data-around unless isolation needs to be considered. proposal: data-in: the frames API. data-out: functions passed in through props_ 

Let's out give an example of data-out story: the saving process.

After the composer initializes the extension with some data, the Extension renders a declarative form that the user can interact with. Whenever a user makes some changes in this form the updated current formData is kept in the Editor until a Save event is triggered. 

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
it's similar to the data-in story, with a slight difference that: at the main window, too much events can happen, so we have an extra field (command==='onmessage') to identify this is a message from extension.  This might not be necessary, but we just borrow that from VS code.

### other types of interactions
With this data-in/data-out stories, the core mechanism is clear, a simple messaging API with some kind of message schema defined * coded against.

With this protocol, it's easy for us to expose more capability to the extension, for sth that can be done easily in composer but difficult in the extension itself, such as
* Send an alert
* Create a modal window

### Dialog editing

If the field being edited is part of a parent Dialog, we may need to provide an alert allowing the user to let us know if the intention is to edit the base Dialog or create a new dialog with this edited override. (business requirement needed). If the user chooses to modify the base dialog, this will update all Dialogs that currently inhereit from it.

### extending an extension

As designed, the Extension is sealed to its current React Component implementation. If during a design session one wanted to add a property on a Dialog configured to a particular Extension that was not supported by the Editors current schema, this would require a new schema, which would map to a new Editor type.
