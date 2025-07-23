"use client"

import Image from 'next/image';
import React, { useState } from 'react';

const ProductGallery = () => {



    const images = [
        '/images/single-product/1.jpg',
        '/images/single-product/2.jpg',
        '/images/single-product/3.jpg',
        '/images/single-product/4.jpg',
        '/images/single-product/5.jpg',
      ];
    
      const [selectedImage, setSelectedImage] = useState(images[0]);

    return (
        <section className="col-md-4">
      <section className="content-wrapper bg-white p-3 rounded-2 mb-4">
        <section className="product-gallery">
          
          <section className="product-gallery-selected-image mb-3">
            <Image
              src={selectedImage}
              alt="Selected Product"
              width={500}
              height={500}
              className="w-100 rounded"
            />
          </section>
          <section className="product-gallery-thumbs d-flex gap-2 flex-wrap">
            {images.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={100}
                height={100}
                className="product-gallery-thumb rounded border cursor-pointer"
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </section>
        </section>
      </section>
    </section>
    );
};

export default ProductGallery;