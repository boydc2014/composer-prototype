import React, {Component} from 'react'
import AceEditor from 'react-ace';

class JsonEditor extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AceEditor
        mode="json"
        theme="monokai"
        name="blah2"
        height="100%"
        width="100%"
        onChange={this.props.onChange}
        fontSize={18}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={this.props.data}
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

export default JsonEditor;