import { RECEIVE_COMMOND, OPEN_NEW_EDITOR, REMOVE_EDITOR, ADD_SUB_EDITOR } from "../actions/messageAction";

const messageReducer = (state, action) => {
    switch(action.type) {
        case RECEIVE_COMMOND:
            return Object.assign({}, state, action.data);
        case OPEN_NEW_EDITOR:
            const editors = [];
            editors.push({
                col:1,
                row:1,
                editorName:"#1",
                parentEditor:"",
                data:action.data
            })
            return Object.assign({}, state, {editors, openEditorTimes:1});
        case REMOVE_EDITOR:
            return state;
        case ADD_SUB_EDITOR:
            const editor = {
                parentEditor:action.parentName,
                data:action.data
            };
            if(action.position === 'down') {
                editor['col'] = 1;
                editor['row'] = 2;
            } 

            if(action.position === 'right') {
                editor['col'] = 2;
                editor['row'] = 1;
            } 
            state.openEditorTimes += 1; 
            editor['editorName'] = "#"+state.openEditorTimes;
            state.editors.push(editor)
            return Object.assign({}, state);
        default:
            return state;
    }
}

export {
    messageReducer
}