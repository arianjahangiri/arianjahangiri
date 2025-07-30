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
      setFormError("نام محصول الزامی می‌باشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام محصول باید بین ۳ تا ۳۰ کاراکتر باشد");
      return false;
    }

    if (!image) {
      setFormError("انتخاب تصویر الزامی است");
      return false;
    }

    setFormError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("UrlLink", url);
      formData.append("imageUrl", image);

      const response = await fetch("/api/AdsSection", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setFormError(result.message || "مشکلی در ارسال اطلاعات پیش آمد");
        return;
      }

      // موفقیت: پاکسازی فرم و هدایت
      setName("");
      setUrl("");
      setImage(null);
      router.push("/");

    } catch (err) {
      setError("خطا در ارتباط با سرور");
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2}></Col>
        <Col md={10}>
          <div className="p-4">
            <h2 className="my-4">افزودن اسلایدشو</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {formError && <Alert variant="warning">{formError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>نام</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام اسلاید..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>لینک دلخواه (اختیاری)</Form.Label>
                <Form.Control
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>تصویر</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
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

export default AddImage;
