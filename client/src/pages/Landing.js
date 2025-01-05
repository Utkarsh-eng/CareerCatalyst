import { Logo } from "../components";
import main from "../assets/images/main.svg";
import Wrapper from "../assets/wrappers/LandingPage";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
        
      </nav>
      <div className="container page">
        <div className="info">
          <h2>
            Job <span> Tracking Website </span>
          </h2>
          <p>
          Looking for a seamless way to manage your job hunt? Look no further than JobTrack – the all-in-one solution for tracking, applying, and editing job applications. With CareerNest, you can effortlessly keep tabs on your job search journey, making the process smoother and more efficient than ever before.
          </p>
          <Link to="/register" className="btn btn-hero">
            Login/register
          </Link>
        </div>
        <img src={main} alt="CareerNest" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
