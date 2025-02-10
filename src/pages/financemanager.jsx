import { useNavigate } from 'react-router-dom';

function FinanceManager() {
    const navigate = useNavigate();

    return (
        <div className="container mt-5">
            <h1 className="text-center text-success">Gestor de Finanzas</h1>
            <p className="text-muted text-center">
            Aquí podrás gestionar tus gastos, ingresos y presupuestos.
            </p>
            <button className="btn btn-info mt-3" onClick={() => navigate('/presupuestos')}>
                Ir a Presupuestos
            </button>
        </div>
    );
  }
  
  export default FinanceManager;
  