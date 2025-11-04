import { Route, Routes } from "react-router";
import BookDetails from "./BookDetails";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import MyProfile from "./MyProfile";
import UserProfile from "./UserProfile";
import MyCollection from "./MyCollection";
import { AuthProvider } from "../context/AuthContext";

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
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-collection" element={<MyCollection />} />
            <Route path="/profile/:username" element={<UserProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
