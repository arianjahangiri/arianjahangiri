"use client";

import { getslideshowImage } from '@/app/home/lib/owlcarousel/getslideshowImage';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
      <div className="container py-4 animate-fade-in">
        <div className="row g-3">
          {/* Skeleton Slideshow */}
          <div className="col-md-8">
            <Skeleton
              height={400}
              borderRadius="12px"
              baseColor="#e0e0e0"
              highlightColor="#f5f5f5"
            />
          </div>

          {/* Skeleton Thumbnails */}
          <div className="col-md-4">
            <div className="d-flex flex-column gap-3">
              <Skeleton
                height={200}
                borderRadius="12px"
                baseColor="#e0e0e0"
                highlightColor="#f5f5f5"
              />
              <Skeleton
                height={200}
                borderRadius="12px"
                baseColor="#e0e0e0"
                highlightColor="#f5f5f5"
              />
            </div>
          </div>
        </div>

        <style jsx>{`
          .animate-fade-in {
            animation: fadeIn 0.6s ease-in-out;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
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
