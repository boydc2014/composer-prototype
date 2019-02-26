const RECEIVE_COMMOND = "RECEIVE_COMMOND";

const receiveCommond = (commond, data) => ({
    type: RECEIVE_COMMOND,
    commond,
    data
});

export{
    RECEIVE_COMMOND,
    receiveCommond
 }

