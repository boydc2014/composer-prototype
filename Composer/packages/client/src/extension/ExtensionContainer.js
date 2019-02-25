import React, {useState, useEffect, useMemo, Fragment} from 'react';
import './extensionContainer.css';
import ShellApi from './ShellApi';
import getEditor from './EditorMap';

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
    
    useMemo(() => {
        if(type !== "") {
            RealEditor = getEditor(type)
        }
    })

    function receiveMessage(event) {
        if(event.source === window.parent) {
            const data = event.data;
            setType(data.editorType);
            setValue(data.data);
        }
    } 

    return (
        <Fragment>
            {RealEditor === ''?''
            :<RealEditor data={value} onChange={shellApi.saveValue} shellApi={shellApi}/>}
        </Fragment>
    )
}

export default ExtensionContainer