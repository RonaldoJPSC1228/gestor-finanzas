import React, { useState, useEffect } from "react";
import { Breadcrumb, Modal } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';

const Items = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);

  // Estados para el formulario de agregar un nuevo ítem
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemUrl, setNewItemUrl] = useState("");
  const [newItemSelectedTags, setNewItemSelectedTags] = useState([]);

  // Estados para el modal de editar un ítem
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const [tags, setTags] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  // -------------------------------------------------------------------
  // Funciones para el formulario de agregar un nuevo ítem
  // -------------------------------------------------------------------

  // Manejo de selección de etiquetas para el formulario de agregar ítems
  const handleNewItemTagChange = (e) => {
    const tagName = e.target.value;
    if (tagName && !newItemSelectedTags.includes(tagName)) {
      setNewItemSelectedTags([...newItemSelectedTags, tagName]);
    }
  };

  // Remover etiqueta del formulario de agregar ítems
  const handleRemoveNewItemTag = (tagToRemove) => {
    setNewItemSelectedTags(newItemSelectedTags.filter((tag) => tag !== tagToRemove));
  };

  // Resetear el formulario de agregar ítems
  const resetNewItemForm = () => {
    setNewItemName("");
    setNewItemPrice("");
    setNewItemDescription("");
    setNewItemUrl("");
    setNewItemSelectedTags([]);
  };

  // Manejo de agregar un nuevo ítem
  const handleAddItem = (e) => {
    e.preventDefault();

    if (!newItemName.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }

    // Agregar nuevo ítem (desde el formulario principal)
    const newItem = {
      id: Date.now(),
      name: newItemName,
      price: newItemPrice || "0",
      description: newItemDescription,
      url: newItemUrl,
      tags: newItemSelectedTags,
    };
    saveToLocalStorage([...items, newItem]);
    resetNewItemForm();
  };

  // -------------------------------------------------------------------
  // Funciones para el modal de editar un ítem
  // -------------------------------------------------------------------

  // Manejo de selección de etiquetas para el modal de editar ítems
  const handleTagChange = (e) => {
    const tagName = e.target.value;
    if (tagName && !selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  // Remover etiqueta del modal de editar ítems
  const handleRemoveTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  // Resetear el formulario del modal de editar ítems
  const resetEditItemForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setUrl("");
    setSelectedTags([]);
    setEditingItem(null);
  };

  // Manejo de guardar los cambios del ítem editado
  const handleEditItemSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }

    // Editar ítem existente
    const updatedItems = items.map((item) =>
      item.id === editingItem.id
        ? { ...item, name, price, description, url, tags: selectedTags }
        : item
    );
    saveToLocalStorage(updatedItems);
    handleCloseModal(); // Cerrar el modal después de editar
    resetEditItemForm();
  };

    // Manejo de eliminar un ítem
    const handleDeleteItem = (id) => {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedItems = items.filter((item) => item.id !== id);
          saveToLocalStorage(updatedItems);
          Swal.fire(
            'Eliminado!',
            'El ítem ha sido eliminado.',
            'success'
          )
        }
      })
    };

  // Manejo de edición de un ítem
  const handleEditItem = (item) => {
    setEditingItem(item);
    setName(item.name);
    setPrice(item.price);
    setDescription(item.description);
    setUrl(item.url);
    setSelectedTags(item.tags || []);
    handleOpenModal(); // Abrir el modal para editar
  };

  // Función para abrir el modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    resetEditItemForm();
  };

  // Obtener solo la última parte de la ruta para mostrarla en el breadcrumb
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="container mt-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/gestion">Gestión</Breadcrumb.Item>
        <Breadcrumb.Item active>Items</Breadcrumb.Item>
      </Breadcrumb>

      <h2 className="text-center">Gestión de Items</h2>

      {/* Formulario para agregar un nuevo ítem */}
      <form onSubmit={(e) => handleAddItem(e)}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Nombre"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            required
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Precio"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
          />
          <textarea
            className="form-control mb-2"
            placeholder="Descripción"
            value={newItemDescription}
            onChange={(e) => setNewItemDescription(e.target.value)}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="URL (opcional)"
            value={newItemUrl}
            onChange={(e) => setNewItemUrl(e.target.value)}
          />
          <select className="form-control mb-2" onChange={handleNewItemTagChange} value="">
            <option value="">Seleccionar etiqueta</option>
            {tags.map((tag) => (
              <option key={tag.name} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
          <div className="mb-2">
            {newItemSelectedTags.map((tag, index) => (
              <span key={index} className="badge bg-primary me-2">
                {tag}
                <button
                  type="button"
                  className="btn btn-sm btn-danger ms-1"
                  onClick={() => handleRemoveNewItemTag(tag)}
                >
                  x
                </button>
              </span>
            ))}
          </div>
          <button type="submit" className="btn btn-success me-2">
            Agregar Ítem
          </button>
          <button type="button" className="btn btn-secondary" onClick={resetNewItemForm}>
            Cancelar
          </button>
        </div>
      </form>

      <hr />

      <h4>Lista de Ítems</h4>
      <div className="row">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="col-md-4 mb-3">
              <div className="card position-relative">
                {/* Botón del ojito en la esquina superior derecha */}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="position-absolute"
                    style={{ top: "10px", right: "10px", background: "transparent", border: "none", padding: "5px", cursor: "pointer" }}
                  >
                    <i className="fas fa-eye text-dark"></i>
                  </a>
                )}

                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text"><b>Precio:</b> ${Number(item.price).toLocaleString("es-ES")}</p>
                  <p className="card-text"><b>Descripción:</b> {item.description}</p>
                  <p>
                    {item.tags && item.tags.length > 0 ? (
                      item.tags.map((tagName, index) => {
                        const tagData = tags.find((tag) => tag.name === tagName);
                        return tagData ? (
                          <span
                            key={index}
                            className="badge me-2"
                            style={{ backgroundColor: tagData.color, color: "#fff", padding: "5px 10px" }}
                          >
                            {tagData.name}
                          </span>
                        ) : null;
                      })
                    ) : (
                      <span className="text-muted">Sin etiquetas</span>
                    )}
                  </p>

                  <div className="d-flex justify-content-between">
                    <button className="btn btn-warning btn-sm" onClick={() => handleEditItem(item)}>
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item.id)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay ítems disponibles.</p>
        )}
      </div>

      {/* Modal para editar ítem */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Ítem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={(e) => handleEditItemSubmit(e)}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Precio"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <textarea
                className="form-control mb-2"
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="URL (opcional)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

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
                    {tag}
                    <button
                      type="button"
                      className="btn btn-sm btn-danger ms-1"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>

              <button type="submit" className="btn btn-warning me-2">
                Guardar Cambios
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Items;
