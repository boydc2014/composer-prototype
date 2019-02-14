import React, {Component} from 'react'
import AceEditor from 'react-ace';

import 'brace/mode/json';
import 'brace/theme/monokai';

class JsonEditor extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AceEditor
        mode="json"
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