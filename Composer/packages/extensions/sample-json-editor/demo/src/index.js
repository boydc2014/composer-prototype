import React, {Component} from 'react'
import {render} from 'react-dom'

import JsonEditor from '../../src'

class Demo extends Component {
  render() {
    return <div>
      <h1>JsonEditor Demo</h1>
      <JsonEditor style={{"height":"800px"}} data="Hello world" onChange={this.onChange}/>
    </div>
  }

  onChange() {

  }
}

render(<Demo/>, document.querySelector('#demo'))
