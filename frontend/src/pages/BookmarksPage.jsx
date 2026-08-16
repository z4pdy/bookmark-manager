import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BookmarksPage() {
  const { username } = useParams();
  const [ bookmarks, setBookmarks ] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/bookmarks/" + username).then(async res => {
      if (res.status == 404) {
        const error = await res.json();
        throw new Error(error.message); 
      }
      return res.json()
    }).then((data) => {
      setBookmarks(data);
      console.log(data);
    }).catch(error => {
      console.log(error.message);
    });

  }, []);

  return (
    <>
      <h1>{username}</h1>
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
