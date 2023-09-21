import React, {useRef, useContext, useState} from 'react';
import { myContext } from './app';

function Side(){
let sideElement = useRef();
let sidenav = useRef();
let mains = useContext(myContext);
let [html, sethtml] = useState([]);
let [status, setstatus] = useState(true);
    return (
<div ref={sidenav} className="slider-nav">
            <div className="navigate">
<button onClick={()=>{
let ul = sideElement.current;
let span = sideElement.current.querySelectorAll('li a span');
let a = sideElement.current.querySelectorAll('li a');
if(status === true){
    sidenav.current.style.width = '6%';
    mains.current.style.width = '94%';
    let arr = [];
    span.forEach((element, i) => {
        arr.push(element.innerHTML);
        sethtml(arr);
        //  console.log(arr,i,'kk',element.innerHTML)
        element.innerHTML = '';
 
});
a.forEach(element => {
    element.style.padding = "0 25%";
});
setstatus(false);
}else{
    sidenav.current.style.width = '10%';
    mains.current.style.width = '90%';
    a.forEach(element => {
        element.style.padding = "0 0";
    });
    span.forEach((element, i) => {
        element.innerHTML = html[i];
        
});
setstatus(true);
}
}}>
    <img src="svg/nav.svg" alt="icon" />
</button>
            </div>
            <ul ref={sideElement}>
                <li className="active"><a  href="#"><img className="header__account--profile__icon" src="svg/home.svg"  alt="icon"  /> <span>Home</span></a></li>
                <li><a href="#"><img className="header__account--profile__icon" src="svg/project.svg" alt="icon"/> <span>Projects</span></a></li>
                <li><a href="#"><img className="header__account--profile__icon" src="svg/profile.svg" alt="icon"/> <span>About</span></a></li>
                <li><a href="#"><img className="header__account--profile__icon" src="svg/ai.svg" alt="icon"  /> <span>AI</span></a></li>
                <li><a href="#"><img className="header__account--profile__icon" src="svg/contact.svg" alt="icon"/> <span>Contact</span></a></li>
            </ul>

        </div>

    );
}
export default Side;