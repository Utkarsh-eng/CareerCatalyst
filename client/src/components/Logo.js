import logo from "../assets/images/logo.png";
import Wrapper from "../assets/wrappers/Navbar";

const Logo = () => {
  return (
    <div className="LOGO-DIV">
      <img src={logo} alt="CareerCatalyst" className="logo" />
      {/* <p className="CareerNest">CareerNest</p> */}
    </div>
  )
};
export default Logo;
