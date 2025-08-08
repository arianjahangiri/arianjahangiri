"use client"

import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

const ProductGallery = () => {


 const [data, setData] = useState([]);  
  const [IdDelete, setIdDelete] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const route = useRouter();  
  const params = useParams();  
  const productId = params.id;  

 

  const fetchData = async () => {  
    setLoading(true); // شروع بارگذاری  
    try {  
      const jsonData = await getImageGallery(productId);  
      setData(jsonData); // داده‌ها را بر اساس بازگشت مستقیم set کنید  
    } catch (error) {  
      console.error("خطا در fetchData:", error.message);  
      alert("خطا در دریافت داده‌ها");  
    } finally {  
      setLoading(false); // پایان بارگذاری  
    }  
  };  

  useEffect(() => {  
    fetchData();  
  }, []);  

    
    
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