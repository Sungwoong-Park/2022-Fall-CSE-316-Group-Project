import React, { Link } from "react-router-dom";
import { useState } from "react";
import Axios from "axios";
import { hashutil } from "./hashutil.mjs";

import { useRecoilState, useRecoilValue } from "recoil";
import {
    DisplayImageAtom,
} from "../model/states";

export default function Register(props) {
    const [displayImage, setDisplayImage] = useRecoilState(DisplayImageAtom);
    
    const [profdata, setProfdata] = useState({
        user_id: "",
        password: "",
        user_name: "",
        user_email: "",
        address_f: "",
        address_l: "",
        img: "",
    });

    const { user_id, password, user_name, user_email, address_f, address_l, img} = profdata;

    const setTextid = (e) => {
        const { name, value } = e.target;

        setProfdata({
            ...profdata,
            [name]: value,
        });
    };

    const setImage = (e) => {
        //post image on db
         const img = e.target.files[0];

         const formData = new FormData();
         formData.append('file', img);

         const config = {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        };
 
         Axios.post("http://localhost:3305/img/", formData, config).then((res) => {
             //console.log('s3url', res.data.location);
 
             setProfdata({
                 ...profdata,
                 img: res.data.location
             });
 
         })
    }

    const isRegister = () => {
        switch(""){
            case user_id:
                alert("Put id!");
                break;
            case password:
                alert("Put Password!");
                break;
            case user_name:
                alert("Put name!");
                break;
            case user_email:
                alert("Put email!");
                break;
            case address_f:
                alert("Put first address!");
                break;
            case address_l:
                alert("Put last address!");
                break;
            default:
                let temp1 = 0;
                if (!/\S+@\S+\.\S+/.test(profdata.user_email)) {
                    alert("Your email is not in valid form!");
                    temp1 = 1;
                } if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(profdata.password)) {
                    alert("Your password is not in valid form!");
                    temp1 = 1;
                } else {
                let temp = 0;
                if (temp1 === 0) {
                    Axios.get('http://localhost:3305/api/diary/users').then((response) => {
                    for(var i in response.data){
                        if(response.data[i].user_id == user_id){
                            break;
                        }else if(i == response.data.length-1 && response.data[i].user_id != user_id){
                            temp = 1;
                        }
                    }
                    if(temp === 1){
                        alert("Success Register!");
                        Axios.post('http://localhost:3305/api/diary/users', {
                            user_id: profdata.user_id,
                            password: hashutil(user_id, user_email, password),
                            name: profdata.user_name,
                            email: profdata.user_email,
                            address1: profdata.address_f,
                            address2: profdata.address_l,
                            img: profdata.img
                        })
                        setDisplayImage(() => profdata.img);
                        document.location.href = 'http://localhost:3000';
                    }else if(temp === 0){
                        alert("Invalid Register!");
                    }
                })
                }
                }
        }
    };

    return(
        <div id="registerWrapper">
            <inner>
                <p>Register</p>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <div>
                                    <p>Set your ID : {" "}</p>
                                    <input name = "user_id"
                                    value = {user_id}
                                    type = "text" 
                                    onChange={setTextid} />
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Set your password : {" "}</p>
                                    <input name = "password"
                                    defaultValue = {password}
                                    type="password" 
                                    onChange = {setTextid} />
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Set your name : {" "}</p>
                                    <input name = "user_name"
                                    value = {user_name}
                                    type = "text" 
                                    onChange={setTextid} />
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Set your email : {" "}</p>
                                    <input name = "user_email"
                                    value = {user_email}
                                    type = "text" 
                                    onChange={setTextid} />
                                </div>
                            </li>
                            <li id="registerAddress">
                                <div>
                                    <p>Set your address : {" "}</p>
                                    <div>
                                        <input name = "address_f"
                                        value = {address_f}
                                        type="text" 
                                        onChange = {setTextid} />
                                    </div>
                                    <div>
                                        <input name = "address_l"
                                        value = {address_l}
                                        type="text" 
                                        onChange = {setTextid} />
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Set your profile image : {" "}</p>
                                    <input type = "file" onChange = {setImage} />
                                </div>
                            </li>
                        </ul>
                        <div id="registerButtonWrapper">
                            <button id="registerButton" onClick = {isRegister}>
                                Register
                            </button>
                        </div>
                    </nav>
                </div>
            </inner>
        </div>
    );
}