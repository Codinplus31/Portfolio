import React, {useEffect, useRef} from 'react';

function About(){
    let img = useRef();
    let content = useRef();
    useEffect(()=>{
      function AboutTran(elem, classes){
  
        const observer = new IntersectionObserver((entry)=>{
        console.log(entry)
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
  AboutTran(img.current, 'aboutimg')
  AboutTran(content.current, 'aboutcont')
  },[])
    return (
        <div id='about' className='about'>
                <img ref={img} src='isme.jpg' />
            <div ref={content}>
            <h1>About Me</h1>
            <p>I am a skilled front-end and back-end developer specializing in creating user-friendly and visually appealing websites. With a strong command of HTML, CSS, and JavaScript and libraries like bootstrap, tailwind css, jQuery, Vuejs, Babylonjs, reactjs.</p>
            <button>Hire Me</button>
            </div> 
        
        </div>
    );
}
export default About;
