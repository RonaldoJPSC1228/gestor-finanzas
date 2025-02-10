import { useNavigate } from 'react-router-dom';
function Home() {
    const navigate = useNavigate();

    return (
      <div>
          <div className="container mt-5">
            <h1>Bienvenido a tu Gestor de Finanzas</h1>
            <p className="text-center text-primary">¡Bootstrap Funciona! 🎉</p>
            <button className="btn btn-success mt-3" onClick={() => navigate('/gestor-finanzas')}>
              Ir al Gestor de Finanzas
            </button>
          </div>
      </div>
    );
  }
  
  export default Home;
  