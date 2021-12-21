import React,{useState,useEffect} from "react";
import axios from "axios";
import { AddComments,EditArticle,EditComment } from "../actions";
import {connect} from "react-redux";

//const baseURL = "http://localhost:8080"
const baseURL = "https://final-backendd.herokuapp.com"
function Post(props) {

    const [show, setShow] = useState(false)
    const [commentText,setCommentText]= useState('')
    let [buttonText,setButtonText] = useState('Show Comments')
    const [newText,setNewText] = useState('')
    const [newComment,setNewComment] = useState('')

    const setShow1= ()=> {
    if(show){
      setButtonText('Show Comments')
      setShow(!show)
    }
    else{
    setShow(!show)
    setButtonText('Hide Comments')
  }
    }
  

    const addComment =() =>{
      if (commentText!=='' && commentText!==undefined ){ 
        axios.put(`${baseURL}/articles/${props.postid}`,{text:`${commentText}`, commentId: -1}, {withCredentials: 'include'}).then(res=>{
          
          props.AddComments(props.postid,res.data.comments)
          
        })
      }
    }

    const editArticle = () =>{
        if(newText!== '' && newText!== undefined){
          axios.put(`${baseURL}/articles/${props.postid}`,{text:`${newText}`},{withCredentials: 'include'}).then(res=>{
            props.EditArticle(res.data.articles[0][0].articleId,res.data.articles[0][0].text)
          })
        }
    }

    const editComment = (index) =>{
      if(newComment!== '' && newComment!== undefined){
        console.log(index,newComment)
        axios.put(`${baseURL}/articles/${props.postid}`,{text:`${newComment}`,commentId:index},{withCredentials: 'include'}).then(res=>{
          
          
          props.EditComment(res.data.articleId,res.data.comments,index)
          })
        }
      }


    return (
      <div className="card border-secondary mb-1">
        <div className="card-body ">
          <h5 className="card-title d-inline-block">{props.username}</h5>
          

          {props.img && <img src={props.img} alt={""} className={"w-100p-2 image"}/>}
          <p className="card-text">{props.post}</p>
          <input type="text" className="form-control d-inline-block" onChange={(e)=>setNewText(e.target.value)} placeholder="New Text"/>
          <button className={"btn text-white mt-2 mb-2 rad"}
                  style={{backgroundColor: '#254E58', width: '99%'}} onClick={editArticle}>Edit</button>
          
          <input type="text" className="form-control d-inline-block"
                               onChange = {(event)=>setCommentText(event.target.value)} placeholder="Comment"/>
            
            <div className={"row pt-3"}> 
            <div className={"col"}>
              
            <button className={"text-white mt-2 mb-2 rad"} id="button1" style={{marginRight: "1%",backgroundColor: '#254E58',width:'100%'}} onClick={addComment}>Comment</button>

            </div>
            <div className={"col"}>
                       
            <button className={"text-white mt-2 mb-2 rad "} id="button2" onClick={()=>setShow1()} style={{marginRight: "1%",backgroundColor: '#254E58',width:'100%'}}>{buttonText}</button>
              
            </div>
            </div>
            {show?
            <div>
              <h6 className="card-title d-inline-block">Comments:</h6>
              <div id="com">
                {props.comments.map((follow,index)=>
                    <div className="card-text">
                      <li className={"pt-1 list-group-item"} key={follow}>
                       <div>{props.comments[index].username}</div>
                        {props.comments[index].comment}  <input type="text" className="form-control d-inline-block" onChange = {(event)=>setNewComment(event.target.value)}/>
                        <button className={"text-white mt-2 mb-2 rad "} id="button2" style={{marginRight: "1%",backgroundColor: '#254E58',display: 'inline-block'}} onClick={ () => {editComment(props.comments[index].commentId)}} >Edit Comment</button>
                      </li>
                    </div>
                    
                )
                }
              </div>

            </div>:<></>}
            <p className={"text-muted ms-3"} style={{textAlign: "right", marginRight: "1%"}}><small>{props.time}</small></p>
        </div>
        </div>
      
    );
  }
const mapDispatchToProps = (dispatch) => {
    return {
        AddComments:(articleId,comments) => dispatch(AddComments(articleId,comments)),
        EditArticle:(articleId,newText) => dispatch(EditArticle(articleId,newText)),
        EditComment:(articleId,comments,commentId) => dispatch(EditComment(articleId,comments,commentId))
      }
  };


export default connect(null,mapDispatchToProps)(Post);
