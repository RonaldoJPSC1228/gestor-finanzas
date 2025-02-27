import React, { useState, useEffect } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { Breadcrumb } from "react-bootstrap";

const Recomendaciones = ({ items, agregarItemAPresupuesto }) => {
  const [saldoDisponible, setSaldoDisponible] = useState(0);
  const [montoGasto, setMontoGasto] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [itemsFiltrados, setItemsFiltrados] = useState([]);

  useEffect(() => {
    // Cargar saldo desde localStorage
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const saldo = transactions.reduce(
      (total, t) =>
        t.type === "ingreso" ? total + t.amount : total - t.amount,
      0
    );
    setSaldoDisponible(saldo);
  }, []);

  // Aplicar filtro cuando se presiona el botón
  const aplicarFiltro = () => {
    if (montoGasto === "") {
      alert("Por favor, ingrese un monto para filtrar.");
      return;
    }

    const montoGastoNumerico = Number(montoGasto);
    if (montoGastoNumerico > saldoDisponible) {
      alert("El monto ingresado supera su saldo disponible.");
      return;
    }

    const filtrados = items.filter((item) => {
      const precioNumerico = Number(item.price);
      return (
        precioNumerico <= montoGastoNumerico &&
        precioNumerico <= saldoDisponible &&
        (filtroCategoria === "todos" || item.tags.includes(filtroCategoria))
      );
    });

    console.log("Ítems filtrados:", filtrados);

    setItemsFiltrados(filtrados);
  };

  return (
    <div className="container mt-4">
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Recomendaciones</Breadcrumb.Item>
      </Breadcrumb>
      {/* <h2>Recomendaciones</h2> */}
      <h2 className="text-success text-center">Recomendaciones</h2>
      <h3>Saldo Disponible: ${saldoDisponible.toLocaleString("es-ES")}</h3>

      {/* Entrada de gasto */}
      <Form.Group>
        <Form.Label>¿Cuánto quieres gastar?</Form.Label>
        <Form.Control
          type="number"
          value={montoGasto}
          onChange={(e) => setMontoGasto(e.target.value)}
          placeholder="Ingrese cantidad"
        />
      </Form.Group>

      {/* Filtro por categoría */}
      <Form.Group>
        <Form.Label>Filtrar por categoría</Form.Label>
        <Form.Select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="bajo">Bajo</option>
          <option value="medio">Medio</option>
          <option value="bueno">Bueno</option>
          <option value="top">Top</option>
        </Form.Select>
      </Form.Group>

      {/* Botón para aplicar filtro */}
      <Button variant="primary" className="mt-2" onClick={aplicarFiltro}>
        Filtrar
      </Button>

      {/* Mostrar ítems recomendados */}
      {itemsFiltrados.length > 0 ? (
        itemsFiltrados.map((item) => (
          <Card key={item.id} className="mt-3">
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Text>
                <strong>Precio:</strong> ${item.price.toLocaleString("es-ES")}
                <br />
                <strong>Descripción:</strong> {item.description}
                <br />
                {/* <strong>Tags:</strong> */}
                {item.tags.map((tag, index) => (
                  <span key={index} className="badge bg-primary me-1">
                    {tag}
                  </span>
                ))}
              </Card.Text>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <Button variant="success">Ver más</Button>
              </a>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p className="mt-3 text-danger">
          No hay ítems filtrados. Por favor, ingrese un monto válido y presione
          "Filtrar".
        </p>
      )}
    </div>
  );
};

export default Recomendaciones;
