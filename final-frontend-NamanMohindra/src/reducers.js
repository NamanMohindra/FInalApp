import {SET_FOLLOWER_INFO, 
    SET_PLACEHOLDER_USERS, CHECK_LOCAL_STORAGE, UPDATE_USER_STATUS,
    SET_POSTS, SEARCH_POSTS, ADD_POST, LOGOUT, SET_USER_STATUS, 
    ADD_COMMENTS,EDIT_ARTICLE,EDIT_COMMENT } from "./actions";

import { getFollowers} from "./APISschema";

const userInfo= {};

    const initialState = {
        username: '',
        userStatus: '',
        posts: [],
        allPosts: [],
        following: [],
        followingImgs: [],
        followingStatus: [],
        followingNames: [],
        followingUserNames: [],
        placeholderUsers: [],
        profileImg: '',
        profileName: '',
        profileEmail: '',
        profilePhone: '',
        profileZip: '',
        profilePassword: '',
        comments: []
    };

function convertFromStringToDate(responseDate) {
        let dateComponents = responseDate.split('T');
        let datePieces = dateComponents[0].split("-");
        let timePieces = dateComponents[1].split(":");
        
        return(new Date(datePieces[0], (datePieces[1] - 1), datePieces[2],
                             timePieces[0], timePieces[1]))
    }

export function Instabook( state = initialState, action) {
    switch (action.type) {
        case CHECK_LOCAL_STORAGE:
            if (localStorage.username) {
                if (localStorage.username) {
                    
                    let username = localStorage.username;
                    let profileImg = userInfo[username].img;

                    let profileName = userInfo[username].username;
                    let profileEmail = userInfo[username].email;
                    let profilePhone = userInfo[username].phone;
                    let profileZip = userInfo[username].zipcode;
                    let profilePassword = userInfo[username].username;
                    
                        return {...state, username, profileName, profileEmail, profilePhone, profileZip, profilePassword, profileImg};
                    }

                else return initialState;
            }
            return state;

        case SET_PLACEHOLDER_USERS:
            userInfo[action.users.username]={}
            userInfo[action.users.username].name = action.users.username
            userInfo[action.users.username].username = action.users.username
            userInfo[action.users.username].status = action.users.headline
            userInfo[action.users.username].following = action.users.following
            userInfo[action.users.username].img = action.users.avatar
            userInfo[action.users.username].zipcode = action.users.zipcode
            userInfo[action.users.username].phone = action.users.phone
            userInfo[action.users.username].email = action.users.email
            userInfo[action.users.username].displayName = action.users.displayName
            
            state.placeholderUsers.push(action.users)
            return {...state, placeholderUsers: state.placeholderUsers};
    


        case SET_FOLLOWER_INFO:
            var following = userInfo[state.username].following;
            var followingImgs = [];
            var followingStatus = [];
            var followingNames = [];
            var followingUserNames = [];
            if (following.length !==0){
            following.forEach(async(follow) => {
                
                await getFollowers(follow).then(res=>{
                    
                    followingImgs.push(res.avatar);
                    followingStatus.push(res.headline);
                    followingNames.push(res.username);
                    followingUserNames.push(res.username);    
                            }
                )
                
            } ) }else{
                return {...state, following, followingImgs,
                    followingStatus, followingNames,
                    followingUserNames};
            }
            return {...state, following, followingImgs,
                followingStatus, followingNames,
                followingUserNames};
        case SET_POSTS:
            let posts = [];
            let allPosts = [];
            action.posts.forEach(post => {
                let postTime = post.date
                let comments1 = []

                post.comments.forEach(comment =>comments1.push(comment))
                let x = convertFromStringToDate(postTime)
                let time = x.toLocaleString()
                
                allPosts.push({'text': post.text, 'username': post.author, 'articleId': post.articleId, 'comments': comments1,
                    'showPost': true, 'postTime': time, 'postImg': post.img, 'timeObj': time});
            });
            
            allPosts.forEach(post => {
                if (post.username === state.username || state.following.includes(post.username)){
                    posts.push(post);
                }
            })
            
            return {...state, posts, allPosts};
        case SEARCH_POSTS:
            let postsToSearch = state.posts.slice();
            postsToSearch.forEach(post => {
                if (post.text.toLocaleLowerCase().search(action.keyword.toLocaleLowerCase())>-1 ||
                    post.username.toLocaleLowerCase().search(action.keyword.toLocaleLowerCase())>-1){
                    post.showPost = true;
                }
                else post.showPost = false;
            })
            return {...state, posts: postsToSearch};
        
        case ADD_POST:
            if(action.postText !== ''){
                
                let x= convertFromStringToDate(action.postTime)
                let time = x.toLocaleString()
                let newPost = {'text': action.postText, 'username': state.username,'articleId': action.articleId,
                    'showPost': true, 'postTime': time, 'postImg': action.postImage || '', 'timeObj': time, 'comments': []};
                return {...state, posts: [newPost, ...state.posts], allPosts: [newPost, ...state.allPosts]};
            }
            else return state;

        case ADD_COMMENTS: 
            
            let objIndex = state.posts.findIndex((o=>o.articleId === action.articleId));
            state.posts[objIndex].comments=action.comments
            return {...state,posts:[...state.posts]};

        case EDIT_ARTICLE:
            let objIndex1 = state.posts.findIndex((o=>o.articleId === action.articleId));
            state.posts[objIndex1].text=action.newText
            return {...state,posts:[...state.posts]};
        
        case EDIT_COMMENT:
            let objIndex3 = state.posts.findIndex((o=>o.articleId === action.articleId));
            state.posts[objIndex3].comments=action.comments
    
            return {...state,posts:[...state.posts]};

        case LOGOUT:
            localStorage.username = '';
            localStorage.userStatus = '';
            return initialState;
        case SET_USER_STATUS:

                let userStatus;
                if (localStorage.userStatus && localStorage.userStatus!=='') userStatus = localStorage.userStatus;
                else userStatus = userInfo[state.username].status;
                return {...state, userStatus}; 
                  
        case UPDATE_USER_STATUS:
                            if (action.userStatus !== ""){
                                localStorage.userStatus = action.userStatus;
                                return {...state, userStatus: action.userStatus};
                            }
                            else return state;
        default:
            return state;
    }
}
