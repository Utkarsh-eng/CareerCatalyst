import { Outlet, Link } from "react-router-dom"
import Wrapper from "../../assets/wrappers/SharedLayout"
import { NavBar  , BigSideBar , SmallSideBar} from "../../components"


const SharedLayout = () => {
    return (
        <Wrapper> 
            <main className="dashboard">
                <SmallSideBar/>
                <BigSideBar/>
                <div>
                    <NavBar/>
                    <div className="dashborad-page">
                        <Outlet/>

                    </div>
                </div>
            </main>
        </Wrapper>
    )
}
export default SharedLayout