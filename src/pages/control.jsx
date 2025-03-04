import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, Table, Breadcrumb } from "react-bootstrap";

const Control = () => {
  const [state, setState] = useState(() => {
    const storedTransactions = localStorage.getItem("transactions");
    return {
      transactions: storedTransactions ? JSON.parse(storedTransactions) : [],
      amount: "",
      name: "",
      type: "ingreso",
    };
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(state.transactions));
  }, [state.transactions]);

  const getBalance = () =>
    state.transactions.reduce(
      (total, t) => (t.type === "ingreso" ? total + t.amount : total - t.amount),
      0
    );

  const handleChange = (e) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(state.amount);

    if (!state.name.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      return alert("Por favor, ingresa datos válidos.");
    }

    if (state.type === "gasto" && parsedAmount > getBalance()) {
      return alert("No puedes gastar más de lo que tienes disponible.");
    }

    setState((prev) => ({
      ...prev,
      transactions: [...prev.transactions, { id: Date.now(), ...state, amount: parsedAmount }],
      amount: "",
      name: "",
    }));
  };

  const handleDelete = useCallback((id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta transacción?")) {
      setState((prev) => ({
        ...prev,
        transactions: prev.transactions.filter((t) => t.id !== id),
      }));
    }
  }, []);

  const handleClearHistory = () => {
    if (window.confirm("¿Estás seguro de que quieres borrar todo el historial?")) {
      setState((prev) => ({ ...prev, transactions: [] }));
      localStorage.removeItem("transactions");
    }
  };

  return (
    <div className="container mt-4">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Control</Breadcrumb.Item>
      </Breadcrumb>

      <h2 className="text-success text-center">Controlar Gastos / Ingresos</h2>
      <h3>Saldo Disponible: ${getBalance().toLocaleString("es-ES")}</h3>

      {/* Formulario */}
      <Form onSubmit={handleSubmit} className="mt-3">
        <Form.Group>
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={state.name}
            onChange={handleChange}
            placeholder="Ej: Alquiler, Sueldo..."
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Cantidad</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            value={state.amount}
            onChange={handleChange}
            placeholder="Ingrese la cantidad"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Tipo</Form.Label>
          <Form.Select name="type" value={state.type} onChange={handleChange}>
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
          </Form.Select>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Agregar
        </Button>
      </Form>

      {/* Historial */}
      <h3 className="mt-4">Historial</h3>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {state.transactions.length > 0 ? (
            state.transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>${t.amount.toLocaleString("es-ES")}</td>
                <td style={{ color: t.type === "ingreso" ? "green" : "red" }}>
                  {t.type}
                </td>
                <td>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(t.id)}>
                    ❌ Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No hay transacciones registradas.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* {state.transactions.length > 0 && (
        <Button variant="danger" className="mb-3" onClick={handleClearHistory}>
          Limpiar Historial
        </Button>
      )} */}
    </div>
  );
};

export default Control;
