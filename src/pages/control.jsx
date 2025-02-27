import React, { useState, useEffect } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { Breadcrumb } from "react-bootstrap";

const Control = () => {
  const [transactions, setTransactions] = useState(() => {
    const storedTransactions = localStorage.getItem("transactions");
    return storedTransactions ? JSON.parse(storedTransactions) : [];
  });

  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("ingreso");

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const getBalance = () => {
    return transactions.reduce(
      (total, t) =>
        t.type === "ingreso" ? total + t.amount : total - t.amount,
      0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (!name.trim()) {
      alert("Por favor, ingresa un nombre para la transacción.");
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Por favor, ingresa una cantidad válida.");
      return;
    }

    if (type === "gasto" && parsedAmount > getBalance()) {
      alert("No puedes gastar más de lo que tienes disponible.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      name,
      amount: parsedAmount,
      type,
    };

    setTransactions([...transactions, newTransaction]);
    setAmount("");
    setName("");
  };

  const handleClearHistory = () => {
    if (
      window.confirm("¿Estás seguro de que quieres borrar todo el historial?")
    ) {
      setTransactions([]);
      localStorage.removeItem("transactions");
    }
  };

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Alquiler, Sueldo..."
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Cantidad</Form.Label>
          <Form.Control
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ingrese la cantidad"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Tipo</Form.Label>
          <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
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
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>${t.amount.toLocaleString("es-ES")}</td>
                <td style={{ color: t.type === "ingreso" ? "green" : "red" }}>
                  {t.type}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No hay transacciones registradas.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {transactions.length > 0 && (
        <Button variant="danger" className="mb-3" onClick={handleClearHistory}>
          Limpiar Historial
        </Button>
      )}
    </div>
  );
};

export default Control;
