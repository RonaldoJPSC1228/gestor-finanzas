import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Budgets({ budgets, setBudgets }) {
  const [newBudgetName, setNewBudgetName] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [editBudget, setEditBudget] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (newBudgetName.trim() === "") {
      alert("El nombre del presupuesto es obligatorio.");
      return;
    }
    const newBudget = {
      id: Date.now(),
      name: newBudgetName,
      amount: newBudgetAmount || "0",
      subitems: [],
    };
    setBudgets((prev) => [...prev, newBudget]);
    setNewBudgetName("");
    setNewBudgetAmount("");
  };

  const handleDeleteBudget = (id) => {
    setBudgets((prev) => prev.filter((budget) => budget.id !== id));
  };

  const handleEditClick = (budget) => {
    setEditBudget(budget);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editBudget.name.trim()) {
      alert("El nombre del presupuesto no puede estar vacío.");
      return;
    }
    setBudgets((prev) =>
      prev.map((b) => (b.id === editBudget.id ? editBudget : b))
    );
    setShowEditModal(false);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center text-info">Presupuestos</h1>

      {/* Formulario para añadir nuevo presupuesto */}
      <Form className="row mt-4" onSubmit={handleAddBudget}>
        <Form.Group className="col-md-5 mb-2">
          <Form.Control
            type="text"
            placeholder="Nombre del presupuesto"
            value={newBudgetName}
            onChange={(e) => setNewBudgetName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="col-md-3 mb-2">
          <Form.Control
            type="number"
            placeholder="Cantidad (opcional)"
            value={newBudgetAmount}
            onChange={(e) => setNewBudgetAmount(e.target.value)}
          />
        </Form.Group>
        <div className="col-md-4 mb-2">
          <Button type="submit" className="w-100" variant="primary">
            Añadir Presupuesto
          </Button>
        </div>
      </Form>

      {/* Lista de presupuestos */}
      <ul className="list-group mt-4">
        {budgets.map((budget) => (
          <li key={budget.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <strong>{budget.name}</strong> ${budget.amount}
              <div>
                <Button
                  variant="warning"
                  size="sm"
                  className="m-1"
                  onClick={() => navigate(`/presupuesto/${budget.id}`)}
                >
                  Ver Detalles
                </Button>
                <Button
                  variant="info"
                  size="sm"
                  className="m-1"
                  onClick={() => handleEditClick(budget)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="m-1"
                  onClick={() => handleDeleteBudget(budget.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal para editar presupuesto */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Presupuesto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Presupuesto</Form.Label>
              <Form.Control
                type="text"
                value={editBudget?.name || ""}
                onChange={(e) =>
                  setEditBudget((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                value={editBudget?.amount || ""}
                onChange={(e) =>
                  setEditBudget((prev) => ({ ...prev, amount: e.target.value }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSaveEdit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Budgets;
