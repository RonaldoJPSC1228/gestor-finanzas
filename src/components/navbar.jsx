import { Link } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Botón de colapso para móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú de navegación */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio <i class="fas fa-house"></i></Link>
            </li>

            {/* Menú Plegable: Gestión */}
            <NavDropdown title="Gestión" id="gestion-dropdown">
              <NavDropdown.Item as={Link} to="/etiquetas">
                Etiquetas <i class="fas fa-tags"></i>
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/items">
                Items <i class="fas fa-plus-circle"></i>
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/presupuestos">
                Presupuestos <i class="fas fa-list"></i>
              </NavDropdown.Item>
            </NavDropdown>

            <li className="nav-item">
              <Link className="nav-link" to="/control">Control <i class="fas fa-chart-line"></i></Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/recomendaciones">Recomendaciones <i class="fas fa-cart-plus"></i></Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
