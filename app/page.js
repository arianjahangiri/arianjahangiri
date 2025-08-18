import React from 'react';
import SlideShowe from './component/home/SlideShowe';
import AdsSection from './component/home/AdsSection';
import BrandSection from './component/home/BrandSection';
import FeaturedProducts from './component/home/FecherturenProduct';
import CategorySlider from './component/home/Classification/classification';

const page = () => {
  return (
    <div id="div-body-one-col" className="div-body bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Hero Slideshow Section */}
      <section className="relative">
        <SlideShowe />
        {/* Decorative overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/80 to-transparent pointer-events-none"></div>
      </section>

      {/* Featured Products Section */}
      <section className="container-xxl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
          <FeaturedProducts />
        </div>
      </section>

      {/* Category Slider Section */}
      <section className="container-xxl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CategorySlider />
      </section>

      {/* Ads Section */}
      <section className="container-xxl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
          <AdsSection />
        </div>
      </section>

      {/* Brand Section */}
      <section className="container-xxl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-16">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
          <BrandSection />
        </div>
      </section>

      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default page;
