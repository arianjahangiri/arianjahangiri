"use client";
import { getAdsImage } from "@/app/home/lib/AdsSection/GetAds";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const AdsSection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdsImage = async () => {
      try {
        const data = await getAdsImage();
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdsImage();
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
        {loading
          ? [1, 2].map((_, i) => (
              <div
                key={i}
                className="w-full h-[200px] bg-gray-200 animate-pulse rounded-xl"
              ></div>
            ))
          : data.map((res, index) => (
              <div key={index} className="w-full h-[200px] relative rounded-xl overflow-hidden">
                <a
                  href={res.UrlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={res.name}
                >
                  <image
                    src={res.imageUrl}
                    alt={res.name}
                  
                    className="object-cover w-full h-full"
                    sizes="(max-width: 768px) 100vw, 50vw"
               
                  />
                </a>
              </div>
            ))}
      </div>
    </section>
  );
};

export default AdsSection;
