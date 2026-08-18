import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isLoggedIn } from "../services/auth";
import { Modal, Button } from "react-bootstrap";
import { createBookmark, getBookmarks } from "../services/bookmarks";

function BookmarksPage() {
  const [loggedIn] = useState(() => isLoggedIn());
  const { username } = useParams();
  const [ bookmarks, setBookmarks ] = useState([]);
  const [ showModal, setShowModal ] = useState(false);
  const [ error, setError ] = useState("");

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

  function loadBookmarks() {
    console.log("reload");
    getBookmarks(username)
    .then((data) => {
      setBookmarks(data);
    })
    .catch(error => {
      console.log(error.message);
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
    <>
      <h1>{username}</h1>
        {loggedIn && (
          <>
            <div>
              <Button onClick={() => setShowModal(true)}>Add bookmark</Button>
            </div>
          </>
        )}
      <Modal show={showModal} onHide={closeModal} centered>
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Add bookmark</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input name="category" type="text" className="form-control my-3" placeholder="Category" />
            <input name="title" type="text" className="form-control my-3" placeholder="Title" />
            <input name="url" type="text" className="form-control my-3" placeholder="Url" />
            {error && (
              <>
                <div>
                  {error}
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" type="submit">Add</Button>
          </Modal.Footer>
        </form>
      </Modal>
      <div>
        {bookmarks.map(bookmark => {
          return (
            <>
              <hr />
              <p>{bookmark.category}</p>
              <p>{bookmark.title}</p>
              <p>{bookmark.url}</p>
            </>
          )
        })}
      </div>
    </>
  )
}
export default BookmarksPage;
