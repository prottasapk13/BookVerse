import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedBooks from "../components/FeaturedBooks";

function Home({ searchTerm, setSearchTerm }) {
  return (
    <>
      <Hero
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Categories />

      <FeaturedBooks searchTerm={searchTerm} />
    </>
  );
}

export default Home;
