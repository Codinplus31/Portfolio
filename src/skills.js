import React, { useEffect, useRef } from "react";

function Skills(){
  let skills = useRef();
  let frontEnd = useRef();
  let backEnd = useRef();
  useEffect(()=>{
    function ScrollTran(elem, classes){

      const observer = new IntersectionObserver((entry)=>{
      
  entry.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add(classes)
      
    }else{
      e.target.classList.remove(classes)
    }
  })
})
const Skills = elem;
observer.observe(Skills);
}
ScrollTran(skills.current, 'skills-show')
ScrollTran(frontEnd.current, 'frontend')
ScrollTran(backEnd.current, 'backend')
},[])

    return(
        <div ref={skills} id="skills" className="Skills">
                  <h1><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
</svg>   Skills    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
</svg></h1>
                  <div className="cat" ref={frontEnd}>
                    <h3>Front-end</h3>
                    <div title="javascript"><img src='javascript.svg' alt="JavaScript" width='50%' height='50%'/></div>
                    <div title="reactjs"><img src='react.svg' alt="React" width='50%' height='50%'/></div>
                    <div title="Vuejs"><img src='vue.svg' alt="Vue.js" width='50%' height='50%'/></div>
                    <div title="babylonjs"><img src='babylon.svg' alt="Babylon.js" width='70%' height='70%' /></div>
                    <div title="bootstrap"><img src='bootstrap.svg' alt="Bootstrap" width='50%' height='50%'/></div>
                    <div title="tailwind"><img src='tailwind.svg' alt="Tailwind CSS" width='50%' height='50%'/></div>
                    <div title="css"><img src='css.svg' alt="CSS" width='50%' height='50%'/></div>
                    <div title="jQuery"><img src='jquery.svg' alt="jQuery" width='50%' height='50%'/></div>
                  </div>
                  <div className="cat" ref={backEnd}>
                    <h3>Back-end</h3>
                    <div title="nodejs"><img src='node.svg' alt="Node.js" width='50%' height='50%'/></div>
                    <div title="expressjs" className="express-icon-wrapper"><img src='express.svg' alt="Express.js" width='50%' height='50%'/></div>
                    <div title="socket.io"><img src='socket.svg' alt="Socket.io" width='50%' height='50%'/></div>
                    <div title="mysql"><img src='mysql.svg' alt="MySQL" width='60%' height='60%'/></div>
                    <div title="postgresql"><img src='postgresql.svg' alt="PostgreSQL" width='50%' height='50%'/></div>
                    <div title="php"><img src='php.svg' alt="PHP" width='50%' height='50%'/></div>
                    <div title="mongodb">
                      <svg width="50%" height="50%" viewBox="0 0 256 549" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                        <path d="M175.622 61.108C152.612 33.807 132.797 6.078 128.749.32a1.03 1.03 0 0 0-1.492 0c-4.048 5.759-23.863 33.487-46.874 60.788-197.507 251.896 31.108 421.89 31.108 421.89l1.917 1.28c1.172 26.098 5.653 67.23 5.653 67.23h18.266s4.48-41.132 5.653-67.23l1.917-1.28s228.615-169.994 31.724-421.89" fill="#00ED64"/>
                        <path d="M139.425 410.326s-4.478-6.18-8.957-7.677v105.637s7.786-8.314 10.34-13.457c2.554-5.142 2.554-79.86-1.383-84.503" fill="#00A550"/>
                        <path d="M120.526 402.649c-4.478 1.497-8.957 7.677-8.957 7.677-3.937 4.643-3.937 79.361-1.383 84.503 2.554 5.143 10.34 13.457 10.34 13.457V402.649" fill="#006D3A"/>
                      </svg>
                    </div>
                    <div title="laravel">
                      <svg width="50%" height="50%" viewBox="0 0 256 264" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                        <path d="M255.856 59.62c.095.351.144.713.144 1.077v56.568c0 1.478-.79 2.843-2.073 3.578L206.45 148.18v54.18c0 1.478-.79 2.843-2.073 3.578l-95.958 55.398c-.204.118-.42.21-.644.282a3.015 3.015 0 0 1-.644.15c-.11.018-.222.028-.334.028a4.155 4.155 0 0 1-.978-.178c-.224-.072-.44-.164-.644-.282L10.22 205.938c-1.283-.735-2.073-2.1-2.073-3.578V35.296c0-.364.05-.726.145-1.077.028-.123.072-.24.117-.355.06-.154.13-.3.207-.444.063-.12.133-.236.21-.345.09-.12.187-.234.293-.34.082-.085.173-.163.267-.238.114-.095.233-.183.358-.262.077-.053.153-.114.235-.16L57.456.26c1.283-.735 2.862-.735 4.146 0l47.777 27.595c.082.046.158.107.234.16.126.08.245.167.358.262.094.075.185.153.268.238.106.106.203.22.293.34.076.109.146.225.209.345.078.144.147.29.207.444.046.115.09.232.118.355.095.351.144.713.144 1.077v105.7l41.486-23.953V60.697c0-.364.049-.726.144-1.077.028-.123.072-.24.117-.355.06-.154.13-.3.207-.444.063-.12.134-.236.21-.345.09-.12.188-.234.293-.34.083-.085.173-.163.268-.238.113-.095.232-.183.357-.262.078-.053.154-.114.235-.16l47.777-27.595c1.283-.735 2.863-.735 4.146 0l47.778 27.595c.081.046.157.107.234.16.125.08.244.167.357.262.095.075.186.153.268.238.106.106.204.22.293.34.077.109.147.225.21.345.077.144.147.29.207.444.045.115.09.232.117.355z" fill="#FF2D20"/>
                        <path d="M198.302 111.507l-38.4 22.168v43.874l38.4-22.168V111.507zm-86.208-73.87L73.694 59.805l38.4 22.168 38.4-22.168-38.4-22.168zm45.074 26.02L118.769 85.82v44.386l38.4-22.168V63.656zm43.206 24.987l-38.4-22.168-38.4 22.168 38.4 22.168 38.4-22.168zM112.094 5.907L73.694 28.075l38.4 22.168 38.4-22.168-38.4-22.168zM16.293 38.874v157.486l86.208 49.768V89.642L16.293 38.874zm190.16 22.168l-38.4-22.168-38.4 22.168 38.4 22.168 38.4-22.168zM63.094 214.956l38.4 22.168V193.25l-38.4-22.168v43.874z" fill="#FFF" fillOpacity=".25"/>
                      </svg>
                    </div>
                  </div>
        </div>
    );
}
export default Skills;
