import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser, isLoggedIn, saveUser } from "../services/auth";
import { Modal, Button } from "react-bootstrap";
import { editBookmark, createBookmark, getBookmarks, deleteBookmark } from "../services/bookmarks";
import "./BookmarksPage.css";
import { useNavigate } from "react-router-dom";

import { useColumnCount, distributeIntoColumns } from "../utils/columnLayout";
import { updateIsPublic } from "../services/users";

function BookmarksPage() {
  const [isPublicIndicator, setIsPublicIndicator] = useState(getUser()?.isPublic);
  const navigate = useNavigate();
  const {username} = useParams();
  const [isOwner, setIsOwner] = useState(() => checkIsOwner());
  const [groupedBookmarks, setGroupedBookmarks] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [editingBookmark, setEditingBookmark] = useState(null);
  const columnCount = useColumnCount();
  const columns = distributeIntoColumns(Object.entries(groupedBookmarks), columnCount);

  function handleVisibilityToggle() {
    console.log("b" + getUser());
    const newValue = !isPublicIndicator;
    setIsPublicIndicator(newValue);
    updateIsPublic(newValue);

    const user = getUser();
    user.isPublic = newValue;
    saveUser(user);
    console.log("a" + getUser())
  }

  function checkIsOwner() {
    return isLoggedIn() && getUser().username === username;
  }

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
    .catch(error => {
      setError(error.message);
    })
  }

  function handleEdit(category, title, url) {
    editBookmark(editingBookmark.id, category, title, url)
    .then(() => {
      loadBookmarks();
      closeModal();
    })
    .catch(error => {
      setError(error.message);
    })
  }

  function handleDelete(bookmarkId) {
    deleteBookmark(bookmarkId)
    .then(() => {
      loadBookmarks();
    })
    .catch(error => {
      console.log(error.message);
    })
  };

  function groupBookmarks(bookmarks) {
    return bookmarks.reduce((groups, bookmark) => {
      if (!groups[bookmark.category]) {
        groups[bookmark.category] = [];
      }
      groups[bookmark.category].push(bookmark);
      return groups;
    }, {});
  }

  function loadBookmarks() {
    getBookmarks(username)
    .then((data) => {
      setGroupedBookmarks(groupBookmarks(data));
    })
    .catch(res => {
      if (res.status === 404) {
        navigate("/login")
        return;
      }

      console.log(res);
    });
  }

  function openModal(bookmark) {
    if (bookmark) {
      setEditingBookmark(bookmark);
    }
    else {
      setEditingBookmark(null);
    }
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingBookmark(null)
    setError("");
  }

  useEffect(() => {
    loadBookmarks();
    setIsOwner(checkIsOwner());
  }, [username]);

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-4">
          <h1 className="py-2 h4 fw-semibold mb-0">{username}</h1>
          {isOwner && (
            <div className="form-check form-switch mb-0">
              <input className="form-check-input" type="checkbox" role="switch" id="visibility-switch" checked={isPublicIndicator} onChange={handleVisibilityToggle} />
              <label className="form-check-label small text-secondary" htmlFor="visibility-switch">
                {isPublicIndicator ? "Public" : "Private"}
              </label>
            </div>
          )}
        </div>
        {isOwner && (
          <Button variant="primary" onClick={() => openModal()}>
            Create bookmark
          </Button>
        )}
      </div>
      <Modal show={showModal} onHide={closeModal} centered data-bs-theme="dark">
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton className="bg-dark text-light border-secondary-subtle">
            <Modal.Title>
              {editingBookmark ? "Edit bookmark" : "Create bookmark"}
          </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light">
            <input name="category" type="text" className="form-control my-3" placeholder="Category" defaultValue={editingBookmark?.category || ""} />
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
      <div className="bookmarks-columns">
        {columns.map((column, colIndex) => (
          <div key={colIndex} className="bookmarks-column">
            {column.map(([category, bookmarks]) => (
              <div key={category} className="bookmark-group mb-4">
                <h2 className="h6 fw-semibold mb-2">{category}</h2>
                <hr className="border-secondary-subtle mt-0 mb-2" />
                <div className="d-flex flex-column">
                  {bookmarks.map(bookmark => (
                    <div key={bookmark.id} className="d-flex justify-content-between align-items-center bookmark-row">
                      <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="bookmark-link">
                        {bookmark.title}
                      </a>
                      {isOwner && (
                        <div className="bookmark-actions">
                          <button onClick={() => openModal(bookmark)} className="bookmark-action-btn">
                            ✎
                          </button>
                          <button onClick={() => handleDelete(bookmark.id)} className="bookmark-action-btn bookmark-delete-btn">
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
export default BookmarksPage;
