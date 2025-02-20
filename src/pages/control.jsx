import { useNavigate } from 'react-router-dom';
function Control() {
    const navigate = useNavigate();

    return (
      <div>
          <div className="container mt-5">
            <h1>Aqui vas a saber tu control de gastos, ingresos y costos</h1>
            <p className="text-center text-primary">¡Bootstrap Funciona! 🎉</p>
            <button className="btn btn-success mt-3">
              Ver Grafico
            </button>
          </div>
      </div>
    );
  }
  
  export default Control;
  