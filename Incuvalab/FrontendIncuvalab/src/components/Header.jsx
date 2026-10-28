import "../styles/header.css";

const Header = () => {
  return (
    <div className="header">
      <span className="header-title">CENTRO DE EMPRENDIMIENTO UNIVALLE</span>
      <div className="search-box">
        <input type="text" placeholder="Buscar" />
        <button>🔍</button>
      </div>
    </div>
  );
};

export default Header;
