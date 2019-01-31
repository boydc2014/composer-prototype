
class ComposerApi {

    private originalPostMessage: any;

    constructor() {
        this.originalPostMessage = window.parent.postMessage.bind(window.parent);
    }

    postMessage = (msg: any) => {
        return this.originalPostMessage({ command: 'onmessage', data: msg }, '*');
    }

    alert = (msg: string) => {
        const data = {
            'type':'alert',
            'message': msg
        }
        this.postMessage(data);
    }

    confirm = (msg: string) => {
        const data = {
            'type':'confirm',
            'message': msg
        }
        this.postMessage(data);
    }

    save = (code: string) => {
        const data = {
            'type':'save',
            'message': code 
        }
        this.postMessage(data);
    }
}

export default ComposerApi