const FETCH_FILES = "FETCH_FILES";
const RECEIVE_FILES = "RECEIVE_FILES";
const SET_CURRENT_FILE = "SET_CURRENT_FILE";
const UPDATE_FILES = "UPDATE_FILES";

const fetchFiles = () => ({
    type: FETCH_FILES
});

 const receiveFiles = (files) => ({
     type: RECEIVE_FILES,
     files
 })

 const updateFiles = (files) => ({
    type: UPDATE_FILES,
    files
 })

 const setCurrentFile = (openFileIndex) => ({
    type: SET_CURRENT_FILE,
    openFileIndex
 })

 export{
     FETCH_FILES,
     RECEIVE_FILES,
     SET_CURRENT_FILE,
     UPDATE_FILES,
     fetchFiles,
     receiveFiles,
     setCurrentFile,
     updateFiles
 }

