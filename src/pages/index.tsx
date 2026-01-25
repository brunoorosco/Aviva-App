import Header from "@/components/Home/Header";
import Hero from "@/components/Home/Hero";
import MediaSection from "@/components/Home/MediaSection";
import Footer from "@/components/Home/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <MediaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
