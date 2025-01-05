import logo from "../assets/images/logo.svg";
import Wrapper from "../assets/wrappers/Navbar";

const Logo = () => {
  return (
    <div className="LOGO-DIV">
      <img src={logo} alt="CareerNest" className="logo" />
      {/* <p className="CareerNest">CareerNest</p> */}
    </div>
  )
};
export default Logo;
