import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getUser, isLoggedIn, saveUser } from "../services/auth";
import { Button } from "react-bootstrap";
import { getBookmarks, deleteBookmark } from "../services/bookmarks";
import "./BookmarksPage.css";
import { useNavigate } from "react-router-dom";
import { useColumnCount, distributeIntoColumns } from "../utils/columnLayout";
import { updateIsPublic } from "../services/users";
import Favicon from "../components/Favicon";
import SearchBookmarksModal from "../components/SearchBookmarksModal";
import { normalizeUrl } from "../utils/url";
import BookmarkFormModal from "../components/BookmarkFormModal";

function BookmarksPage() {
  const [isPublicIndicator, setIsPublicIndicator] = useState(getUser()?.isPublic);
  const navigate = useNavigate();
  const {username} = useParams();
  const [isOwner, setIsOwner] = useState(() => checkIsOwner());
  const [groupedBookmarks, setGroupedBookmarks] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const columnCount = useColumnCount();
  const columns = distributeIntoColumns(Object.entries(groupedBookmarks), columnCount);

  const bookmarksForSearch = useMemo(() => {
    return Object.values(groupedBookmarks)
      .flat()
      .map(bookmark => ({
        ...bookmark,
        path: bookmark.category ? `${bookmark.category}/${bookmark.title}` : bookmark.title,
      }));
  }, [groupedBookmarks]);


  function handleVisibilityToggle() {
    const newValue = !isPublicIndicator;
    setIsPublicIndicator(newValue);
    updateIsPublic(newValue);

    const user = getUser();
    user.isPublic = newValue;
    saveUser(user);
  }

  function checkIsOwner() {
    return isLoggedIn() && getUser().username === username;
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

    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSearchModal]);

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
      <SearchBookmarksModal show={showSearchModal} setShow={setShowSearchModal} bookmarksForSearch={bookmarksForSearch} />
      <BookmarkFormModal show={showModal} setShow={setShowModal} loadBookmarks={loadBookmarks} editingBookmark={editingBookmark} setEditingBookmark={setEditingBookmark} categories={Object.keys(groupedBookmarks)} />
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
                      <a href={normalizeUrl(bookmark.url)} target="_blank" rel="noopener noreferrer" className="bookmark-link">
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
