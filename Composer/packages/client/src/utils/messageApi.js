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

    sendToParentOpenSuccess: (editor, subEditorInfo) => {
        editor.postMessage({
            'from': 'shell',
            'commond': 'openSubSuccess',
            subEditorInfo
        })
    }
}

export default MessageApi