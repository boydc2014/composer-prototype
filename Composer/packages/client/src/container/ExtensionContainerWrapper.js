import React, {useEffect, useRef} from 'react';

function ExtensionContainerWrapper(porps) {

    const iframeEl = useRef(null);
    const {editorType, data, column} = porps;

    useEffect(() => {
        window.addEventListener("message", receiveMessage, false);

        return function removeListener() {
            window.removeEventListener("message", receiveMessage, false);
        }
    }, [])

    function receiveMessage(event) {

    } 

    function postMessage() {
        iframeEl.current.contentWindow.postMessage({editorType, data})
    }

    return (
        <iframe ref={iframeEl} title={column} src='/extensionContainer.html' onLoad={postMessage}/>
    )
}

export default ExtensionContainerWrapper