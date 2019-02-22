class ShellApi {
    constructor() {
        this.postMessage = window.parent.postMessage.bind(window.parent); 
    }

    saveValue = (data) => {
        this.postMessage({
            from: 'editor',
            commond: 'save',
            data: data
        })
    }
}

export default ShellApi