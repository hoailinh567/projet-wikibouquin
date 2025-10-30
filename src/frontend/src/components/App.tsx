import { Route, Routes } from "react-router";
import BookDetails from "./BookDetails";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:isbn" element={<BookDetails />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
