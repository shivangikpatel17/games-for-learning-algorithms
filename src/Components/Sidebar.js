import React, { useState } from "react";
import "../App.css";
import { SidebarData } from "./SidebarData";
import { Link } from "react-router-dom";

function Sidebar() {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleDropDown = (index) => {
    setOpenCategory(openCategory === index ? null : index);
  };

  return (
    <div className="Sidebar">
      <ul className="SidebarList">
        {SidebarData.map((val, key) => (
          <div key={key}>
            {val.link ? (
              <li className="row">
                <Link to={val.link} className="nav-link">
                  <div id="icon">{val.icon}</div>
                  <div id="title">{val.title}</div>
                </Link>
              </li>
            ) : (
              <li
                className="row"
                onClick={() => val.subtopics && toggleDropDown(key)}
              >
                <div id="icon">{val.icon}</div>
                <div id="title">{val.title}</div>
              </li>
            )}

            {openCategory === key && val.subtopics && (
              <ul className="subtopics">
                {val.subtopics.map((sub, subKey) => (
                  <li key={subKey} className="subtopic-item">
                    <Link to={sub.link} className="subtopic-link">
                      <div className="subtopic-icon">{sub.icon}</div>
                      <span className="subtopic-name">{sub.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;