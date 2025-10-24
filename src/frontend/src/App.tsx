import BookDetail from "./components/bookDetail";
import Footer from "./components/footer";
import Header from "./components/header";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow">
        <BookDetail />
      </main>
      <Footer />
    </div>
  );
}

export default App;
