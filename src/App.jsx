import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedBooks from "./components/FeaturedBooks";
import Footer from "./components/Footer";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Navbar />

      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <FeaturedBooks searchTerm={searchTerm} />

      <Footer />
    </>
  );
}

export default App;