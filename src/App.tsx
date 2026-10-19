import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { BookList } from "./components/BookList/BookList";
import { Filter } from "./components/Filter/Filter";
import { AdminCatalog } from "./components/Admin/AdminCatalog";
import { AdminManage } from "./components/Admin/AdminManage";
import { AdminRatings } from "./components/Admin/AdminRatings";

import "./index.css";

function MainApp() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genres, setGenres] = useState<string[]>([]);

  return (
    <div>
      <Filter title={title} author={author} genres={genres} onTitleChange={setTitle} onAuthorChange={setAuthor} onGenresChange={setGenres} />

      <BookList title={title} author={author} genres={genres} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div style={{ padding: "var(--ant-padding-md)" }}>
        <div style={{ marginBottom: "var(--ant-padding-lg)", display: "flex", justifyContent: "center", gap: "var(--ant-padding-md)" }}>
          <Link to="/">Библиотека</Link>
          <Link to="/admin/catalog">Админка: Каталог</Link>
          <Link to="/admin/manage">Админка: Управление</Link>
          <Link to="/admin/ratings">Админка: Рейтинг</Link>
        </div>

        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/admin/catalog" element={<AdminCatalog />} />
          <Route path="/admin/manage" element={<AdminManage />} />
          <Route path="/admin/ratings" element={<AdminRatings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
