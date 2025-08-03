 
 
import React from 'react';
import SlideShowe from './component/home/SlideShowe';
import AdsSection from './component/home/AdsSection';
import BrandSection from './component/home/BrandSection';
import FeaturedProducts from './component/home/FecherturenProduct';
import CategorySlider from './component/home/Classification/classification';
 

 const page = () => {
  return (
    <  div id="  div-body-one-col" className="  div-body">
    <SlideShowe/>

     
    <section className="container-xxl my-4 ">
      <FeaturedProducts />
    </section>
<section className="container-xxl gap-40 my-4">
      <CategorySlider/>

    </section>
    <section className="container-xxl my-4">
      <AdsSection />
    </section>  
    <section className="container-xxl my-4">
      <BrandSection />
    </section>
    
 
  </  div>
  );
 };
 
 export default page;