import './App.css';

import * as React from 'react';

import AceEditor from 'react-ace';
import ComposerApi from './composerApi';
import 'brace/mode/markdown';
import 'brace/theme/monokai';

class App extends React.Component<any, any> {

  private composerApi: ComposerApi;

  constructor(props: any) {
    super(props)
    this.composerApi = new ComposerApi();
    this.state = {
      codeDetail: ''
    }
  }

  componentDidMount() {
    window.addEventListener('message',this.handleMessage, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage)
  }

  handleMessage = (event: any) => {

    if(event.source !== window.parent) {
      return;
    }

    try {
      const data = event.data;
      switch(data.type) {
        case 'save':
          this.composerApi.save(this.state.codeDetail);
          break;
        case 'code':
          this.setState({codeDetail:data.code});
          break;
      }
    } catch(err) {
      console.log('json parse error');
    }
  }

  onChange = (newValue:any) => {
    this.setState({codeDetail:newValue})
  }

  public render() {
    return (
      <AceEditor
        mode="markdown"
        theme="monokai"
        name="blah2"
        height="100%"
        width="100%"
        onChange={this.onChange}
        fontSize={18}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={this.state.codeDetail}
        setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2
        }}/>
    );
  }
}

export default App;
