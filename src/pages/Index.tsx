
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VectorSummarizerForm from '@/components/VectorSummarizerForm';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col background-gradient">
      <div className="container px-4 sm:px-6 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 sm:py-12 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl mx-auto">
            <VectorSummarizerForm />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
