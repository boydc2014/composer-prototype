import React, { useState, useEffect, Fragment, useContext} from 'react';
import './layout.css';
import httpClient from '../utils/http';
import { FileContext } from '../components/RootComponent';
import { updateFiles, setCurrentFile } from '../actions/fileAction';

function Layout() {
    const [botStatus, setBotStatus] = useState("stopped"); 
    const fileCtx = useContext(FileContext);
    const {files, openFileIndex} = fileCtx.fileState;

    useEffect(()=> {
        httpClient.getFiles((files) => {
            if(files.length > 0) {
                fileCtx.dispatch(updateFiles(files))
            }
        });
    }, [])

    function handleFileClick (index){
        fileCtx.dispatch(setCurrentFile(index))
    }

    console.log(openFileIndex)
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
                {openFileIndex > -1? 
                    <iframe 
                        name='editor'
                        title={openFileIndex} 
                        style={{height:'100%', width:'100%'}} 
                        src='/extensionContainer.html'/>
                    : 'Welcome'}
            </main>
        </Fragment>
    )
}

export default Layout;
