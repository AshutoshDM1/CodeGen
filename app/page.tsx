'use client';
import { useEffect } from 'react';
import MainPage from '@/components/Landing-components/MainPage';
import Connect from '@/components/Landing-components/Connect';
import Footer from '@/components/Landing-components/Footer';
import ProductsSection from '@/components/Landing-components/ProductsSection';
import VideoFeatures from '@/components/Landing-components/VideoFeatures';
import FeatureSection from '@/components/Landing-components/FeatureSection';
import AgentFeatures from '@/components/Landing-components/AgentFeatures ';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
      touchMultiplier: 2,
      touchInertiaMultiplier: 2,
    });
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <main className="w-full h-full bg-black ai-chat-scrollbar">
        <MainPage />
        <VideoFeatures />
        <FeatureSection />
        <ProductsSection />
        <AgentFeatures />
        <Connect />
        <Footer />
      </main>
    </>
  );
}
