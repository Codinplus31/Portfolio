import React,{useRef} from "react";
import emailjs from "@emailjs/browser";
function Contact(){
    // emailjs.send("service_k9ahhke","template_465aqdg",{
    //     from_name: "uni",
    //     to_name: "poll",
    //     message: "fccc",
    //     });
    const [formData, setFormData] = useState({
    from_name: '',
    to_name: '',
    message: '',
  });
    let [send,setsend] = useState(false);

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    // Perform validation here, e.g., check if fields are not empty
    const newErrors = {};
      
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
   
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
  
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
 
    }
      console.log(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Validation passed, send the email using Email.js
      // Import and configure emailjs-com with your Service ID and User ID
      // Then use emailjs.send() to send the email
        emailjs.sendForm('service_k9ahhke', 'template_465aqdg', form.current,'O6HhNdYvR8NCZTRik')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
    } else {
      setErrors(newErrors);
    }
  };
    const form = useRef();

  //  const sendEmail = (e) => {
    //  e.preventDefault();
  
      
 //   };
    console.log(errors);
    return (
        <>
        <form id="contact" ref={form} onSubmit={sendEmail} className="contact">
            <h1>Contact Me</h1>
            <img src="isme.jpg" />
        <input name="from_name" onChange={handleInputChange} placeholder="Full Name"/>    
        <input name="to_name" onChange={handleInputChange} placeholder="Email"/>
        <textarea name="message" onChange={handleInputChange} placeholder="Messages: Hire For Job / Freelance"></textarea>
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
