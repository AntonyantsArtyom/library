import { useState } from "react";

import { BookList } from "./components/BookList/BookList";
import { Filter } from "./components/Filter/Filter";

import "./index.css";

function App() {
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

export default App;
