import React from "react";
import "../Style/Contact.css";

const Contact = () => {
  return (
    <>
      <img src="./contact.jpg" alt=" contact jpg " />
      <div id="main">
        <div id="contact-info">
          <img src="/telecall.png" />
          <a href="tel:9316755501">
            <b  >Phone:</b> &nbsp; +91 9316755501 <br /><br />
          </a>
          <a href="mailto:laxmoindustries@gmail.com">
            <b>Email:</b> &nbsp; laxmoindustries@gmail.com <br /><br />
          </a>
          <a href="https://g.co/kgs/y5b7mdL">
            <b>Address:</b> &nbsp; Kevadiya Farm,<br />

          </a>
          <a href="https://g.co/kgs/y5b7mdL">
            Nr. Sahaj Imperia, Dabholi,
          </a>

          <a href="https://g.co/kgs/y5b7mdL">Surat, 395004, Gujarat, India</a>

          <div id="contact-icons">
            <a href="mailto:laxmoindustries@gmail.com" target="_blank" > <img src="./email.png" className="contact-icons"  ></img></a>
            <a href="https://www.instagram.com/laxmopump/?igsh=MTYwOWFvMzBhYmsxZg%3D%3D&utm_source=qr#" target="_blank" > <img src="./instagram.png" className="contact-icons "></img></a>
            <a href="https://g.co/kgs/y5b7mdL" target="_blank" > <img src="./map.png" className="contact-icons  "></img></a>
            <a href="https://www.facebook.com/kisan.sales.2025?mibextid=wwXIfr&rdid=MVLIrw9Ag3jLOF35&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18yaPK4PuW%2F%3Fmibextid%3DwwXIfr#" target="_blank" > <img src="./facebook.png" className="contact-icons "></img> </a>
             <a href="https://wa.me/919316755501" target="_blank" > <img src="./whatsapp.png" className="contact-icons "></img> </a>
            <a href="https://www.youtube.com/@laxmoindustriespvtltd" target="_blank" > <img src="./youtube.png" className="contact-icons "></img> </a>
          </div>

        </div>
        <div id="get-in-touch">
          <h3 className="title">Get In Touch</h3>
          <div id="form">
            <form action="https://formspree.io/f/mjkbklrl" method="POST" > 
              <div className="input">
                <label htmlFor="Fullname">Full Name</label>
                <input type="text" name="fullname" id="Fullname" />
              </div>
              <div className="input">
                <label htmlFor="Email">Email</label>
                <input type="email" name="email" id="Email" />
              </div>
              <div className="input">
                <label htmlFor="number">Number</label>
                <input type="phone" name="number" id="Number" />
              </div>
              <div className="input">
                <label htmlFor="message">Your Message</label>
                <input type="text" name="message" id="message" />
              </div>
              <button id="submit-btn" type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>
      <div id="map">
        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3808200.7768138624!2d72.843364!3d21.233987!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04f7c994f768d%3A0x45b3b521ee85ed72!2sLaxmo%20Technology!5e0!3m2!1sen!2sus!4v1719376786736!5m2!1sen!2sus" allowfullscreen="" id="map-iframe" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </>
  );
};

export default Contact;

