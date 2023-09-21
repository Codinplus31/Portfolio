import React, { useEffect, useRef } from "react";

function Skills(){
  let skills = useRef();
  useEffect(()=>{

    const observer = new IntersectionObserver((entry)=>{
      console.log(entry)
  entry.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('skills-show')
      
    }else{
      e.target.classList.remove('skills-show')
    }
  })
})
const Skills = skills.current;
observer.observe(Skills);
},[])

    return(
        <div ref={skills} className="Skills">
                  <h1><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
</svg>   Skills    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
</svg></h1>
                  <div className="cat">
                    <h3>Frond-end</h3>
                    <div title="javascript"><img src='javascript.svg' width='50%' height='50%'/></div>
                    <div title="reactjs"><img src='react.svg' width='50%' height='50%'/></div>
                    <div title="Vuejs"><img src='vue.svg' width='50%' height='50%'/></div>
                    <div title="babylonjs"><img src='babylon.svg' width='70%' height='70%' /></div>
                    <div title="bootstrap"><img src='bootstrap.svg' width='50%' height='50%'/></div>
                    <div title="tailwind"><img src='tailwind.svg' width='50%' height='50%'/></div>
                    <div title="css"><img src='css.svg' width='50%' height='50%'/></div>
                    <div title="jQuery"><img src='jquery.svg' width='50%' height='50%'/></div>
                  </div>
                  <div className="cat">
                    <h3>Back-end</h3>
                    <div title="nodejs"><img src='node.svg' width='50%' height='50%'/></div>
                    <div title="expressjs"><img src='express.svg' width='50%' height='50%'/></div>
                    <div title="socket.io"><img src='socket.svg' width='50%' height='50%'/></div>
                    <div title="mysql"><img src='mysql.svg' width='60%' height='60%'/></div>
                    <div title="postgresql"><img src='postgresql.svg' width='50%' height='50%'/></div>
                
                  </div>
        </div>
    );
}
export default Skills;