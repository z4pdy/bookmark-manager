import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getUser, isLoggedIn, saveUser } from "../services/auth";
import { Modal, Button } from "react-bootstrap";
import { editBookmark, createBookmark, getBookmarks, deleteBookmark } from "../services/bookmarks";
import "./BookmarksPage.css";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";

import { useColumnCount, distributeIntoColumns } from "../utils/columnLayout";
import { updateIsPublic } from "../services/users";
import Favicon from "../components/Favicon";

function BookmarksPage() {
  const [isPublicIndicator, setIsPublicIndicator] = useState(getUser()?.isPublic);
  const navigate = useNavigate();
  const {username} = useParams();
  const [isOwner, setIsOwner] = useState(() => checkIsOwner());
  const [groupedBookmarks, setGroupedBookmarks] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const columnCount = useColumnCount();
  const columns = distributeIntoColumns(Object.entries(groupedBookmarks), columnCount);

  const allBookmarks = useMemo(() => {
    return Object.values(groupedBookmarks)
      .flat()
      .map(bookmark => ({
        ...bookmark,
        path: bookmark.category ? `${bookmark.category}/${bookmark.title}` : bookmark.title,
      }));
  }, [groupedBookmarks]);

  const fuse = useMemo(() => {
    return new Fuse(allBookmarks, {
      keys: ["path"],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, [allBookmarks]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return allBookmarks;
    }

    return fuse.search(searchQuery).map(result => result.item);
  }, [searchQuery, fuse, allBookmarks]);

  function handleVisibilityToggle() {
    const newValue = !isPublicIndicator;
    setIsPublicIndicator(newValue);
    updateIsPublic(newValue);

    const user = getUser();
    user.isPublic = newValue;
    saveUser(user);
  }

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

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

  function handleDelete(bookmarkId) {
    deleteBookmark(bookmarkId)
    .then(() => {
      loadBookmarks();
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
    .catch(err => {
      if (err.status === 403 || err.status === 404) {
        navigate("/login")
        return;
      }
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

  function closeSearchModal() {
    setShowSearchModal(false);
    setSearchQuery("");
  }

  useEffect(() => {
    loadBookmarks();
    setIsOwner(checkIsOwner());
  }, [username]);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowSearchModal(true);
        return;
      }

      if (!showSearchModal) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const selectedBookmark = searchResults[selectedIndex];
        if (selectedBookmark) {
          window.open(selectedBookmark.url, "_blank", "noopener,noreferrer");
          closeSearchModal();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSearchModal, searchResults, selectedIndex]);

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
        <div className="d-flex align-items-center gap-3">
          <button className="search-trigger" onClick={() => setShowSearchModal(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span className="search-trigger-text">Search bookmarks</span>
            <kbd className="search-trigger-kbd">Ctrl K</kbd>
          </button>
          {isOwner && (
            <Button variant="primary" onClick={() => openModal()}>
              Create bookmark
            </Button>
          )}
        </div>
      </div>

      <Modal show={showSearchModal} onHide={closeSearchModal} data-bs-theme="dark" dialogClassName="search-modal-dialog">
        <div className="search-modal-box">
          <div className="d-flex align-items-center gap-2 px-3 py-2 border-bottom border-secondary-subtle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              className="form-control bg-dark text-light border-0 shadow-none"
              placeholder="Search category/title..."
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
            <div className="search-results">
              {searchResults.length === 0 ? (
                <div className="search-results-empty">No results found</div>
              ) : (
              searchResults.map((bookmark, index) => (
                <a key={bookmark.id} href={bookmark.url} target="_blank" rel="noopener noreferrer" 
                  className={`search-result-item ${index === selectedIndex ? "search-result-item-active" : ""}`}
                >
                  <Favicon url={bookmark.url} />
                  <span className="search-result-path">{bookmark.path}</span>
                </a>
              ))
            )}
          </div>
        </div>
      </Modal>

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
                        <Favicon url={bookmark.url} />
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
