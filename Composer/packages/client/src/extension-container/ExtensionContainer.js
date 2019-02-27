import React, {useState, useEffect, Fragment} from 'react';
import './extensionContainer.css';
import ShellApi from './ShellApi';
import getEditor from './EditorMap';

/**
 * ExtensionContainer is a IFrame container to host any extension as React component
 * ExtensionContainer provides a React absraction to it's inner extention, on top of the 
 * underlying messaging api between ExtensionContainer and Shell
 * 
 * An extension won't have to know this ExtensionContainer exists, it just use the props
 * passed into it to communite with Shell. Those props is actually implement in Container layer.
 * 
 * The data and controls flows look like this
 *  Shell <---(messaging)---> Container <---(react props)---> Extension
 *
 */
const testRightContent = {
    name: 'Microsoft.CallDialog',
    content: `{
        "$type": "Microsoft.TextPrompt",
        "$id": "namePrompt",
        "property": "name",
        "pattern": "\\w{3,50}",
        "initialPrompt": "What's your nick name?",
        "retryPrompt": "Let's try again, what's your name?",
        "noMatchResponse": "You need to give me at least 3 chars to 30 chars as a name."
    }`
}

const testDownContent = {
    name: 'Microsoft.CallDialog',
    content: `{
        "$type": "Microsoft.TextPrompt",
        "$id": "countryPrompt",
        "property": "country",
        "pattern": "\\w{3,50}",
        "initialPrompt": "{template(prompt-country)}",
        "retryPrompt": "Let's try again, what's your country of birth?",
        "noMatchResponse": "You need to give me at least 3 chars to 30 chars as a country."
    }`
}

function ExtensionContainer() {

    const [value, setValue] = useState(``);
    const [type, setType] = useState('');

    const shellApi = new ShellApi();
    let RealEditor = "";

    useEffect(() => {
        window.addEventListener("message", receiveMessage, false);
        shellApi.loadSuccess();
        return function removeListener() {
            window.removeEventListener("message", receiveMessage, false);
        }
    }, [])

    function receiveMessage(event) {
        if(event.source === window.parent) {
            const data = event.data;
            setType(data.editorType);
            setValue(data.data);
        }
    } 

    if(type !== "") {
        RealEditor = getEditor(type)
    }

    return (
        <Fragment>
            <button 
                onClick={()=>{shellApi.openSubEditor('right', testRightContent)}}>
                open right
            </button>
            <button 
                onClick={()=>{shellApi.openSubEditor('down', testDownContent)}}>
                open down
            </button>
            {RealEditor === ''?''
            :<RealEditor data={value} onChange={shellApi.saveValue} shellApi={shellApi}/>}
        </Fragment>
    )
}

export default ExtensionContainer