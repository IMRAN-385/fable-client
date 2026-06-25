import Hero from "../components/Hero";
import FeaturedEbooks from "../components/FeaturedEbooks";
import TopWriters from "../components/TopWriters";
import GenreGrid, { Genregrid } from "../components/Genregrid";

export default function Home() {
  return (
    <main>
      <Hero />
     <FeaturedEbooks />
     <TopWriters />
      
      <GenreGrid />
    </main>
  );
}

