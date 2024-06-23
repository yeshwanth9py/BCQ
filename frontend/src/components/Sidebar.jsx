import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCompass,
  faUsers,
  faCogs,
  faServer,
  faCloud
} from "@fortawesome/free-solid-svg-icons";
import cx from "classnames";

const menuItems = [
  { title: "Home", icon: faCompass },
  { title: "Profile", icon: faUsers },
  { title: "Chts", icon: faCloud },
  { title: "Leaderboard", icon: faCogs },
  { title: "Battles", icon: faServer }
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(()=>{
    setTimeout(()=>{
        setIsOpen(!isOpen)
    }, 500)
  }, [])

  return (
    <div>
    <div className={cx("sidebar", { "sidebar-closed": !isOpen })}>
      <button className={"sidebar__button"} onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <ul>
        {menuItems.map(item => (
          <li key={item.title}>
            <div className={"sidebar__listItem"}>
              <FontAwesomeIcon className={"sidebar__icon"} icon={item.icon} />
              <CSSTransition
                in={isOpen}
                timeout={100}
                classNames={"fade"}
                unmountOnExit
              >
                <span>{item.title}</span>
              </CSSTransition>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Sidebar;


