import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookmarksPage from './pages/BookmarksPage'
import { isLoggedIn, getUser, logout } from "./auth";

function App() {
  return (
    <>
      <header>
        {isLoggedIn() ? (
          <>
            Hello {getUser().username}
            <button onClick={logout}>Log out</button>
            <a href={"/u/" + getUser().username}>My Bookmarks</a>
          </>
        ) : (
          <>
            <a href='/login'>login</a>
            <a href='/register'>register</a>
          </>
        )}
      </header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/u/:username" element={<BookmarksPage/>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </main>
    </>
  )
}

export default App
