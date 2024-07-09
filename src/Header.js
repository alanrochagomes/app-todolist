import React, { useState } from "react";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleProjects = () => {
    setProjectsExpanded(!projectsExpanded);
  };

  return (
    <div>
      <nav className="header">
        <button className="menu-toggle" onClick={toggleMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="black"
              d={
                isExpanded
                  ? "M19 13H5v-2h14v2z"
                  : "M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"
              }
            />
          </svg>
        </button>
        <div className="header-title">Todo List</div>
      </nav>
      <aside className={`side-menu ${isExpanded ? "expanded" : ""}`}>
        <div className="user-profile">
          <FontAwesomeIcon icon={faUserCircle} size="2x" />
        </div>
        <ul>
          <li>
            <a href="#home" className="active">
              🔺 Adicionar tarefa
            </a>
          </li>
          <li>
            <a href="#search">🔍 Buscar</a>
          </li>
          <li>
            <a href="#inbox">📥 Entrada</a>
          </li>
          <li>
            <a href="#today">#️⃣ Hoje</a>
          </li>
          <li>
            <a href="#upcoming">📅 Em breve</a>
          </li>
          <li>
            <a href="#filters">🏷️ Filtros e Etiquetas</a>
          </li>
          <li className="projects" onClick={toggleProjects}>
            Meus projetos
            <FontAwesomeIcon
              icon={projectsExpanded ? faChevronUp : faChevronDown}
            />
          </li>
          {projectsExpanded && (
            <ul className="projects">
              <li>
                <a href="#project1"># Casa🏠</a>
              </li>
              <li>
                <a href="#project2"># Meu trabalho🧑‍💼</a>
              </li>
              <li>
                <a href="#project3"># Estudos📚</a>
              </li>
            </ul>
          )}
          <li className="add-team">
            <a href="#team">Adicionar uma equipe</a>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Header;
