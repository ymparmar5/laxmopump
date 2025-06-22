import { Link ,useNavigate} from "react-router-dom";
import "../Style/Footer.css"
import Certificates from "../Pages/Certificates";

const Footer = () => {
  const navigate = useNavigate()
  const handleDownload = () => {
    // Trigger the file download
    // const link = document.createElement('a');
    // link.href = 'certificates.zip';  // Path to your ZIP file
    // link.download = 'certificates.zip';  // This will trigger the download with the name 'your-file.zip'
    // link.click();
    navigate("/certificates")
  };
  return (
    <>
      <div className="footer-top" >
     <a href="/catlog-loxmo.pdf" download="catlog-loxmo">
  <i className="fa-solid fa-file-pdf fa-2xl red-icon"></i>
</a>



          <a href="https://wa.me/919316755501">
            <img src="/whatsapp.png" alt="whatsapp" className="whatsapp" />
          </a>

        <div id="footer-icons">
            <a  href="https://www.t.me/AardipJogani " target="_blank" > <img src="./telegram.png" className="footer-icons "></img></a>
            <a  href="mailto:laxmoindustries@gmail.com" target="_blank" > <img src="./email.png"  className="footer-icons "  ></img></a>
            <a  href="https://www.instagram.com/laxmo_technology/" target="_blank" > <img src="./instagram.png"  className="footer-icons "></img></a>
            <a  href="https://maps.app.goo.gl/W6GD7AsVySMLcJbK9" target="_blank" > <img src="./map.png"  className="footer-icons  "></img></a>
            <a  href="https://www.facebook.com/people/Laxmo-Pump/pfbid02vTXqfRy7wGahrG7BFBnA2oP9mh13WPT8Evduj5SycwExH1HkotKJMwYGSKrnnHAZl/" target="_blank" > <img src="./facebook.png" className="footer-icons "></img> </a>
            <a  href="https://www.linkedin.com/in/laxmo-pumps-water-pump-791492205/" target="_blank" > <img src="./linkedin.png" className="footer-icons "></img> </a>
            <a  href="https://wa.me/919316755501" target="_blank" > <img src="./whatsapp.png"  className="footer-icons "></img> </a>
            <a  href="https://www.youtube.com/@laxmopumps9657" target="_blank" > <img src="./youtube.png"  className="footer-icons "></img> </a>
            <a  href="https://linktr.ee/f5yr6tf?utm_source=linktree_admin_share" target="_blank" > <img src="./qr-code.png"  className="footer-icons "></img> </a>

          </div>

        {/* <button id="get-connect" onClick={handleDownload}>View Certificates</button> */}

      </div>
      <footer>

        <div className="footer-menu"> <h3 className="footer-heading" > ABOUT US</h3>
          <ul>
            <p>
              Founded in 2010, we began our journey with a simple vision: to revolutionize the Pumps and Motors manufacturing industry by delivering high-quality, innovative products.
            </p>
          </ul></div>

        <div className="footer-menu">
          <h3 className="footer-heading" >
            IMPORTANT LINKS

          </h3>
          <ul>
            <Link to={"/privacy"} >
              <li>Privacy policy</li>
            </Link>
            <Link to={"/tandc"} ><li>Terms </li>
            </Link>
            <Link to={"/about"}>   <li>About</li>
            </Link>
            <Link to={"./shop"}>
              <li  >Manufactures</li>
            </Link>
            <Link to={"./user"} >
              <li>Track orders</li>
            </Link>
          </ul>
        </div>

        <div className="footer-menu">
          <h3 className="footer-heading" >MY ACCOUNTS

          </h3>

          <ul>
          <Link to={"./sign-up"} >
              <li>Sign Up</li>
            </Link>
            <Link to={"./sign-in"} >
              <li>Login</li>
            </Link>
            <Link to={"./cart"} >
              <li>cart</li>
            </Link>
            <Link to={"./cart"} >
              <li>wish list</li>
            </Link>

            <Link to={"./admin"} >
              <li>My account</li>
            </Link>
          </ul></div>
      
      </footer>
      <div id="madeby" >
        <p>&copy; copyright @2024 laxmopumps. all right reserved</p>
        <p>Made by Y.M.PARMAR</p>
      </div>
    </>

  );
}

export default Footer;