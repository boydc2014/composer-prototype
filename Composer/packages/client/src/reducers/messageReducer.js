import { RECEIVE_COMMOND } from "../actions/messageAction";

const messageReducer = (state, action) => {
    switch(action.type) {
        case RECEIVE_COMMOND:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}

export {
    messageReducer
}