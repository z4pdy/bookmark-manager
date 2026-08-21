import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isLoggedIn } from "../services/auth";
import { Modal, Button } from "react-bootstrap";
import { createBookmark, getBookmarks, deleteBookmark } from "../services/bookmarks";
import "./BookmarksPage.css";
import { useNavigate } from "react-router-dom";

import { useColumnCount, distributeIntoColumns } from "../utils/columnLayout";

function BookmarksPage() {
  const navigate = useNavigate();

  const [loggedIn] = useState(() => isLoggedIn());
  const {username} = useParams();
  const [groupedBookmarks, setGroupedBookmarks] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const columnCount = useColumnCount();
  const columns = distributeIntoColumns(Object.entries(groupedBookmarks), columnCount);

  function handleSubmit(e) {
    e.preventDefault();

    const form = new FormData(e.target);

    createBookmark(form.get("category"), form.get("title"), form.get("url"))
    .then(() => {
      loadBookmarks();
      setShowModal(false);
    })
    .catch(error => {
      setError(error.message);
    })
  };

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

  function closeModal() {
    setShowModal(false);
    setError("");
  }

  useEffect(() => {
    loadBookmarks();
  }, []);

  return (
    <div className="container-fluid px-4 py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="py-2 h4 fw-semibold mb-0">{username}</h1>
        {loggedIn && (
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Create bookmark
          </Button>
        )}
      </div>

      <Modal show={showModal} onHide={closeModal} centered data-bs-theme="dark">
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton className="bg-dark text-light border-secondary-subtle">
            <Modal.Title>Create bookmark</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-light">
            <input name="category" type="text" className="form-control my-3" placeholder="Category" />
            <input name="title" type="text" className="form-control my-3" placeholder="Title" />
            <input name="url" type="text" className="form-control my-3" placeholder="Url" />
            {error && (
              <div className="alert alert-danger py-2 small mb-0">
                {error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="bg-dark border-secondary-subtle">
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" type="submit">Create</Button>
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
                  {bookmarks.map((bookmark, index) => (
                    <div key={index} className="d-flex justify-content-between align-items-center bookmark-row">
                      <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="bookmark-link">
                        {bookmark.title}
                      </a>
                      {loggedIn && (
                        <div className="bookmark-actions">
                          <button onClick={() => handleEdit(bookmark)} className="bookmark-action-btn">
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
