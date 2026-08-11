import Hero from "../components/Hero";
import FeaturedBooks from "../components/FeaturedBooks";

function Home({ searchTerm, setSearchTerm }) {
  return (
    <>
      <Hero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <FeaturedBooks searchTerm={searchTerm} />
    </>
  );
}

export default Home;