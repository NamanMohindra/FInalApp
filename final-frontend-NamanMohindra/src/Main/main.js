import React,{useEffect,useState} from "react";
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import Following from "./following";
import Post from "./post";
import User from "./user";
import axios from 'axios'
import {getMainData} from "../APISschema";

import {
  checkLocalStorage,
  setFollowerInfo,
  setPlaceholderUsers,
  updateUserStatus,
  setPosts,
  searchPosts,
  addPost,
  logout,
  setUserStatus,
} from "../actions";

const baseURL = "https://final-backendd.herokuapp.com"
// const baseURL = "http://localhost:8080"
function Main (props) {
    const [addFollowingText, setAddFollowingText]= useState('')
    const [addnewPostText, setnewPostText]= useState('')
    const [follow,addFollow1] = useState([])
    const [showAddFollowError,setAddFollowError]=useState(false)
    const [AddFollowErrorMessage, setAddFollowErrorMessage]=useState('')
    const fd = new FormData()

    
    const addFollow = (follow)=>{
      if(follow!==""){
        if(follow === props.username){
        setAddFollowErrorMessage('Cannot Follow Yourself')
        setAddFollowError(true);
        }
        else if(props.followingUserNames.includes(follow)){
        setAddFollowErrorMessage('Already Following User')
        setAddFollowError(true)
      }
      else{
      axios.put(`${baseURL}/following/${follow}`,null,{withCredentials:'include'}).then(res=>{
        let followers = res.data.following
        addFollow1([...followers])
        return follow
      }).catch(err=>{
        setAddFollowErrorMessage('User does not exist')
        setAddFollowError(true);
      })
      setAddFollowError(false);
      setAddFollowErrorMessage('')
      setFollowerInfo()
    }
  }
}
    const deleteFollow = (follow)=>{
      axios.delete(`${baseURL}/following/${follow}`,{withCredentials:'include'}).then(res=>{
        let followers = res.data.following
        addFollow1([...followers])
        return follow
      })
      setFollowerInfo()
    }

  useEffect(()=>{
    function getData(){
     if (localStorage.username){
        getMainData(props)
   }
   else {
     props.history.push("/");
     localStorage.username = '';
    }
} 
  getData()  
  },[follow.length])

const handleImageChange=(e)=>{
  fd.append('image',e.target.files[0])  
}

const addPost= (e) =>{
  e.preventDefault();
  if (addnewPostText!==''){

      fd.append('text',addnewPostText)
      axios.post(`${baseURL}/article`,fd,{withCredentials: 'include'}).then(res=>{
      props.addPost(addnewPostText,res.data.articles[0].img,res.data.articles[0].articleId,res.data.articles[0].date);
  }).catch(err=>{
    if(err.status){
     props.history.push("/");
     localStorage.username = '';
    }
  })
  document.getElementById("newPostText").value = '';
  setnewPostText('');
  }
}

const logout = () =>{
    props.logout()
    axios.put(`${baseURL}/logout`,{withCredentials: 'include'}).then(res=>{
    return res.status
  })
}
    return (
      <div>
        <nav className="navbar sticky-top navbar-dark navbar-expand-sm py-2 mb-2" style={{backgroundColor: '#4f4a41'}}>

          <Link to={"/main"} className="navbar-brand mx-2"> InstaBook </Link>

            <div className="navbar-collapse justify-content-end" >
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link" href="#">Profile</Link>
                </li>
              <li className="nav-item">
                <Link to={"/"} className="nav-link" id="logout" onClick={() => logout()}>Logout</Link>
                </li>
            </ul>
          </div>
        </nav>
        
        <div className={"container-fluid pt-1"}>
          <div className={"row"}>
            <div className={"col-3 p-1"}>
              <h2 style={{fontSize:"40px"}}>Following</h2>
              <input type="text" className="form-control" id="followText" placeholder="Username"
                                   onChange={(event) => setAddFollowingText(event.target.value)}/>
             {showAddFollowError &&
                            <div className="alert alert-danger" role="alert">{AddFollowErrorMessage}</div>}
              <button type="submit" className="btn btn-warning form-control mt-1 rad" style={{backgroundColor: '#254E58', width: '99%'}}
                                    onClick={() => addFollow(addFollowingText)}>Follow</button>
              <ul className={"list-group list-group-flush border-0"}>
                {props.following.map((follow, i) =>
                  <li className={"pt-1 border-0"} key={i}>
                    <div>
                      <Following
                           username={props.followingUserNames[i]}
                           status={props.followingStatus[i]}
                           img={props.followingImgs[i]}
                           deleteFollow ={deleteFollow}
                    />
                  </div></li>)
                }
              </ul>
            </div>
            <div className={"col-6"}>
              <h3 style={{fontSize:"40px"}}>Posts</h3>
              <div className="input-group pb-1">
                <input type="text" className="form-control d-inline-block rad " id="searchtext"
                       placeholder={"Search for posts"} onChange={(event) => props.searchPosts(event.target.value)}/>

              </div>
              <ul className={"list-group list-group-flush border-0 pt-1 images"} id="posts">
              {props.posts.map((post, index) =>
                                        post.showPost && <div key={index}><Post
                                            img={post.postImg}
                                            username={post.username}
                                            post={post.text}
                                            comments={post.comments}
                                            time ={post.postTime}
                                            postid = {post.articleId}
    
                                            />
                                        </div>)
                                    }
              </ul>
            </div>
            <div className={"col-3"}>
              <h2 style={{fontSize:"40px"}}>{props.username}</h2>
              <User img={props.profileImg}
                                  username={props.username}
                                  status={props.userStatus} setStatus={props.updateUserStatus}/>
              <div className="card border-0">
                <div className="card-body">
                  <h5 className="card-title">{"Create Post"}</h5>
                  <form>
                    <textarea className="form-control rad" id={"newPostText"} onChange={(event) => setnewPostText(event.target.value)}/>
                    <div className="pt-1">
                      <input type="file" className="form-control" onChange={(e)=>handleImageChange(e)}/>
                    </div>
                    <div className={"row pt-1"}>
                      <div className={"col"}>
                        <button className={"btn text-white mb-2 rad"} style={{backgroundColor: '#254E58', width: '99%'}} onClick={addPost.bind(this)}>Post</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


const mapStateToProps = (state) => {
  return {
      username: state.username,
      posts: state.posts,
      userStatus: state.userStatus,
      following: state.following,
      followingImgs: state.followingImgs,
      followingStatus: state.followingStatus,
      followingNames: state.followingNames,
      followingUserNames: state.followingUserNames,
      profileImg: state.profileImg,
      showAddFollowError: state.showAddFollowError,
      AddFollowErrorMessage: state.AddFollowErrorMessage,
      comments:state.comments
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
      setFollowerInfo: () => dispatch(setFollowerInfo()),
      updateUserStatus: (userStatus) => dispatch(updateUserStatus(userStatus)),
      setPlaceholderUsers: (users) => dispatch(setPlaceholderUsers(users)),
      checkLocalStorage: () => dispatch(checkLocalStorage()),
      setPosts: (posts) => dispatch(setPosts(posts)),
      searchPosts: (keyword) => dispatch(searchPosts(keyword)),
      addPost: (postText,postImage,articleId,postTime) => dispatch(addPost(postText,postImage,articleId,postTime)),
      logout: () => dispatch(logout()),
      setUserStatus: () => dispatch(setUserStatus())
  }
};






export default connect(mapStateToProps, mapDispatchToProps)(Main);
