import React from 'react';
import {createContext, useReducer, useEffect} from 'react';
import { fileReducer } from '../reducers/fileReducer';
import { messageReducer } from '../reducers/messageReducer';
import { updateFiles } from '../actions/fileAction';
import httpClient from '../utils/http';
import Layout from './Layout';

export const FileContext = createContext(null);
export const MessageContext = createContext(null);

function RootComponent(props) {

    const [fileState, fileDispatch] = useReducer(fileReducer, {
        isFetching: false,
        files: [],
        openFileIndex: -1
    });

    const [messageState, messageDispatch] = useReducer(messageReducer, {
        commond:'',
        data:{}
    })

    useEffect(() => {
        window.addEventListener("message", receiveMessage, false);

        return function removeListener() {
            window.removeEventListener("message", receiveMessage, false);
        }
    })

    useEffect(() => {
        postMessage()
    }, [fileState.openFileIndex])

    useEffect(() => {
        
    }, [fileState.files])

    function handleValueChange(newValue) {
        const currentIndex = fileState.openFileIndex;
        const files = fileState.files;

        let payload = {
            name: files[currentIndex].name,
            content: newValue
        }
      
        let newFiles = files.slice();
        newFiles[currentIndex].content = newValue;
        
        fileDispatch(updateFiles(newFiles))

        httpClient.saveFile(payload)
    }

    function getSuffix(fileName) {
        return fileName.substring(fileName.lastIndexOf('.'));
    }

    function postMessage() {
        const openFileIndex = fileState.openFileIndex;

        if(openFileIndex > -1) {
            const files = fileState.files;
            const file = files[openFileIndex]
            const editorType = getSuffix(file.name)
    
            window.frames['editor'].postMessage({editorType, data:file.content})
        }
    }

    function receiveMessage(event) {
        if(event.data.from && event.data.from === 'editor') {
            const commond = event.data.commond;
            switch(commond) {
                //need to use the load event of the document contained in the iframe, not the iframe itself.
                case 'onLoad':
                    postMessage();
                    break;
                case 'save':
                    handleValueChange(event.data.data);
                    break;
                default:
                    break;
            }
        }
    } 

    return (
        <FileContext.Provider value={{fileState, dispatch: fileDispatch}}>
            <MessageContext.Provider value={{messageState, dispatch: messageDispatch}}>
                <Layout/>
            </MessageContext.Provider>
        </FileContext.Provider>
    )
}

export default RootComponent;