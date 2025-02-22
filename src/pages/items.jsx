import React, { useState, useEffect } from "react";
import { Breadcrumb } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const Items = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  // Cargar ítems y etiquetas desde localStorage al iniciar
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("items")) || [];
    const storedTags = JSON.parse(localStorage.getItem("tags")) || [];
    setItems(storedItems);
    setTags(storedTags);
  }, []);

  // Función para guardar en localStorage
  const saveToLocalStorage = (newItems) => {
    localStorage.setItem("items", JSON.stringify(newItems));
    setItems(newItems);
  };

  // Manejo de agregar o editar un ítem
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }

    if (editingItem) {
      // Editar ítem existente
      const updatedItems = items.map((item) =>
        item.id === editingItem.id
          ? { ...item, name, price, description, url, tags: selectedTags }
          : item
      );
      saveToLocalStorage(updatedItems);
    } else {
      // Agregar nuevo ítem
      const newItem = {
        id: Date.now(),
        name,
        price: price || "0",
        description,
        url,
        tags: selectedTags,
      };
      saveToLocalStorage([...items, newItem]);
    }

    resetForm();
  };

  // Manejo de eliminar un ítem
  const handleDeleteItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    saveToLocalStorage(updatedItems);
  };

  // Manejo de edición de un ítem
  const handleEditItem = (item) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price);
    setDescription(item.description);
    setUrl(item.url);
    setSelectedTags(item.tags || []);
  };

  // Manejo de selección de etiquetas
  const handleTagChange = (e) => {
    const tagName = e.target.value;
    if (tagName && !selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  // Remover etiqueta de un ítem
  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  // Resetear el formulario
  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setUrl("");
    setSelectedTags([]);
    setEditingItem(null);
  };

  // Obtener solo la última parte de la ruta para mostrarla en el breadcrumb
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Gestión</Breadcrumb.Item>
        <Breadcrumb.Item active>Items</Breadcrumb.Item>
      </Breadcrumb>

      <h2>Gestión de Ítems</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input type="text" className="form-control mb-2" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="number" className="form-control mb-2" placeholder="Precio" value={price} onChange={(e) => setPrice(e.target.value)} />
          <textarea className="form-control mb-2" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input type="text" className="form-control mb-2" placeholder="URL (opcional)" value={url} onChange={(e) => setUrl(e.target.value)} />

          <select className="form-control mb-2" onChange={handleTagChange} value="">
            <option value="">Seleccionar etiqueta</option>
            {tags.map((tag) => (
              <option key={tag.name} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>

          <div className="mb-2">
            {selectedTags.map((tag, index) => (
              <span key={index} className="badge bg-primary me-2">
                {tag} <button type="button" className="btn btn-sm btn-danger ms-1" onClick={() => handleRemoveTag(tag)}>x</button>
              </span>
            ))}
          </div>

          <button type="submit" className={`btn ${editingItem ? "btn-warning" : "btn-success"} me-2`}>
            {editingItem ? "Guardar Cambios" : "Agregar Ítem"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>
        </div>
      </form>

      <hr />

      <h4>Lista de Ítems</h4>
      <div className="row">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">Precio: ${item.price}</p>
                  <p className="card-text">{item.description}</p>
                  {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-info btn-sm">Ver más</a>}

                  <p className="mt-2">
                    <strong>Etiquetas:</strong> {item.tags && item.tags.length > 0 ? item.tags.join(", ") : "Sin etiquetas"}
                  </p>

                  <div className="d-flex justify-content-between">
                    <button className="btn btn-warning btn-sm" onClick={() => handleEditItem(item)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay ítems disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default Items;
