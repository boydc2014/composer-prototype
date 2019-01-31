const EditorMapping = {
    '.bot' : 'static/extensions/jsonEditor.html',
    '.json': 'static/extensions/jsonEditor.html',
    '.lu': 'static/extensions/markdownEditor.html',
    '.md': 'static/extensions/markdownEditor.html'
}

const getEditorUrl = (documentType) => {
    if(EditorMapping[documentType]) {
        return EditorMapping[documentType]
    } else {
        return null
    }
}

export default getEditorUrl