const MessageApi = {
    sendDataToEditor: (editor, data) => {
        editor.postMessage({
            'from': 'shell',
            'commond': 'updateData',
            ...data,
        })
    },

    transferDataToSubEditor: (editor, data) => {
        editor.postMessage({
            'from': 'shell',
            'commond': 'updateSubData',
            ...data,
        })
    },
}

export default MessageApi