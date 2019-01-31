import './App.css';

import axios from 'axios';
import * as React from 'react';

import Editor from './component/Editor';
import getEditorUrl from './config';

class App extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      src:getEditorUrl('.json'),
      index:0,
      fileList:[]
    }
  }

  componentDidMount() {
    this.getFileListFromServer();
  }

  getFileListFromServer = () => {
    axios.get('http://localhost:5000/api/fileserver')
    .then((response:any) => {
      const state:any = {fileList:response.data}
      if(response.data.length > 0) {
        const postf=this.getPostf(response.data[0].name)
        state.src = getEditorUrl(postf);
        state.index = 0;
      }
      this.setState(state)
    }).catch(function(res){
      console.log(res);
    });
  }

  saveCodeToServer = (name: string, content: string) => {
    axios.put('http://localhost:5000/api/fileserver', {name, content})
    .then((response:any) => {
      alert('save success')
    }).catch(function(res){
      console.log(res);
    });
  }

  handleFileClick = (file:any, index:number) => {
    const fileName = file.name;
    const postf=this.getPostf(fileName)
    this.setState({src:getEditorUrl(postf), 'index':index})
  }

  sendSaveCmd = () => {
    window.frames[0].postMessage({type: 'save'});
  }

  handleSave = (content:string) => {
    const fileList = this.state.fileList
    if(fileList.length > 0) {
      this.saveCodeToServer(fileList[this.state.index].name, content)
    }
  }

  getPostf = (str: string) => {
    const index1=str.lastIndexOf('.');
    const index2=str.length;
    const postf=str.substring(index1,index2);
    return postf
  } 

  public render() {
    const fileList = this.state.fileList;

    return (  
      <div className="App">
        <header className="App-header">
          <div className="header-aside">Composer</div>
          <div className="header-editor"/>
        </header>
        <aside className="App-sidebar">
          <nav>
            <ul>
              {fileList.length > 0 && fileList.map((item: any, index: number)=>{
                return <li 
                  key={item.name}
                  onClick={()=>{this.handleFileClick(item, index)}}>
                    {item.name}
                  </li>
              })}
            </ul>
          </nav>
        </aside>
        <button className="App-editor-save" onClick={this.sendSaveCmd}>save</button>
        <Editor src={this.state.src} content={fileList.length>0? fileList[this.state.index].content:''} onSave={this.handleSave}/>
      </div>
    );
  }
}

export default App;
