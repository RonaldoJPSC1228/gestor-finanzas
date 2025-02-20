import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Modal } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

// Registrar elementos de Chart.js
Chart.register(ArcElement, Tooltip, Legend);

const BudgetDetails = ({ budgets, setBudgets }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const budget = budgets?.find((b) => b.id == id);

  // Estados para agregar subitems
  const [newSubItemName, setNewSubItemName] = useState("");
  const [newSubItemPrice, setNewSubItemPrice] = useState("");
  const [newSubItemDescription, setNewSubItemDescription] = useState("");
  const [newSubItemColor, setNewSubItemColor] = useState("#000000");
  const [newSubItemLink, setNewSubItemLink] = useState("");

  // Estados para editar subitems
  const [editModalShow, setEditModalShow] = useState(false);
  const [editSubItem, setEditSubItem] = useState(null);

  // Estado para modal de gráficos
  const [showChartModal, setShowChartModal] = useState(false);

  if (!budget) {
    return <h3 className="text-danger text-center">Presupuesto no encontrado</h3>;
  }

  // Calcular total de subitems
  const totalSubItems = budget.subitems.reduce((acc, sub) => acc + Number(sub.price), 0);

  // Datos para el gráfico
  const chartData = {
    labels: budget.subitems.map((sub) => sub.name),
    datasets: [
      {
        data: budget.subitems.map((sub) => Number(sub.price)),
        backgroundColor: budget.subitems.map((sub) => sub.color || "#000000"),
        hoverOffset: 4,
      },
    ],
  };

  // Agregar subitem
  const handleAddSubItem = (e) => {
    e.preventDefault();
    if (newSubItemName.trim() === "") return alert("Nombre obligatorio");

    const newSubItem = {
      id: Date.now(),
      name: newSubItemName,
      price: newSubItemPrice || "0",
      description: newSubItemDescription,
      color: newSubItemColor,
      link: newSubItemLink,
    };

    setBudgets(
      budgets.map((b) =>
        b.id === budget.id ? { ...b, subitems: [...b.subitems, newSubItem] } : b
      )
    );

    // Resetear campos del formulario
    setNewSubItemName("");
    setNewSubItemPrice("");
    setNewSubItemDescription("");
    setNewSubItemColor("#000000");
    setNewSubItemLink("");
  };

  // Eliminar subitem
  const handleDeleteSubItem = (subItemId) => {
    setBudgets(
      budgets.map((b) =>
        b.id === budget.id
          ? { ...b, subitems: b.subitems.filter((sub) => sub.id !== subItemId) }
          : b
      )
    );
  };

  // Abrir modal de edición con los datos del subitem seleccionado
  const handleEditSubItem = (subitem) => {
    console.log("Editando subitem:", subitem); // Depuración
    setEditSubItem({ ...subitem });
    setEditModalShow(true);
  };

  // Guardar cambios del subitem editado
  const handleSaveEdit = () => {
    if (!editSubItem) return;

    setBudgets(
      budgets.map((b) =>
        b.id === budget.id
          ? {
              ...b,
              subitems: b.subitems.map((sub) =>
                sub.id === editSubItem.id ? editSubItem : sub
              ),
            }
          : b
      )
    );
    setEditModalShow(false);
  };

  return (
    <div className="container mt-4">
      <h2>{budget.name} - ${budget.amount}</h2>

      {/* Formulario para agregar subitems */}
      <h4 className="mb-3">Agregar Subitem</h4>
      <Form onSubmit={handleAddSubItem}>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Nombre" value={newSubItemName} onChange={(e) => setNewSubItemName(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="number" placeholder="Precio" value={newSubItemPrice} onChange={(e) => setNewSubItemPrice(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control as="textarea" rows={2} placeholder="Descripción" value={newSubItemDescription} onChange={(e) => setNewSubItemDescription(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="color" value={newSubItemColor} onChange={(e) => setNewSubItemColor(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="URL (opcional)" value={newSubItemLink} onChange={(e) => setNewSubItemLink(e.target.value)} />
        </Form.Group>
        <Button type="submit">Agregar</Button>
      </Form>

      <hr />

      {/* Lista de subitems */}
      <h4>Subitems</h4>
      {/* Total de subitems */}
      <h4 className="mt-3 text-primary">Total de subitems: ${totalSubItems}</h4>
      {/* Botón para abrir modal con gráficos */}
      <Button className="mb-3" variant="success" onClick={() => setShowChartModal(true)}>
        Ver Gráficos
      </Button>
      <ul className="list-group">
        {budget.subitems.map((subitem) => (
          <li key={subitem.id} className="list-group-item d-flex justify-content-between align-items-center" style={{ borderLeft: `5px solid ${subitem.color}` }}>
            <div>
              <strong>{subitem.name}</strong> - ${subitem.price}
              <p>{subitem.description}</p>
              {subitem.link && (
                <a href={subitem.link} target="_blank" rel="noopener noreferrer" className="btn btn-info btn-sm">
                  Ver más
                </a>
              )}
            </div>
            <div>
              <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditSubItem(subitem)}>
                Editar
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDeleteSubItem(subitem.id)}>
                Eliminar
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Button variant="secondary" className="mt-3" onClick={() => navigate("/presupuestos")}>
        Volver
      </Button>

      {/* Modal de gráficos */}
      <Modal show={showChartModal} onHide={() => setShowChartModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Distribución de Subitems</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {budget.subitems.length > 0 ? <Pie data={chartData} /> : <p className="text-center">No hay subitems para mostrar en el gráfico.</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChartModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de edición */}
      <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Editar Subitem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {editSubItem && (
                <Form>
                    <Form.Group className="mb-2">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={editSubItem.name} 
                        onChange={(e) => setEditSubItem({ ...editSubItem, name: e.target.value })} 
                    />
                    </Form.Group>
                    <Form.Group className="mb-2">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control 
                        type="number" 
                        value={editSubItem.price} 
                        onChange={(e) => setEditSubItem({ ...editSubItem, price: e.target.value })} 
                    />
                    </Form.Group>
                    <Form.Group className="mb-2">
                    <Form.Label>Color</Form.Label>
                    <Form.Control 
                        type="color" 
                        value={editSubItem.color} 
                        onChange={(e) => setEditSubItem({ ...editSubItem, color: e.target.value })} 
                    />
                    </Form.Group>
                    <Form.Group className="mb-2">
                    <Form.Label>URL</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={editSubItem.link || ""} 
                        onChange={(e) => setEditSubItem({ ...editSubItem, link: e.target.value })} 
                    />
                    </Form.Group>
                    <Button variant="primary" onClick={handleSaveEdit}>
                    Guardar Cambios
                    </Button>
                </Form>
                )}
            </Modal.Body>
        </Modal>

    </div>
  );
};

export default BudgetDetails;
