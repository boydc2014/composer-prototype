
// this is currently hard-coded here
// it should be discovered and generated when compiling things together

const EditorMapping = {
    '.bot' : 'static/extensions/jsonEditor.html',
    '.dialog' : 'static/extensions/jsonEditor.html',
    '.json': 'static/extensions/jsonEditor.html',
    '.lg': 'static/extensions/markdownEditor.html',
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