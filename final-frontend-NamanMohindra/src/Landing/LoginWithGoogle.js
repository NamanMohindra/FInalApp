import react from 'react';

import axios from "axios";
import { useParams } from "react-router-dom";
//const baseURL = "http://localhost:8080"

const baseURL = "https://final-backendd.herokuapp.com"
function LoginWithGoogle(props){
    const { id } = useParams();
    console.log(id);

    axios.post(`${baseURL}/auth/google/login`,{id:id},{withCredentials:'include'}).then((res)=>{
        console.log(res)
        localStorage.setItem('username',res.data.username);
        props.history.push('/Main')
    })
return(
    null
)



}

export default LoginWithGoogle;