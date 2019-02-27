import React, { useState, useEffect, Fragment, useContext} from 'react';
import httpClient from '../utils/http';
import { FileContext, MessageContext } from '../components/RootComponent';
import { updateFiles, setCurrentFile } from '../actions/fileAction';
import './layout.css';
import { openNewEditor } from '../actions/messageAction';

function Layout() {
    const [botStatus, setBotStatus] = useState("stopped"); 
    const fileCtx = useContext(FileContext);
    const messageCtx = useContext(MessageContext);
    const {files} = fileCtx.fileState;
    const {editors} = messageCtx.messageState;

    useEffect(()=> {
        httpClient.getFiles((files) => {
            if(files.length > 0) {
                fileCtx.dispatch(updateFiles(files))
            }
        });
    }, [])

    function handleFileClick (index){
        messageCtx.dispatch(openNewEditor(files[index]))
        fileCtx.dispatch(setCurrentFile(index))
    }

    return (
        <Fragment>
            <header className="App-header">
                <div className="header-aside">Composer</div>
                <div className="App-bot">
                    <button className="bot-button" onClick={()=>httpClient.toggleBot(botStatus, (status)=>{setBotStatus(status)})}>
                        {botStatus === "running"? "Stop Bot":"Start Bot"}
                    </button>
                    <span className="bot-message">
                        {
                            botStatus === "running"? 
                            "Bot is running at http://localhost:3979":""
                        }
                    </span>
                </div>
            </header>
            <aside className="App-sidebar">
                <nav>
                    <ul>
                        {files.length > 0 && files.map((item, index)=>{
                        return <li 
                            key={item.name}
                            onClick={()=>{handleFileClick(index)}}>
                            {item.name}
                            </li>
                        })}
                    </ul>
                </nav>
            </aside>
            <main className="App-main">
                {editors.length > 0?
                    editors.map((editor)=>{
                        return (
                            <iframe 
                                key={editor.editorName}
                                name= {editor.editorName}
                                title={editor.editorName} 
                                style={{height:'100%', width:'100%', gridRow:editor.row, gridColumn:editor.col,}} 
                                src='/extensionContainer.html'/>)
                    })
                    : 'Welcome'}
            </main>
        </Fragment>
    )
}

export default Layout;
