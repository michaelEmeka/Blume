import ScrollIndicator from "./components/ScrollIndicator";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Ecosystem from "./components/Ecosystem";
import About from "./components/About";
import Services from "./components/Services";
import Products from "./components/Products";
import Team from "./components/Team";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <ScrollIndicator />
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Ecosystem />
        <About />
        <Services />
        <Products />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
