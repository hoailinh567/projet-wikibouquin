import { useParams } from "react-router";
import BookDetails from "./components/book_details";
import Footer from "./components/footer";
import Header from "./components/header";

function App() {
  let { isbn } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow">
        <BookDetails isbn={isbn} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
