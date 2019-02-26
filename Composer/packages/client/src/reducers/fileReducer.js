import { FETCH_FILES, RECEIVE_FILES, UPDATE_FILES, SET_CURRENT_FILE } from "../actions/fileAction";


const fileReducer = (state, action) => {
    switch(action.type) {
        case FETCH_FILES:
            return Object.assign({}, state, {
                isFetching: true,
            });
        case RECEIVE_FILES:
            return Object.assign({}, state, {
                isFetching: false,
                files: action.files
            })
        case UPDATE_FILES:
            return Object.assign({}, state, {
                files: action.files
            })
        case SET_CURRENT_FILE:
            return Object.assign({}, state, {
                openFileIndex: action.openFileIndex
            })
        default:
            return state;
    }
}

export {
    fileReducer
}