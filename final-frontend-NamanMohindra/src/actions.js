
export const SET_FOLLOWER_INFO = "SET_FOLLOWER_INFO";

export const LOGIN_VALIDATION = "LOGIN_VALIDATION";
export const REGISTER_VALIDATION = "REGISTER_VALIDATION";
export const SET_PLACEHOLDER_USERS = "SET_PLACEHOLDER_USERS";
export const CHECK_LOCAL_STORAGE = "CHECK_LOCAL_STORAGE";
export const UPDATE_USER_STATUS = "UPDATE_USER_STATUS";
export const SET_POSTS = "SET_POSTS";
export const SEARCH_POSTS = "SEARCH_POSTS";
export const ADD_POST = "ADD_POST";
export const LOGOUT = "LOGOUT";
export const SET_USER_STATUS = "SET_USER_STATUS";
export const ADD_COMMENTS = 'ADD_COMMENTS'
export const EDIT_ARTICLE = 'EDIT_ARTICLE'
export const EDIT_COMMENT= 'EDIT_COMMENT'


export function checkLocalStorage() {
    return {type: CHECK_LOCAL_STORAGE}
}


export function setFollowerInfo(following, fImg, fStatus, fNames, fUserNames) {
    return {type: SET_FOLLOWER_INFO, following, fImg, fStatus, fNames, fUserNames}
}
export function loginValidation(username, password, history) {
    return {type: LOGIN_VALIDATION, username, password, history}
}

export function registerValidation(accountName, displayName, email, phone, dob,
                                   zip, password, confirmPassword, history) {
    return {type: REGISTER_VALIDATION, accountName, displayName, email, phone, dob,
        zip, password, confirmPassword, history}
}

export function setPlaceholderUsers(users) {
    return {type: SET_PLACEHOLDER_USERS, users}
}


export function setPosts(posts) {
    return {type: SET_POSTS, posts}
}

export function updateUserStatus(userStatus) {
    return {type: UPDATE_USER_STATUS, userStatus}
}

export function searchPosts(keyword) {
    return {type: SEARCH_POSTS, keyword}
}

export function addPost(postText,postImage,articleId,postTime) {
    return {type: ADD_POST, postText,postImage,articleId,postTime}
}

export function logout(){
    return {type: LOGOUT}
}

export function setUserStatus(){
    return {type: SET_USER_STATUS}
}

export function AddComments(articleId,comments){
    return {type: ADD_COMMENTS,articleId,comments}   
}

export function EditArticle(articleId,newText){
    return {type: EDIT_ARTICLE,articleId,newText}
}

export function EditComment(articleId,comments,commentId){
    return {type: EDIT_COMMENT,articleId,comments,commentId}
}

