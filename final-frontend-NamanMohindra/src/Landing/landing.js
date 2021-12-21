import React from "react";
import { connect } from 'react-redux';
import Login from './Login'
import Register from './register';
import { Link,BrowserRouter as Router } from 'react-router-dom';
import {loginValidation, setPlaceholderUsers, registerValidation} from "../actions";
import { useEffect } from 'react';



function Landing(props) {
  
  useEffect(()=>{
  //   axios.get(`${baseURL}/profile`,{withCredentials: 'include'}).then(res => {
  //     props.setPlaceholderUsers(res.data);
  // });
    if (localStorage.getItem('username')){ //&& document.cookie) {
        props.history.push('/main');
    }
  }) 
  
    return (
      <div>
        <nav className="navbar sticky-top navbar-dark navbar-expand-sm py-3 mb-3" style={{backgroundColor: '#4f4a41'}}  >
          <Router>
            <Link to={"/main"} className="navbar-brand mx-2">InstaBook</Link>
          </Router>

        </nav>
        <div className={"container"}>
          <div className="row p-5">
            <div className="col-5 pt-5">
            <Login history={props.history}
                                   loginValidation={props.loginValidation}
                                   loginErrorMessage={props.loginErrorMessage}
                                   loginShowError={props.loginShowError} />
            </div>
            <div className="col pt-5">
            <Register history={props.history}
                                      registerValidation={props.registerValidation}
                                      registerErrorMessage={props.registerErrorMessage}
                                      registerShowError={props.registerShowError}/>
            </div>
          </div>
        </div>
      </div>
    );
  }


const mapStateToProps = (state) => {
  return {
      loginErrorMessage: state.loginErrorMessage,
      loginShowError: state.loginShowError,
      registerErrorMessage: state.registerErrorMessage,
      registerShowError: state.registerShowError,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
      loginValidation: (username, password, history) => dispatch(loginValidation(username, password, history)),
      registerValidation: (accountName, displayName, email, phone, dob, zip, password, confirmPassword, history) =>
          dispatch(registerValidation(accountName, displayName, email, phone, dob, zip, password, confirmPassword, history)),
      setPlaceholderUsers: (users) => dispatch(setPlaceholderUsers(users)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
