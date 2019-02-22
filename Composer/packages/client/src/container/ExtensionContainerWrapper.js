import React, {useEffect, useRef} from 'react';

function ExtensionContainerWrapper(porps) {

    const iframeEl = useRef(null);
    const {editorType, data, column, onChange} = porps;

    useEffect(() => {
        window.addEventListener("message", receiveMessage, false);

        return function removeListener() {
            window.removeEventListener("message", receiveMessage, false);
        }
    }, [])

    useEffect(() => {
        iframeEl.current.contentWindow.postMessage({editorType, data})
    }, [porps.data])

    function receiveMessage(event) {
        if(event.data.from && event.data.from === 'editor') {
            const commond = event.data.commond;
            switch(commond) {
                //need to use the load event of the document contained in the iframe, not the iframe itself.
                case 'onLoad':
                    postMessage();
                    break;
                case 'save':
                    onChange(event.data.data);
                    break;
                default:
                    break;
            }
        }
    } 

    function postMessage() {
        iframeEl.current.contentWindow.postMessage({editorType, data})
    }

    return (
        <iframe ref={iframeEl} title={column} style={{height:'100%', width:'100%'}} src='/extensionContainer.html'/>
    )
}

export default ExtensionContainerWrapper