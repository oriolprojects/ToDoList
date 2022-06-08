import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import "../css/Navbar.css"


const Navbar = ({ logout, arrayLists }) => {
    const [navbarOpen, setNavbarOpen] = useState(false);

    const handleToggle = () => {
        setNavbarOpen(!navbarOpen)
    }

    const addList = () => {
        console.log("addList");
    }

    return (
        <nav className="navBar">
            <GiHamburgerMenu onClick={handleToggle}/>
            {
                navbarOpen ?
                    <div className="navBar-items">
                        <ul>
                            <li>
                                <a onClick={addList} className="list">Add List</a>
                            </li>
                            <li>
                                <a onClick={logout} className="list">LogOut</a>
                            </li>
                        </ul>
                    </div>
                :
                    null
            }
        </nav>
    )
}

export default Navbar;





