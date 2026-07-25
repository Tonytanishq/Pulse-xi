import Background from "@/components/landing/Background";
import MouseGlow from "@/components/landing/MouseGlow";
import ParticlesBackground from "@/components/landing/ParticlesBackground";
import FloatingFootball from "@/components/landing/FloatingFootball";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Stats from "@/components/landing/Stats";
import About from "@/components/landing/About";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050816] text-white">
      {/* Ambient layers */}
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <Background />
      <MouseGlow />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-screen">
        <ParticlesBackground />
      </div>

      <Navbar />

      <div className="relative">
        <div className="relative">
          <FloatingFootball />
          <Hero />
        </div>
        <Features />
        <Stats />
        <About />
        <Testimonials />
        <Footer />
      </div>
    </main>
  );
}
