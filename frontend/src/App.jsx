import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookmarksPage from './pages/BookmarksPage'
import { isLoggedIn, getUser, logout } from "./services/auth";
import { useState } from "react";
import "./App.css";

function App() {
  const [loggedIn] = useState(() => isLoggedIn());
  return (
    <div className="d-flex flex-column vh-100 bg-dark" data-bs-theme="dark">
      <header className="navbar navbar-expand bg-dark border-bottom border-secondary-subtle px-4 py-2" data-bs-theme="dark">
        <span className="navbar-brand fw-semibold mb-0">Bookmark Manager</span>
        {loggedIn ? (
          <div className="d-flex align-items-center gap-3 ms-auto">
            <span className="text-secondary small">
              Hello, <span className="text-light">{getUser().username}</span>
            </span>
            <a href={"/u/" + getUser().username} className="btn btn-sm btn-outline-light">My Bookmarks</a>
            <button onClick={logout} className="btn btn-sm btn-outline-secondary">Log out</button>
          </div>
        ) : (
          <div className="d-flex gap-2 ms-auto">
            <a href="/login" className="btn btn-sm btn-outline-light">Log in</a>
            <a href="/register" className="btn btn-sm btn-primary">Register</a>
          </div>
        )}
      </header>
      <main className="flex-grow-1 overflow-auto text-light">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/u/:username" element={<BookmarksPage/>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  )
}

export default App
