import React, {useState} from "react";
import { RegisterService } from "../APISschema";

function Register (props){
    const [accountName , setAccountName] = useState('')
    const [displayName , setDisplayName] = useState('')
    const [email , setEmail] = useState('')
    const [phone , setPhone] = useState('')
    const [dob , setDob] = useState('')
    const [zip , setZip] = useState('')
    const [password , setPassword] = useState('')
    const [confirmPassword , setConfirm] = useState('')
    const [registerErrorMessage,setRegisterErrorMessage] = useState([])
    const [registerShowError,setRegisterError] = useState(false) 


    const registerValidation = async (e) =>{
        e.preventDefault();
        let RegisterMessage=[]
        let RegisterFail=false
        setRegisterErrorMessage([])
        setRegisterError(false)
            if(! /^[a-zA-Z]{1}[a-z0-9]*$/i.test(accountName)){
                RegisterMessage.push('Account Name invalid. First word must be a letter ')
                RegisterFail =true;
            }
            if(! /^[a-zA-Z]{1}[a-z0-9]*$/i.test(displayName)){
                RegisterMessage.push('Display Name invalid. First word must be a letter ')
                RegisterFail =true;
            }
            if(email === "" || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                RegisterMessage.push('Invalid Email');
                RegisterFail =true
            }
            if(phone === "" || !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone)){
                RegisterMessage.push('Invalid Phone Number ')
                RegisterFail =true
            }
            if(zip === "" || !(/^\d{5}(?:[-\s]\d{4})?$/.test(zip))){
                RegisterMessage.push('Invalid Zipcode');
                RegisterFail =true
            }
            if(password === "" || confirmPassword === ""
                || password !== confirmPassword) {
                    RegisterMessage.push('Invalid password. Password must match Confirmation password ');
                    RegisterFail =true
            }
            if (RegisterFail===true){
                setRegisterError(RegisterFail)
                setRegisterErrorMessage(registerErrorMessage=>[RegisterMessage, ...registerErrorMessage])
                
                return registerErrorMessage
            }
            else {
            let x= await RegisterService(accountName,password,email,zip, dob,phone)
            if (x===409){
                RegisterMessage.push('User Already Exists')
                RegisterFail=true
                
                if (RegisterFail===true){
                    
                    setRegisterErrorMessage(registerErrorMessage=>[RegisterMessage, ...registerErrorMessage])
                    setRegisterError(RegisterFail)
                    return registerErrorMessage
                }
                
            }
            else{
                localStorage.username = accountName;
                props.history.push('/Main')
            }
        }
        
    }
    
    const clearRegistration= () => {
        setRegisterErrorMessage([])
        setRegisterError(false)
        setAccountName ('')
        setDisplayName('')
        setEmail('')
        setPhone('')
        setZip('')
        setPassword('')
        setConfirm('')
    }
        return (
            <div className="card border-0">
                <div className="card-body">
                    <h3 className="card-title">Register</h3>
                    {registerShowError && <div className="alert alert-warning" role="alert">
                        <ul className={"list-unstyled"}>
                            {registerErrorMessage[0].map((message, index) =>
                                <li key={index}><div>
                                    {message}
                                </div></li>)
                            }
                        </ul>
                    </div>}
                    <form className='login'>
                        <div className="row pt-lg-2">
                            <div className="col-lg-6">
                                <label htmlFor={'username'}>User Name</label>
                                    <input type="text" className={'form-control pb-2'} onChange={(event) => setAccountName(event.target.value)} placeholder="User Name" id={"username"}/>
                                <label>Email Address*</label>
                                    <input type="email" className={'form-control pb-2'} id={"email"} onChange={(event) => setEmail(event.target.value)} placeholder="Email Address"/>
                                <label>Phone Number</label>
                                    <input type="tel" id="tel"  className={'form-control pb-2'} onChange={(event) => setPhone( event.target.value)}  placeholder="Phone Number"/>
                                <label>Password</label>
                                    <input type="password" id="pwd" className={'form-control pb-2'} onChange={(event) => setPassword(event.target.value)} placeholder="Password"/>
                                <div className={'pt-2'}>
                                    <input type={"reset"} className={"btn text-white mt-2 rad"}
                                           style={{backgroundColor: '#254E58', width: '99%'}}
                                           onClick={clearRegistration.bind(this)} value={"Clear"}/>
                                </div>
                            </div>
                            <div className="col">
                                <label>Display Name</label>
                                 <input type="text" id="dname" className={'form-control pb-2'} onChange={(event) => setDisplayName(event.target.value)} placeholder="Display Name"/>
                                <label>Date of Birth</label>
                                    <input type="date" id="dob" className={'form-control pb-2'} onChange={(event) => setDob(event.target.value)} placeholder="DOB"/>
                                <label>Zip Code</label>
                                    <input type="text" id={"zip"} className={'form-control pb-2'} onChange={(event) => setZip(event.target.value)} placeholder="Zip Code" maxLength={5}/>

                                <label>Confirm Password</label>
                                     <input type="password" id={"pwd2"} className={'form-control pb-2'} onChange={(event) => setConfirm(event.target.value)} placeholder="Confirm Password"/>
                                <div className={'pt-2'}>
                                    <button className={"btn text-white mt-2 rad"} id="submit" style={{backgroundColor: '#254E58', width: '99%'}}
                                            onClick={registerValidation.bind(this)}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
export default Register;