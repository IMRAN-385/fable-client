import Hero from "../components/Hero";
import FeaturedEbooks from "../components/FeaturedEbooks";
import TopWriters from "../components/TopWriters";
import Genregrid from "../components/Genregrid";

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedEbooks />
      <TopWriters />
      <Genregrid />
    </main>
  );
}

