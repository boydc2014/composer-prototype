import React, {useState, useEffect, Fragment} from 'react';
import './extensionContainer.css';
import ShellApi from './ShellApi';
import Editor from './Editor';

function ExtensionContainer() {

    const [value, setValue] = useState(``);
    const [type, setType] = useState('');

    const shellApi = new ShellApi();

    useEffect(() => {
        window.addEventListener("message", receiveMessage, false);

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

    return (
        <Fragment>
            {type === ''?'Welcome'
            :<Editor editorType={type} data={value} shellApi={shellApi}/>}
        </Fragment>
    )
}

export default ExtensionContainer