import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

function FinanceManager() {
  const navigate = useNavigate();

  return (
    <div className="container mt-4 text-center">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Gestión</Breadcrumb.Item>
      </Breadcrumb>

      <h2 className="text-success">Gestor de Finanzas</h2>

      {/* Imagen Representativa */}
      <img
        src="https://www.chipax.com/wp-content/uploads/2022/10/gestion_financiera.png"
        alt="Gestión de Finanzas"
        className="img-fluid my-4 rounded"
      />

      {/* Botones de Navegación */}
      <div className="d-flex flex-wrap justify-content-center gap-2">
        <button
          className="btn btn-success"
          onClick={() => navigate("/etiquetas")}
        >
          Ir a Etiquetas
        </button>
        <button className="btn btn-success" onClick={() => navigate("/items")}>
          Ir a Items
        </button>
        <button
          className="btn btn-success"
          onClick={() => navigate("/presupuestos")}
        >
          Ir a Presupuestos
        </button>
      </div>
    </div>
  );
}

export default FinanceManager;
