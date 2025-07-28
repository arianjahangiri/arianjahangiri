"use client";

import { getslideshowImage } from '@/app/home/lib/owlcarousel/getslideshowImage';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const SlideShowe = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getslideshowImage();
        setData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container py-4">
        <div className="row g-3">
          {/* Skeleton Slideshow */}
          <div className="col-md-8">
            <div className="w-100 h-[400px] bg-gray-200 animate-pulse rounded-2"></div>
          </div>

          {/* Skeleton Thumbnails */}
          <div className="col-md-4">
            <div className="d-flex flex-column gap-3">
              <div className="w-100 h-[200px] bg-gray-200 animate-pulse rounded-2"></div>
              <div className="w-100 h-[200px] bg-gray-200 animate-pulse rounded-2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row g-3">
        {/*   div Slideshow */}
        <div className="col-md-8">
          <div id="slideshow" className="owl-carousel owl-theme">
            {data.map((item) => (
              <div className="item" key={item._id}>
                <a className="d-block w-100 text-decoration-none" href="#">
                  <Image
                    width={800}
                    height={400}
                    className="img-fluid rounded-2"
                    src={item.imageUrl}
                    alt={item.name || "slideshow image"}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="col-md-4">
          <div className="d-flex flex-column gap-3">
            <a href="#" className="d-block">
              <Image
                width={400}
                height={200}
                className="img-fluid rounded-2"
                src="/images/slideshow/12.gif"
                alt="thumbnail"
              />
            </a>
            <a href="#" className="d-block">
              <Image
                width={400}
                height={200}
                className="img-fluid rounded-2"
                src="/images/slideshow/11.jpg"
                alt="thumbnail"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideShowe;
