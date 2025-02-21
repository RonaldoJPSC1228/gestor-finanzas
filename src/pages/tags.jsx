import React, { useState, useEffect } from "react";

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#000000");
  const [tagDescription, setTagDescription] = useState("");
  const [editTagId, setEditTagId] = useState(null);

  useEffect(() => {
    const storedTags = JSON.parse(localStorage.getItem("tags")) || [];
    setTags(storedTags);
  }, []);

  const saveToLocalStorage = (updatedTags) => {
    localStorage.setItem("tags", JSON.stringify(updatedTags));
    setTags(updatedTags);
  };

  const resetForm = () => {
    setTagName("");
    setTagColor("#000000");
    setTagDescription("");
    setEditTagId(null);
  };

  const handleSaveTag = (e) => {
    e.preventDefault();
    if (!tagName.trim()) return alert("El nombre es obligatorio");

    if (editTagId !== null) {
      const updatedTags = tags.map((tag) =>
        tag.id === editTagId ? { ...tag, name: tagName, color: tagColor, description: tagDescription } : tag
      );
      saveToLocalStorage(updatedTags);
    } else {
      const newTag = {
        id: Date.now(),
        name: tagName,
        color: tagColor,
        description: tagDescription,
      };
      saveToLocalStorage([...tags, newTag]);
    }

    resetForm();
  };

  const handleEditTag = (tag) => {
    setTagName(tag.name);
    setTagColor(tag.color);
    setTagDescription(tag.description);
    setEditTagId(tag.id);
  };

  const handleDeleteTag = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta etiqueta?")) {
      const updatedTags = tags.filter((tag) => tag.id !== id);
      saveToLocalStorage(updatedTags);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Etiquetas</h2>

      <form onSubmit={handleSaveTag}>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre de la etiqueta"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <input
            type="color"
            className="form-control"
            value={tagColor}
            onChange={(e) => setTagColor(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <textarea
            className="form-control"
            rows="2"
            placeholder="Descripción de la etiqueta"
            value={tagDescription}
            onChange={(e) => setTagDescription(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary me-2">
          {editTagId ? "Actualizar Etiqueta" : "Agregar Etiqueta"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={resetForm}>
          Cancelar
        </button>
      </form>

      <hr />

      <h4>Lista de Etiquetas</h4>
      {tags.length > 0 ? (
        <ul className="list-group">
          {tags.map((tag) => (
            <li
              key={tag.id}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ borderLeft: `5px solid ${tag.color}` }}
            >
              <div>
                <strong>{tag.name}</strong>
                <p>{tag.description}</p>
              </div>
              <div>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditTag(tag)}>
                  ✏️ Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTag(tag.id)}>
                  ❌ Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay etiquetas disponibles.</p>
      )}
    </div>
  );
};

export default Tags;
