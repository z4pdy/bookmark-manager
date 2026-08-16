import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BookmarksPage from './pages/BookmarksPage'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/u/:username" element={<BookmarksPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
