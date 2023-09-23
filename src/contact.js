import React,{useRef} from "react";
import emailjs from "@emailjs/browser";
function Contact(){
    // emailjs.send("service_k9ahhke","template_465aqdg",{
    //     from_name: "uni",
    //     to_name: "poll",
    //     message: "fccc",
    //     });
    const form = useRef();

    const sendEmail = (e) => {
      e.preventDefault();
  
      emailjs.sendForm('service_k9ahhke', 'template_465aqdg', form.current)
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
    };
    return (
        <>
        <form id="contact" ref={form} onSubmit={sendEmail} className="contact">
            <h1>Contact Me</h1>
            <img src="isme.jpg" />
        <input name="from_name" placeholder="Full Name"/>    
        <input name="to_name" placeholder="Email"/>
        <textarea name="message" placeholder="Messages: Hire For Job / Freelance"></textarea>
        <button type="submit">Hire</button>    

        </form>
        <div className="footer">
         <h3> <svg style={{marginTop: "0.1rem"}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
                <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8Zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM8.146 4.992c-1.212 0-1.927.92-1.927 2.502v1.06c0 1.571.703 2.462 1.927 2.462.979 0 1.641-.586 1.729-1.418h1.295v.093c-.1 1.448-1.354 2.467-3.03 2.467-2.091 0-3.269-1.336-3.269-3.603V7.482c0-2.261 1.201-3.638 3.27-3.638 1.681 0 2.935 1.054 3.029 2.572v.088H9.875c-.088-.879-.768-1.512-1.729-1.512Z"></path>
              </svg> Developed by Uhunoma Paul </h3>
        </div>
        </>
    );
}
export default Contact;
