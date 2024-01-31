import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import { useRef } from "react"
import {
    DisplayImageAtom,
} from "../model/states";




export default function Topnav({selected}) {
    const [displayImage, setDisplayImage] = useRecoilState(DisplayImageAtom);
    const imageKeyRef = useRef("imageKeyRef");

    return(
        <div>
            <div id="navWrapper">
                <p id="navTitle">Day Logger</p>
                <div id="linksWrapper">
                    <Link to="/log" id={selected === 'log' ? "selected" : ""}>Log Day</Link>
                    <Link to="/edit" id={selected === 'edit' ? "selected" : ""}>Edit Questions</Link>
                    <Link to="/view" id={selected === 'view' ? "selected" : ""}>View Data</Link>
                </div>
                <Link id="navProfile" to="/profile"><img key={imageKeyRef} src={displayImage} alt="profile"/></Link>
            </div>
        </div>
    );
};