
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
            <div className="text-center mb-10">
              <p className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-3 animate-fade-in">
                Vector Summarization Tool
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 animate-slide-up">
                Transform Text into Vector Insights
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '50ms' }}>
                Easily convert your text documents into vector format and generate concise summaries powered by advanced algorithms.
              </p>
            </div>
            
            <VectorSummarizerForm />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
