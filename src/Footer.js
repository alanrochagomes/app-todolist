// Footer.js

import React, { useEffect, useState } from 'react';
import './Footer.css'; // Importe o arquivo de estilos CSS do footer

const Footer = () => {
  const [isVisible, setIsVisible] = useState(true); // Inicializa como visível
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScrollTop > lastScrollTop) {
        // Scroll para baixo
        setIsVisible(true);
      } else {
        // Scroll para cima
        setIsVisible(false);
      }

      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  return (
    <footer className={`footer ${isVisible ? 'show' : ''}`}>
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Futuristic Todo List . Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
