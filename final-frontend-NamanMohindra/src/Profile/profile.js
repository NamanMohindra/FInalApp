import React, {useEffect,useState} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {setPlaceholderUsers, checkLocalStorage, logout} from "../actions";
import axios from "axios"

const baseURL = "https://final-backendd.herokuapp.com"
//const baseURL = "http://localhost:8080"

function Profile (props) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [zip, setZip] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirm] = useState('')

    const [profileError, setprofileError] = useState(false)
    const [profileSuccess, setprofileSuccess] = useState(false)
    const [profileErrorMessage, setprofileErrorMessage] = useState([])
    const [profileSuccessMessage, setprofileSuccessMessage] = useState([])
    const fd = new FormData()

     useEffect(() =>{
      function getProfileData(props){
    if (localStorage.username) {
          axios.get(`${baseURL}/profile`,{withCredentials: 'include'}).then(res =>{
            props.setPlaceholderUsers(res.data);
            props.checkLocalStorage()

          }).catch(err=>{
            if (err.status===401){}
          })
        }
        else {props.history.push("/");
        localStorage.username = '';
      }
      }
      getProfileData(props)
  },[profileError,profileSuccess,profileErrorMessage,profileSuccessMessage,props.profileImg])
   


const updateInfo= async (e)=> {
  e.preventDefault();

  let ErrorSuccess = []
  let ErrorFail = []
  let success=false
  let fail = false 
  setprofileError(fail)
  setprofileSuccess(success)
  setprofileErrorMessage(profileErrorMessage =>[])
  
  setprofileSuccessMessage(profileSuccessMessage =>[])
  if(email !== "" && email !== props.profileEmail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      
      ErrorSuccess.push('Email updated from ' + props.profileEmail + ' to ' + email)
      axios.put(`${baseURL}/email`,{email},{withCredentials: 'include'}).then(res=>{
        if (res.status===200){
      props.setPlaceholderUsers(res.data.doc);
      props.checkLocalStorage()
      
        } 
      })
    }
    else {
      ErrorFail.push('Invalid Email input')
    
  };
}

 if(phone !== "" && phone!== props.profilePhone){
   if (/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)){
    
    ErrorSuccess.push('Phone updated from ' + props.profilePhone + ' to ' + phone)
    axios.put(`${baseURL}/phone`,{phone},{withCredentials: 'include'}).then(res=>{
      if (res.status===200){
          props.setPlaceholderUsers(res.data.doc);
          props.checkLocalStorage()
          
      }
    })
   }
  else {
    ErrorFail.push('Invalid Phone input')
    };
 }
   if(zip !== "" && zip !== props.profileZip){
  if (/^\d{5}(?:[-\s]\d{4})?$/.test(zip)){
    
    ErrorSuccess.push('Zipcode updated from ' + props.profileZip + ' to ' + zip)
    axios.put(`${baseURL}/zipcode`,{zip},{withCredentials: 'include'}).then(res=>{
        if (res.status===200){
            props.setPlaceholderUsers(res.data.doc);
            props.checkLocalStorage()
        }
      })
    }
   else{
    ErrorFail.push('Invalid zipcode input')
  } 
 }

 if(password!=="" && password!==props.password){
   if(password===confirmPassword){
     console.log(password,confirmPassword)
  ErrorSuccess.push('Password updated')
  axios.put(`${baseURL}/password`,{password},{withCredentials: 'include'}).then(res=>{
    //console.log(res)
  })
}
 }


if(ErrorSuccess.length !== 0){
    setprofileSuccessMessage([ErrorSuccess,...profileSuccessMessage]);
    success=true
    setprofileSuccess(success)
}
if(ErrorFail.length !== 0){
  setprofileErrorMessage(profileErrorMessage=>[ErrorFail,...profileErrorMessage]);
  fail = true
    setprofileError(fail);
    
}
if (profileError===true){
  return profileErrorMessage;
}

}

const logout = () =>{
  props.logout()
  axios.put(`${baseURL}/logout`,{withCredentials: 'include'}).then(res=>{
    return res.status
  })
}

const clearUpdate= ()=>{
        setprofileErrorMessage([])
        setprofileError(false)
        setName ('')
        setEmail('')
        setPhone('')
        setZip('')
        setPassword('')
        setConfirm('')
}

const handleImageChange =(e)=>{
  fd.append('image',e.target.files[0])
}

