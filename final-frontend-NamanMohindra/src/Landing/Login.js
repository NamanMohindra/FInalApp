import React, {useState} from "react";
import { LoginService } from "../APISschema";

function Login (props){

    const [username , setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginErrorMessage,setLoginErrorMessage] = useState('')
    const [loginShowError,setLoginShowError]= useState(false)

    const loginValidation = async (e) =>{
        e.preventDefault();

            let x = await LoginService(username, password)
            if (x.status === 401){
                setLoginErrorMessage("User is not registered yet")
                setLoginShowError(true)
            }
            else if (x.status === 403){
                setLoginErrorMessage("Invalid Credentials")
                setLoginShowError(true)
            }
            else if (x.status=== 404){
                setLoginErrorMessage("something went wrong")
                setLoginShowError(true)
            }
            else if(x.status===400){
                setLoginErrorMessage(' Username and password fields should not be empty')
                setLoginShowError(true)
            }
            else {
                       
                localStorage.username = username;
                props.history.push('/Main')
            }
    }

        return (
            <div className={"border-0 "}>
                <div className={"col-lg-5 justify-content-center"}>
                    <h3>Login</h3>
                    {loginShowError &&
                    <div className="alert alert-warning" role="alert">{loginErrorMessage}</div>}
                    <form className={"login"}>
                        <div className="col-12 mb-4 pt-2">
                                <label htmlFor={'username'}>Username</label>
                                <input type="text" className="form-control" id="username"
                                       required   onChange={(event) => setUsername(event.target.value)}/>

                        </div>
                        <div className={"col-12 mb-4 "}>

                                <label>Password</label>
                                <input type="password" className="form-control" id="password"
                                       onChange={(event) => setPassword(event.target.value)}required/>
                        </div>
                        <div className="col-12 mb-2">
                            <button type="submit" className={"btn text-white mt-2 rad"} id="login"
                                    style={{backgroundColor: '#254E58', width: '99%'}} onClick={loginValidation.bind(this)}>Login</button>

                                    <a href="https://final-backendd.herokuapp.com/auth/google"> Login With Google</a>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

export default Login;