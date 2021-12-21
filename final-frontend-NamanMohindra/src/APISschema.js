
import axios from 'axios';

//const baseURL = "http://localhost:8080"
const baseURL = "https://final-backendd.herokuapp.com"
export async function RegisterService(accountName,password,email,zip, dob,phone,displayName){
    return axios.post(`${baseURL}/register`, { displayName:displayName, username: accountName, password:password,email:email,zipcode:zip, dob:dob,phone:phone },{withCredentials:'include'}).then((res)=>{            
                return res.status
            }).catch(err => {
                let k = err.toJSON()
                if (k.status === 409){
                    return k.status
                }
            })
}

export async function LoginService(username,password){
    return axios.post(`${baseURL}/login`, { username: username, password:password,},{withCredentials:'include'}).then((res)=>{ 
                return res
            }).catch(err => {
                let k = err.toJSON()
                if (k.status === 401 || k.status === 403 || k.status === 404){
                    return k
                } 
            })
}



export async function getMainData(props){
    return axios.get(`${baseURL}/profile`,{withCredentials: 'include'}).then(
        res => {
            console.log(res.data)
            props.setPlaceholderUsers(res.data)
            props.checkLocalStorage();
            props.setUserStatus(res.data);
            props.setFollowerInfo();

        axios.get(`${baseURL}/articles`,{withCredentials: 'include'}).then(res => {
            let newList = res.data.articles
            newList.sort( ( a, b ) =>  Date.parse(a.date) > Date.parse(b.date) ? -1 : 1)
            props.setPosts(newList);
        });
    }).catch(err => {
        if(err.status===401){
            props.history.push("/");
            localStorage.username = '';
        }
    })
}


export async function getFollowers(follow) {
    const req=axios.get(`${baseURL}/profile/${follow}`,{withCredentials: 'include'}).then(res=>{

        return res.data.profile})
    return req

}
