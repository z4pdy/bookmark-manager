import Fuse from "fuse.js";
import { useState, useMemo, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { normalizeUrl } from "../utils/url";
import Favicon from "../components/Favicon";

function SearchBookmarksModal({ show, setShow, bookmarksForSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fuse = useMemo(() => {
    return new Fuse(bookmarksForSearch, {
      keys: ["path"],
      threshold: 0.35,
      ignoreLocation: true,
    });
  }, [bookmarksForSearch]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return bookmarksForSearch;
    }

    return fuse.search(searchQuery).map(result => result.item);
  }, [searchQuery, fuse, bookmarksForSearch]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (!show) return;

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
  }, [show, searchResults, selectedIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);


  function closeSearchModal() {
    setShow(false);
    setSearchQuery("");
  }

  return (
    <Modal show={show} onHide={closeSearchModal} data-bs-theme="dark" dialogClassName="search-modal-dialog">
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
              <a key={bookmark.id} href={normalizeUrl(bookmark.url)} target="_blank" rel="noopener noreferrer"
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
  );
}

export default SearchBookmarksModal;
