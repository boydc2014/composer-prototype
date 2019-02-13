import React, {Component} from 'react'
import {render} from 'react-dom'

import JsonEditor from '../../src'
import 'brace/mode/json';
import 'brace/theme/monokai';

class Demo extends Component {
  render() {
    return <div>
      <h1>JsonEditor Demo</h1>
      <JsonEditor data="Hello world" onChange={this.onChange}/>
    </div>
  }

  onChange() {

  }
}

render(<Demo/>, document.querySelector('#demo'))
