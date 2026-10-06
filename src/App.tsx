import { BookList } from "./components/BookList/BookList";
import { Filter } from "./components/Filter/Filter";
import "./index.css";

function App() {
  return (
    <div>
      <Filter />
      <BookList />
    </div>
  );
}

export default App;
