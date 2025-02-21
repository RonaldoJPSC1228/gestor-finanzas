import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Gestor de Finanzas */}
        {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button> */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/gestor-finanzas">Gestión de Finanzas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/etiquetas">Etiquetas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/presupuestos">Presupuestos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/control">Control</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
