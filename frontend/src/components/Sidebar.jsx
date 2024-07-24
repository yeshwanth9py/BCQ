import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCompass,
  faUsers,
  faCloud,
  faCogs,
  faServer,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import cx from "classnames";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import { link } from "../../../backend/routes/profileRoutes";

const menuItems = [
  { title: "Home", icon: faCompass, link: "/home" },
  { title: "Profile", icon: faUsers, link: "home/profile/"+localStorage.getItem("ccusername") },
  { title: "Chats", icon: faCloud, link: "/chats" },
  { title: "Leaderboard", icon: faCogs, link: "/leaderboard" },
  { title: "Battles", icon: faServer, link: "/battles" },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(!isOpen);
    }, 500);
  }, []);

  

  const handleLogout = () => {
    // Logic for logging out the user
    console.log("User logged out");
    localStorage.removeItem("ccuid");
    localStorage.removeItem("ccusername");
    localStorage.removeItem("ccavatar");
    localStorage.removeItem("ccpid");
    navigate("/login");
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: "rgb(155,41,211)" }}>
      <div className={cx("sidebar", { "sidebar-closed": !isOpen })} style={{ flexGrow: 1 }}>
        <button className={"sidebar__button"} onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={faBars} className="text-center"/>
        </button>
        <ul>
          {menuItems.map((item) => (
            <li key={item.title} className="text-center">
              <div className={"sidebar__listItem"}>
                <FontAwesomeIcon className={"sidebar__icon"} icon={item.icon} />
                <CSSTransition
                  in={isOpen}
                  timeout={100}
                  classNames={"fade"}
                  unmountOnExit
                >
                  <span className="text-center hover:text-xl" onClick={() => navigate(item.link)}>{item.title}</span>
                </CSSTransition>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="w-full h-0.5 bg-white"></div>
      <div className="sidebar__logout text-center" onClick={handleLogout}>
        <FontAwesomeIcon className={"sidebar__icon"} icon={faSignOutAlt} />
        <CSSTransition
          in={isOpen}
          timeout={100}
          classNames={"fade"}
          unmountOnExit
        >
          <span className="text-white text-xl hover:text-gray-950 hover:text-2xl">Logout</span>
        </CSSTransition>
      </div>
    </div>
  );
};

export default Sidebar;
