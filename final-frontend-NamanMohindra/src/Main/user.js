import React,{useState} from "react";

import axios from "axios";
const baseURL = "https://final-backendd.herokuapp.com"
//const baseURL = "http://localhost:8080"
function User (props) {
    const [statusText,setStatusText]= useState(props.status)

  const updateStatus = ()=> {
    if(statusText !== '' && statusText !==undefined) {
      axios.put(`${baseURL}/headline`,{headline:`${statusText}`},{withCredentials: 'include'})
      props.setStatus(statusText);
      localStorage.setItem(`status:${localStorage.getItem('username')}`, statusText)
    }
  }
    return (
      <div className="card border-0">
        <div className="card-body ">
          <img src={props.img} alt={""} className={"w-100 p-2 image"}/>
          <p>{localStorage.getItem(`status:${localStorage.getItem('username')}`)?localStorage.getItem(`status:${localStorage.getItem('username')}`):props.status}</p>
          <div className="input-group mt-2">
          <div className="form-floating flex-grow-1">
            <input type="text" className="form-control rad" id={"statusInput"}
                   placeholder="Update status" onChange={(event) => setStatusText(event.target.value)} required/>
            <button className={"btn text-white mt-2 mb-2 rad"} id="statusUpdate"
                    style={{backgroundColor: '#254E58',width: '99%'}}
                    onClick={updateStatus.bind(this)}>Update</button>
          </div>
          </div>
        </div>
      </div>
    );
  }


export default User;
