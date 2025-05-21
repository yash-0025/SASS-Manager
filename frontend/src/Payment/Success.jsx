import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api/axios";

function success()  {
    const navigate = useNavigate()
    useEffect(() => {
        setTimeout(10000)
        const token = sessionStorage.getItem('access-token')
        api.post('/api/cartempty', {}, {headers: {
            "Authorization": token
        }}).then(res=>{
            navigate('/')
        }).catch(error=>{
            navigate('/cart')
        })
    },[])
    return(
        <h1>Success</h1>
    )
}

export default Success