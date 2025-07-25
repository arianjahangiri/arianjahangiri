"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

const AddImage = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const router = useRouter();

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

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("UrlLink", url);  // ارسال مقدار UrlLink
      formData.append("imageUrl", image);

      // ارسال داده‌ها به API
      const response = await fetch("https://arianjahangiri.vercel.app/api/AdsSection", {
        method: "POST",
        body: formData,
      });

      if (response.status === 400) {
        let message = await response.json();
        setFormError(message.message);
      }

      if (!response.ok) throw new Error("مشکلی در ساخت محصول پیش آمده است");
      router.push("/");  // هدایت به صفحه اصلی پس از موفقیت
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="vh-100"></Col>
        <Col md={10}>
          <  div className="p-4">
            <h2 className="my-4">افزودن محصول</h2>
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
                <Form.Label>آدرس لینک عکس</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="آدرس..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}  // گرفتن آدرس لینک
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
          </  div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddImage;
