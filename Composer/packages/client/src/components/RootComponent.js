import React from 'react';
import {createContext, useReducer, useEffect} from 'react';
import { fileReducer } from '../reducers/fileReducer';
import { messageReducer } from '../reducers/messageReducer';
import { updateFiles } from '../actions/fileAction';
import httpClient from '../utils/http';
import Layout from './Layout';
import MessageApi from './../utils/messageApi';
import { addSubEditor } from '../actions/messageAction';

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
        data:{},
        editors:[],
        openEditorTimes:0
    })

    useEffect(() => {
        window.addEventListener("message", receiveMessage, false);

        return function removeListener() {
            window.removeEventListener("message", receiveMessage, false);
        }
    })

    useEffect(() => {
        const editors = messageState.editors;
        if(editors.length > 0)
            postMessage(editors[0])
    }, [fileState.openFileIndex])

    function handleValueChange(editor, newValue) {
        if(editor.parentEditor === "") {
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
        } else {
            const frame = window.frames[editor.parentEditor];
            
            MessageApi.transferDataToSubEditor(frame, {
                'sub': editor.editorName,
                newValue
            })
        }
    }

    function getSuffix(fileName) {
        return fileName.substring(fileName.lastIndexOf('.'));
    }

    function getActiveEditor(source) {
        const editors = messageState.editors;
        const editor = editors.find((editor)=>{
            return  source === window.frames[editor.editorName]
        })

        return editor;
    }

    function postMessage(editor) {
        
        const file = editor.data;
        const editorType = getSuffix(file.name)
    
        const frame = window.frames[editor.editorName]

        MessageApi.sendDataToEditor(frame, {editorType, data:file.content})
    }

    function handleEditorOnLoad(editor) {
        const file = editor.data;
        const editorType = getSuffix(file.name)
    
        const frame = window.frames[editor.editorName]

        MessageApi.sendDataToEditor(frame, {editorType, data:file.content})

        if(editor.parentEditor !== "") {
            const parent = window.frames[editor.parentEditor];
            MessageApi.sendToParentOpenSuccess(parent, editor);
        }
    }

    function receiveMessage(event) {
        const data = event.data
        if(data.from && data.from === 'editor') {
            const activeEditor = getActiveEditor(event.source)
            if(activeEditor === undefined)
                return

            const commond = data.commond;
            switch(commond) {
                //need to use the load event of the document contained in the iframe, not the iframe itself.
                case 'onLoad':
                    handleEditorOnLoad(activeEditor)
                    break;
                case 'save':
                    handleValueChange(activeEditor, data.data);
                    break;
                case 'openSubEditor':
                    messageDispatch(
                        addSubEditor(
                            {
                                position: data.data.position, 
                                parentName: activeEditor.editorName,
                                data: data.data.subData})
                    )
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