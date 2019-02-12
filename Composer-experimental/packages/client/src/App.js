import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios';
import getEditor from './EditorMap';
import Frame, { FrameContextConsumer } from 'react-frame-component'
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      index: -1,  // index of the file been editing
      editor: ""  // editor been using
    }
  }

  // this is extremely useful to make css is referenced
  getStyles = () => {
    let head = '';
    const sheets = Array.from(document.querySelectorAll('link[rel=stylesheet]'));
    const styles = Array.from(document.querySelectorAll('head style'));
  
    sheets.forEach(link => {
      head += link.outerHTML;
    });
  
    styles.forEach(style => {
      head += style.outerHTML;
    });
  
    return head;
  };

  componentDidMount() {
    this.getFiles();
  }


  handleFileClick = (file, index) => {
    const suffix = this.getSuffix(file.name)
    this.setState({src:getEditor(suffix), 'index':index})
  }

  getFiles() {
    axios.get('http://localhost:5000/api/fileserver')
    .then((response:any) => {
      const state:any = {files:response.data}
      if(response.data.length > 0) {
        const suffix = this.getSuffix(response.data[0].name)
        state.editor = getEditor(suffix);
        state.index = 0;
      }
      this.setState(state)
    }).catch(function(res){
      console.log(res);
    });
  }

  getSuffix(fileName) {
    return fileName.substring(fileName.lastIndexOf('.'));
  }

  onChange(newValue) {
    console.log(newValue);
  }

  render() {
    const files = this.state.files;
    const Editor = this.state.editor;

    var data = "";
    if (this.state.index >= 0)
    {
      data = this.state.files[this.state.index].content;
    }

    var editor = "";
    if (Editor === ""){
      editor = <p> No editor yet </p>
    }
    else {
      editor = <Editor data={data} onChange={this.onChange} />
    }


    return (
      <div className="App">
        <header className="App-header">
          <div className="header-aside">Composer</div>
        </header>
        <aside className="App-sidebar">
          <nav>
          <ul>
              {files.length > 0 && files.map((item, index)=>{
                return <li 
                  key={item.name}
                  onClick={()=>{this.handleFileClick(item, index)}}>
                    {item.name}
                  </li>
              })}
            </ul>
          </nav>
        </aside>
        <div className="App-iframe">
        

        
        <Frame style={{"border":"0px", "width":"100%", "height":"100%"}}
         initialContent={`<!DOCTYPE html><html class="frame-html"><head>${this.getStyles()}</head><body class="frame-body"><div class="frame-root"></div></body></html>`}>
          
           {editor}
           
        </Frame>
        </div>
      </div>
    );
  }
}

export default App;
