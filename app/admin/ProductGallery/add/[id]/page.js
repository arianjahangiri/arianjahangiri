"use client";

import { setImageGallery } from "@/app/home/lib/ProductGallery/Setimage";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

const AddImageGallery = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
 
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const params = useParams();
  const  PoroductID=params.id
  const validateForm = () => {
    if (!name || name.trim() === "") {
      setFormError("نام محصول الزامی میباشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام محصول باید بین ۳ تا ۳۰ باشد");
      return false;
    }

    if (!image) {
      setFormError("انتخاب تصویر الزامی میباشد");
      return false;
    }

    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
console.log("hi");
console.log(PoroductID);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("ProductID", PoroductID);
 
      formData.append("imageUrl", image);

      // ارسال داده‌ها به API
 
      const response = await  setImageGallery(formData,PoroductID)
          
        
      if (response.status === 400) {
        let message = await response.json();
        setFormError(message.message);
      }

      if (!response.ok) throw new Error("مشکلی در ساخت عکس پیش آمده است");
      router.push("/admin/product/post");

    } catch (error) {
      setError(error.message);
      console.log(error);
      
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="vh-100"></Col>
        <Col md={10}>
          <div className="p-4">
            <h2 className="my-4">افزودن عکس  محصول</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {formError && <Alert variant="warning">{formError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>نام</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="نام ..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
   
         

              <Form.Group className="mb-3">
                <Form.Label>تصویر</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Form.Group>

              <Button type="submit">ذخیره</Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddImageGallery;
