import { useNavigate, useLocation } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener solo la última parte de la ruta para mostrarla en el breadcrumb
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="container mt-5 text-center">

      <h1 className="text-success">Gestor de Finanzas</h1>
      <p className="text-muted">
        Aquí podrás gestionar tus gastos, ingresos y presupuestos.
      </p>

      {/* Imagen Representativa */}
      <img src="https://www.chipax.com/wp-content/uploads/2022/10/gestion_financiera.png" alt="Gestión de Finanzas" className="img-fluid my-4 rounded" />

      {/* Botones de Navegación */}
      <div className="d-flex flex-wrap justify-content-center gap-2">
        <button className="btn btn-primary" onClick={() => navigate("/etiquetas")}>
          Ir a Etiquetas
        </button>
        <button className="btn btn-primary" onClick={() => navigate("/items")}>
          Ir a Items
        </button>
        <button className="btn btn-primary" onClick={() => navigate("/presupuestos")}>
          Ir a Presupuestos
        </button>
        <button className="btn btn-warning" onClick={() => navigate("/control")}>
          Ir a Control
        </button>
      </div>
    </div>
  );
}

export default Home;
