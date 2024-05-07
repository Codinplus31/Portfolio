import React, {useEffect, useState, useRef} from "react";
function Project(){
  let [data,setdata] = useState ([{
name: "WATCHOUTMOVIES",
    desc:"this is a movie streaming website with an api that allow you to download movie,stream movies and get notified if any movie get released.",
    img:"/watch pic.png",              
    url:"https://watchoutmovies.vercel.app",
    codelink:"https://github.com/Codinplus31/watchoutmovies"
  },{
    name:"shorter-links",
    desc:"Shorter-links.vercel.app is a URL shortener that allows you to shorten long links for easy sharing on social media, emails, text messages, and other platforms. It's a free alternative to popular URL shorteners like Bitly and TinyURL.",
    img:"/shortlink.jpeg",
    url:"https://shorter-links.vercel.app",
    codelink:"https://github.com/Codinplus31/short.ink"
    
  },{
    name: "YTDS",
    desc: "YTDS is a youtube tool for downloading youtube video, converting video to mp3 and getting youtube video keywords.",           
    img:"downloader.png",
    url:"ytds.vercel.app",
    codelink:"https://github.com/Codinplus31/ytds"
  },{
    name: "MAXIGRAM",
    desc:"This is a movie website design.",                   
    img:"movies.png",
    url:"https://chlorinated-ribbon-carob.glitch.me/index/",
    codelink:"https://github.com/Codinplus31/moviestm"
  }])
  let project1 = useRef();
  
  useEffect(()=>{
    function ProjectTran(elem, classes){

      const observer = new IntersectionObserver((entry)=>{
      
  entry.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add(classes)
      
    }else{
      // e.target.classList.remove(classes)
    }
  })
})
const Skills = elem;
observer.observe(Skills);
}
   let child =  project1.current.children;
  for(let i =0; i < child.length; i++){
ProjectTran(child[i], 'projtran')
   }
},[])
               
    return (
        <div id="project" className="project">
              <h1>Projects</h1>
              <div  className="proj" ref={project1}>
    {data && data.map((e,i)=>(
                <div  className="projsec" key={i}>
                  <div className="img">
                    <img src={e.img}/>

                  </div>
                    <h2>{e.name}</h2>
                    <p>{e.desc}</p>
                    <div>
                        <a href={e.codelink}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
  <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
</svg></a>
                        <a href={e.url}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
  <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
</svg></a>
                    </div>
                </div>
      ))}
                
              

              </div>
        </div>
    );
}
export default Project;
