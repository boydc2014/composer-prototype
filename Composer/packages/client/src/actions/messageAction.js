const RECEIVE_COMMOND = "RECEIVE_COMMOND";
const OPEN_NEW_EDITOR = "OPEN_NEW_EDITOR";
const REMOVE_EDITOR = "REMOVE_EDITOR";
const ADD_SUB_EDITOR = "ADD_SUB_EDITOR";

const receiveCommond = (commond, data) => ({
    type: RECEIVE_COMMOND,
    commond,
    data
});

const openNewEditor = (data) => ({
    type: OPEN_NEW_EDITOR,
    data
})

const removeEditor = (editorInfo) => ({
    type: REMOVE_EDITOR,
    editorInfo
})

const addSubEditor = ({position, parentName, data}) => ({    
    type: ADD_SUB_EDITOR,
    position,
    parentName,
    data
})

export{
    RECEIVE_COMMOND,
    OPEN_NEW_EDITOR,
    REMOVE_EDITOR,
    ADD_SUB_EDITOR,
    receiveCommond,
    openNewEditor,
    removeEditor,
    addSubEditor
}

