import * as React from 'react';

class Editor extends React.Component<any, any> {

  private iframeRef: any;

  constructor(props: any) {
    super(props);
    this.iframeRef = React.createRef();
    this.state = {
      content:props.content
    }
  }


  componentDidMount() {
    window.addEventListener('message', this.handleMessageEvent)
  }
  
  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessageEvent)
  }

  handleMessageEvent = (e:any) => {
    if(e.data.command && e.data.command === 'onmessage') {
      const data = e.data.data;
      console.log(e.source);
      switch(data.type) {
        case 'save':
          this.setState({content: data.message})
          this.props.onSave(data.message)
          alert(data.message);
          break;
        case 'alert':
          alert(data.message);
          break;
        case 'confirm':
          const result = confirm(data.message);
          alert(result);
          break;
      }
    }
  }

  handleLoad = () => {
    window.frames[0].postMessage({
      type: 'code',
      code: this.props.content
    });
  }

  public render() {
    return (
        <iframe
          key = {this.props.index}
          ref = {this.iframeRef}
          src = {this.props.src}
          className = "App-iframe"
          scrolling="no" 
          frameBorder="0"
          onLoad={this.handleLoad}
        />
    );
  }
}

export default Editor;
