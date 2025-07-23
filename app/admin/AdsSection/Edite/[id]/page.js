"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

const UpdateAds = () => {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [Url, setUrl] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/AdsSection/${id}`);
        const data = await res.json();
        setName(data.name || "");
        setUrl(data.UrlLink || "");
        setCurrentImage(data.imageUrl || "");
      } catch (err) {
        setError("خطا در دریافت اطلاعات تبلیغ");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const validateForm = () => {
    if (!name || name.trim().length < 3 || name.length > 30) {
      setFormError("نام باید بین ۳ تا ۳۰ کاراکتر باشد");
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
      formData.append("UrlLink", Url);
      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(`/api/AdsSection/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.status === 400) {
        const msg = await res.json();
        setFormError(msg.message);
        return;
      }

      if (!res.ok) throw new Error("ویرایش انجام نشد");

      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>در حال بارگذاری...</div>;

  return (
    <Container fluid>
      <Row>
        <Col md={2}></Col>
        <Col md={10}>
          <  div className="p-4">
            <h2 className="my-4">ویرایش تبلیغ</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {formError && <Alert variant="warning">{formError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>نام</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام تبلیغ"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>لینک هدایت</Form.Label>
                <Form.Control
                  type="text"
                  value={Url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>تصویر جدید</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                {currentImage && (
                  <div className="mt-3">
                    <img
                      src={currentImage}
                      alt="تبلیغ فعلی"
                      style={{ maxWidth: "300px", borderRadius: "10px" }}
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

export default UpdateAds;
