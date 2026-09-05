import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { editBookmark, createBookmark } from "../services/bookmarks";

function BookmarkFormModal({ show, setShow, loadBookmarks, editingBookmark, setEditingBookmark, categories }) {
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    if (editingBookmark) {
      handleEdit(form.get("category"), form.get("title"), form.get("url"))
    }
    else {
      handleCreate(form.get("category"), form.get("title"), form.get("url"))
    }
  };

  function handleCreate(category, title, url) {
    createBookmark(category, title, url)
    .then(() => {
      loadBookmarks();
      closeModal();
    })
    .catch(err => {
      setError(err.message);
    })
  }

  function handleEdit(category, title, url) {
    editBookmark(editingBookmark.id, category, title, url)
    .then(() => {
      loadBookmarks();
      closeModal();
    })
    .catch(err => {
      setError(err.message);
    })
  }

  function closeModal() {
    setShow(false);
    setEditingBookmark(null)
    setError("");
  }

  return (
    <Modal show={show} onHide={closeModal} centered data-bs-theme="dark">
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="bg-dark text-light border-secondary-subtle">
          <Modal.Title>
            {editingBookmark ? "Edit bookmark" : "Create bookmark"}
        </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <input name="category" type="text" className="form-control my-3" placeholder="Category" 
            defaultValue={editingBookmark?.category || ""} list="category-options" autoComplete="off"
          />
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
          <input name="title" type="text" className="form-control my-3" placeholder="Title" defaultValue={editingBookmark?.title || ""} />
          <input name="url" type="text" className="form-control my-3" placeholder="Url" defaultValue={editingBookmark?.url || ""} />
          {error && (
            <div className="alert alert-danger py-2 small mb-0">
              {error}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary-subtle">
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" type="submit">
            {editingBookmark ? "Edit" : "Create"}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default BookmarkFormModal;
