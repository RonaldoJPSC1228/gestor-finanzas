import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Modal, Badge } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetDetails = ({ budgets, setBudgets }) => {
  const { id } = useParams();
  const budgetId = Number(id);

  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("items")) || [];
    setItems(storedItems);
  }, []);

  const budget = budgets.find((b) => b.id === budgetId);

  if (!budget) {
    return <p>Presupuesto no encontrado.</p>;
  }

  useEffect(() => {
    if (!budget) return;

    const updatedBudgets = budgets.map((b) => {
      if (b.id === budgetId) {
        const updatedSubitems = b.subitems.map((subitem) => {
          const updatedItem = items.find((item) => item.id === subitem.id);
          return updatedItem || subitem;
        });

        return JSON.stringify(updatedSubitems) !== JSON.stringify(b.subitems)
          ? { ...b, subitems: updatedSubitems }
          : b;
      }
      return b;
    });

    if (JSON.stringify(updatedBudgets) !== JSON.stringify(budgets)) {
      setBudgets(updatedBudgets);
    }
  }, [items, budgets, budgetId, setBudgets]);

  const handleAddItemToBudget = (item) => {
    if (!budget.subitems.some((sub) => sub.id === item.id)) {
      const updatedBudgets = budgets.map((b) =>
        b.id === budgetId ? { ...b, subitems: [...b.subitems, item] } : b
      );
      setBudgets(updatedBudgets);
    }
  };

  const handleRemoveItemFromBudget = (itemId) => {
    const updatedBudgets = budgets.map((b) =>
      b.id === budgetId ? { ...b, subitems: b.subitems.filter((item) => item.id !== itemId) } : b
    );
    setBudgets(updatedBudgets);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateRandomColors = (num) =>
    Array.from({ length: num }, () =>
      `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`
    );

  const chartData = {
    labels: budget.subitems.map((item) => item.name),
    datasets: [
      {
        data: budget.subitems.map((item) => item.price),
        backgroundColor: generateRandomColors(budget.subitems.length),
        borderWidth: 1,
      },
    ],
  };

  const totalSubitemsPrice = budget.subitems.reduce((total, item) => total + Number(item.price || 0), 0);


  return (
    <div className="container mt-4">
      <h2>Detalles del Presupuesto: {budget.name}</h2>
      <p>
        <strong>Cantidad:</strong> ${budget.amount}
      </p>

      <Button variant="primary" className="mb-3 me-2" onClick={() => setShowModal(true)}>
        Items
      </Button>

      <Button variant="info" className="mb-3" onClick={() => setShowChartModal(true)}>
        Ver Gráfico
      </Button>

      {/* Modal para seleccionar ítems */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Ítems</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Buscar ítem..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <ul className="list-group">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isAlreadyAdded = budget.subitems.some((sub) => sub.id === item.id);
                return (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{item.name}</strong> - ${item.price}
                      <div>
                        {item.tags &&
                          item.tags.map((tag, index) => (
                            <Badge key={`${item.id}-${index}`} bg="info" className="me-1">
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    </div>
                    <div>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="me-2">
                          <Eye size={20} />
                        </a>
                      )}
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleAddItemToBudget(item)}
                        disabled={isAlreadyAdded}
                      >
                        {isAlreadyAdded ? "Agregado" : "Agregar"}
                      </Button>
                    </div>
                  </li>
                );
              })
            ) : (
              <p>No hay ítems disponibles.</p>
            )}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para el gráfico */}
      <Modal show={showChartModal} onHide={() => setShowChartModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Gráfico de Gastos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {budget.subitems.length > 0 ? (
            <Pie data={chartData} />
          ) : (
            <p>No hay datos para mostrar en el gráfico.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChartModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <hr />

      {/* Lista de ítems en el presupuesto */}
      <h4>Ítems en este Presupuesto</h4>
      <p>
        <strong>Total de Ítems:</strong> ${totalSubitemsPrice}
      </p>

      <ul className="list-group">
        {budget.subitems.length > 0 ? (
          budget.subitems.map((item) => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{item.name}</strong> - ${item.price}
                <div>
                  {item.tags &&
                    item.tags.map((tag, index) => (
                      <Badge key={`${item.id}-${index}`} bg="secondary" className="me-1">
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
              <div>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="me-2">
                    <Eye size={20} />
                  </a>
                )}
                <Button variant="danger" size="sm" onClick={() => handleRemoveItemFromBudget(item.id)}>
                  Eliminar
                </Button>
              </div>
            </li>
          ))
        ) : (
          <p>No hay ítems en este presupuesto.</p>
        )}
      </ul>
    </div>
  );
};

export default BudgetDetails;
