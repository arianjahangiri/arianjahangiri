"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

const UpdateProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState("");  
  const [UrlLink, setUrlLink] = useState("");

  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  // Fetch product details by ID
  useEffect(() => {
    if (!id) {
      setError("شناسه محصول معتبر نیست");
      setLoading(false);
      return;
    }
    console.log(id);

    const fetchImageSlideShow = async () => {
      setLoading(true);
      try {
        const slidResponse = await fetch(`/api/SlideShow/${id}`);
        if (!slidResponse.ok) {
          throw new Error("خطا در دریافت داده‌ها");
        }
        const slidData = await slidResponse.json();
        setName(slidData.name || "");  // Handling undefined or empty name
        setCurrentImage(slidData.imageUrl || "");
      } catch (error) {
        setError("مشکلی در دریافت محصول پیش آمده است");
      } finally {
        setLoading(false);
      }
    };

    fetchImageSlideShow();
  }, [id]);

  // Form validation logic
  const validateForm = () => {
    if (!name || name.trim() === "") {
      setFormError("نام محصول الزامی میباشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام محصول باید بین ۳ تا ۳۰ باشد");
      return false;
    }

    setFormError("");
    return true;
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("UrlLink", UrlLink);

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(`/api/SlideShow/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.status === 400) {
        let message = await response.json();
        setFormError(message.message);
      }

      if (!response.ok) throw new Error("مشکلی در ویرایش محصول پیش آمده است");

      router.push("/");  // Redirect after successful update
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle loading state
  if (loading) {
    return <div>در حال بارگذاری...</div>;  // You can replace this with a spinner component or a loading animation
  }

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="vh-100"></Col>
        <Col md={10}>
          <  div className="p-4">
            <h2 className="my-4">ویرایش محصول</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {formError && <Alert variant="warning">{formError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>نام محصول</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="نام محصول را وارد کنید"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label> لینک</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="نام لینک را وارد کنید"
                  value={UrlLink}
                  onChange={(e) => setUrlLink(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>تصویر</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                {currentImage && (
                  <div>
                    <img
                      src={currentImage}
                      alt={name}
                      style={{ maxWidth: "200px", marginBottom: "10px" }}
                    />
                  </div>
                )}
              </Form.Group>

              <Button type="submit">ذخیره</Button>
            </Form>
          </  div>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateProduct;
