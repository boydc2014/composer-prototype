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
        "services": [
        ],
        "files": [
           "main.dialog"
        ],
        "entry": "main.dialog"
    }`
}

const testDownContent = {
    name: 'Microsoft.CallDialog',
    content: `{
        "services": [
        ],
        "files": [
           "main.dialog"
        ],
        "entry": "main.dialog"
    }`
}

function ExtensionContainer() {

    const [value, setValue] = useState(``);
    const [type, setType] = useState('');
    const [subEditors, setSubEditors] = useState([]);

    const shellApi = new ShellApi();
    let RealEditor = "";

    useEffect(() => {
        window.addEventListener("message", receiveMessage, false);
        shellApi.loadSuccess();
        return function removeListener() {
            window.removeEventListener("message", receiveMessage, false);
        }
    })

    function receiveMessage(event) {
        if(event.source === window.parent) {
            const data = event.data;
            console.log(data)
            switch(data.commond) {
                case 'updateData':
                    setType(data.editorType);
                    setValue(data.data);
                    break;
                case 'updateSubData':
                    const editors = subEditors.map((item)=>{
                        if(item.editorName === data.sub) {
                            item.data.content = data.newValue
                            shellApi.saveValue(data.newValue)
                        }

                        return item
                    })
                    setSubEditors(editors)
                    break;
                case 'openSubSuccess':
                    subEditors.push(data.subEditorInfo);
                    setSubEditors(subEditors)
                    break;                   
                default:
                    break;
            }
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