import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { renameCategory } from "../services/bookmarks";

function CategoryRenameModal({ show, setShow, category, loadBookmarks }) {
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const newCategory = form.get("category");

    renameCategory(category, newCategory)
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
    setError("");
  }

  return (
    <Modal show={show} onHide={closeModal} centered data-bs-theme="dark">
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="bg-dark text-light border-secondary-subtle">
          <Modal.Title>Edit category</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light">
          <input name="category" type="text" className="form-control my-3" placeholder="Category" defaultValue={category || ""} />
          {error && (
            <div className="alert alert-danger py-2 small mb-0">
              {error}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary-subtle">
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" type="submit">Save</Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default CategoryRenameModal;
