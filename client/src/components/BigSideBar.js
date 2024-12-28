import { useAppContext } from "../context/appContext";
import NavLinks from "./NavLinks";
import Logo from "../components/Logo";
import Wrapper from "../assets/wrappers/BigSideBar";

const BigSideBar = () => {
  const { showSidebar } = useAppContext();
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? "sidebar-container " : "sidebar-container show-sidebar"
        }
      >
        <div className="content">
          <header>
          <div className="CareerNestDiv">
            CareerNest
          </div>
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};
export default BigSideBar;
