import React, {useEffect, useRef} from "react";
function Project(){
  let project1 = useRef();
  let project2 = useRef();
  let project3 = useRef();
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
ProjectTran(project1.current, 'projtran')
ProjectTran(project2.current, 'projtran')
ProjectTran(project3.current, 'projtran')
},[])
               
    return (
        <div id="project" className="project">
              <h1>Projects</h1>
              <div  className="proj">
                <div ref={project1} className="projsec">
                  <div className="img">
                    <img src="downloader.png"/>

                  </div>
                    <h2>YTDS</h2>
                    <p>YTDS is a youtube tool for downloading youtube video, converting video to mp3 and getting youtube video keywords.</p>
                    <div>
                        <a href="https://github.com/Codinplus31/ytds"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
  <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
</svg></a>
                        <a href="https://ytds.vercel.app"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
  <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
</svg></a>
                    </div>
                </div>
                <div ref={project2} className="projsec">
                  <div className="img">
                    <img src="movies.png"/>

                  </div>
                    <h2>MAXIGRAM</h2>
                    <p>This is a movie streaming service demo is still under construction.</p>
                    <div>
                        <a href="https://github.com/Codinplus31/moviestm"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
  <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
</svg></a>
                        <a><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
  <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
</svg></a>
                    </div>
                </div>
                <div ref={project3} className="projsec">
                  <div className="img">
                    <img src="image/3dcandy.jpg"/>

                  </div>
                    <h2>Project Name</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia maiores, quia dolorem obcaecati distinctio magnam cupiditate sit voluptas, dolor placeat, fugiat asperiores possimus qui at quasi eveniet nesciunt laborum atque.</p>
                    <div>
                        <a><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
  <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
</svg></a>
                        <a><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
  <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
  <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
</svg></a>
                    </div>
                </div>
              

              </div>
        </div>
    );
}
export default Project;
