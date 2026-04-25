import { Route, Routes } from "react-router-dom";
import BookDetails from "./BookDetails";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import UserProfile from "./UserProfile";
import EditMyCollection from "./EditMyCollection";
import { AuthProvider } from "../context/AuthContext";
import Account from "./Account";
import Research from "./Research";
import NewArrival from "./NewArrival";
import NotFound from "./Errors/NotFound";
import AboutUs from "./AboutUs";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book/:isbn" element={<BookDetails />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/account" element={<Account />} />
            <Route path="/edit-my-collection" element={<EditMyCollection />} />
            <Route path="/profile/:username" element={<UserProfile />} />
            <Route path="/research" element={<Research />} />
            <Route path="/new-arrival" element={<NewArrival />} />
            <Route path="/about-us" element={<AboutUs />} />
            {/* wildcard redirect vers /404 pour toutes les routes inconnues */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
