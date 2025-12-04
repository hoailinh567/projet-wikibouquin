import { Route, Routes } from "react-router";
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
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
