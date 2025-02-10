import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [newBudgetName, setNewBudgetName] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddBudget = () => {
    if (newBudgetName.trim() !== "") {
      setBudgets([
        ...budgets,
        { id: Date.now(), name: newBudgetName, amount: newBudgetAmount || "0" }
      ]);
      setNewBudgetName("");
      setNewBudgetAmount("");
    }
  };

  const handleOpenModal = (budget) => {
    setSelectedBudget(budget);
    setShowModal(true);
  };

  const handleSaveChanges = () => {
    setBudgets(budgets.map(budget =>
      budget.id === selectedBudget.id ? { ...selectedBudget } : budget
    ));
    setShowModal(false);
  };

  const handleDeleteBudget = (id) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-info">Presupuestos</h1>

      {/* Formulario para añadir presupuesto */}
      <div className="row mt-4">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del presupuesto"
            value={newBudgetName}
            onChange={(e) => setNewBudgetName(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Cantidad (opcional)"
            value={newBudgetAmount}
            onChange={(e) => setNewBudgetAmount(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100" onClick={handleAddBudget}>
            Añadir Presupuesto
          </button>
        </div>
      </div>

      {/* Lista de presupuestos */}
      <ul className="list-group mt-4">
        {budgets.map((budget) => (
          <li key={budget.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{budget.name}</strong> - ${budget.amount}
            </div>
            <div>
              <button className="btn btn-warning btn-sm me-2" onClick={() => handleOpenModal(budget)}>
                Editar
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteBudget(budget.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal para editar presupuesto */}
      {selectedBudget && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Presupuesto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label>Nombre del presupuesto</label>
              <input
                type="text"
                className="form-control"
                value={selectedBudget.name}
                onChange={(e) => setSelectedBudget({ ...selectedBudget, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label>Cantidad</label>
              <input
                type="number"
                className="form-control"
                value={selectedBudget.amount}
                onChange={(e) => setSelectedBudget({ ...selectedBudget, amount: e.target.value })}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Budgets;