const handleImage = ()=>{
  if(fd.has('image')){
  axios.put(`${baseURL}/avatar`,fd,{withCredentials: 'include'}).then(res=>{
    if(res.status===200){
    props.setPlaceholderUsers(res.data);
    props.checkLocalStorage()
    }
  })
}
}
    return (
      <div>
        <nav className="navbar sticky-top navbar-dark navbar-expand-sm py-2 mb-2" style={{backgroundColor: '#4f4a41'}}>
          <Link to={"/main"} className="navbar-brand mx-2">InstaBook</Link>

          <div className="navbar-collapse justify-content-end">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/main"} className="nav-link">Main Page</Link>
              </li>
              <li className="nav-item">
                <Link to={"/"} id="logout" className="nav-link" onClick={() => logout()}>Logout</Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className={"container"}>
          <div className={"row pt-5"}>
            <div className={"col-5"}>
              <div className="card border-0">
                <div className="card-body">
                <img src={props.profileImg} className={"w-100"} alt={''}/>
                  <div className={"pt-2"}>
                  <input type="file" className="form-control" onChange={(e)=>handleImageChange(e)}/>
                    <button type="submit" onClick = {handleImage} className={"btn rad text-white mt-2"} style={{backgroundColor: '#254E58', width: '99%'}}>Upload new picture</button>
                  </div>
                </div>
              </div>
            </div>
            <div className={"col-6"}>
              {profileError && <div className="alert alert-warning " role="alert">
                <ul className={"list-group list-group-flush list-unstyled"}>
                {profileErrorMessage[0].map((message, index) =>
                                        <li key={index}><div>
                                            {message}
                                        </div></li>)
                                    }
                </ul>
              </div>}
              {profileSuccess && <div className="alert alert-success" role="alert">
                                <ul className={"list-unstyled"}>
                                    {profileSuccessMessage[0].map((message, index) =>
                                        <li key={index}><div>
                                            {message}
                                        </div></li>)
                                    }
                                </ul>
                            </div>}
              <div className="card border-0">
                <div className={"row"}>
                <div className="card-body">
                  <div className="card-title display-4">Update Information</div>
                  <form>

                    <div className={"pt-3"}>
                      <input type="email" className="form-control" id="updatedEmail"
                             placeholder="Email" onChange={(event) => setEmail(event.target.value)}/>
                    </div>
                    <div className={"pt-3"}>
                      <input type="tel" className="form-control" id="updatedPhone"
                             maxLength={12}
                             placeholder="Phone" onChange={(event) => setPhone(event.target.value)}/>
                    </div>
                    <div className={"pt-3"}>
                      <input type="number" pattern="[0-9]{5}" className="form-control" id="updatedZip"

                             placeholder="Zip" onChange={(event) => setZip(event.target.value)}/>
                    </div>
                    <div className={"pt-3"}>
                      <input type="password" className="form-control" id="updatedPwd"
                             placeholder="Password" onChange={(event) => setPassword(event.target.value)}/>
                    </div>
                    <div className={"pt-3"}>
                      <input type="password" className="form-control" id="updatedPwd2"
                             placeholder="Confirm Password" onChange={(event) => setConfirm(event.target.value)}/>
                    </div>
                    <div className={"row pt-3"}>
                      <div className={"col"}>
                        <input type={"reset"} className={"btn text-white mt-2 rad"} id="clear"
                               style={{backgroundColor: '#254E58', width: '99%'}}
                               onClick={clearUpdate.bind(this)} value={"Clear"}/>
                      </div>
                      <div className={"col"}>
                        <button className={"btn text-white mt-2 rad"} id="update"
                                style={{backgroundColor: '#254E58', width: '99%'}}
                                onClick={updateInfo.bind(this)}>Update</button>
                      </div>
                    </div>
                  </form>


                  <div className="card-body" id="info">

                    <div className="card-title display-4" >Current Information</div>
                    <label htmlFor="username" id="hi">Username:
                    <span className="card-text" id="username">{props.profileName}</span>
                    </label>
                    <div className={"row"}>
                      <span className="card-text">Email: {props.profileEmail}</span>
                    </div>
                    <div className={"row"}>
                    <span className="card-text">Phone: {props.profilePhone}</span>
                      </div>
                    <div className={"row"}>
                    <span className="card-text">Zip: {props.profileZip}</span>
                    </div>
                    <div className={"row"}>
                    <span className="card-text">Password : {props.profilePassword.replace(/./g, '*')}</span>
                    </div>
                  </div>

              </div>
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
      profileImg: state.profileImg,
      profileName: state.profileName,
      profileEmail: state.profileEmail,
      profilePhone: state.profilePhone,
      profileZip: state.profileZip,
      profilePassword: state.profilePassword,
      profileError: state.profileError,
      profileSuccess: state.profileSuccess,
      profileErrorMessage: state.profileErrorMessage,
      profileSuccessMessage: state.profileSuccessMessage,
  } 
};

const mapDispatchToProps = (dispatch) => {
  return {
      setPlaceholderUsers: (users) => dispatch(setPlaceholderUsers(users)),
      checkLocalStorage: () => dispatch(checkLocalStorage()),
      logout: () => dispatch(logout()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
