"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

const UpdateProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/ProductGallery/${id}`);
        const arr = await res.json();
         

        setName(arr.name ?? "");
        setCategory(arr.ProductID?.toString() ?? "");
        setCurrentImage(arr.imageUrl ?? "");

        const catsRes = await fetch("/api/product");
        const cats = await catsRes.json();
        setCategories(Array.isArray(cats) ? cats : []);
      } catch (err) {
        setError("مشکلی در دریافت محصول پیش آمده است");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const validateForm = () => {
    if (!name.trim()) {
      setFormError("نام محصول الزامی میباشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام محصول باید بین ۳ تا ۳۰ باشد");
      return false;
    }
    if (!category) {
      setFormError("دسته بندی محصول باید باشد");
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
      formData.append("name", name.trim());
      formData.append("ProductID", category);
      if (image) formData.append("imageUrl", image);

      const response = await fetch(`/api/ProductGallery/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.status === 400) {
        const data = await response.json();
        setFormError(data.message);
        return;
      }
      if (!response.ok) throw new Error("مشکلی در ویرایش محصول پیش آمده است");

      router.push("/admin/product/post");

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="vh-100">{/* Sidebar */}</Col>
        <Col md={10}>
          <  div className="p-4">
            <h2 className="my-4">ویرایش محصول</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {formError && <Alert variant="warning">{formError}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>نام</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="نام محصول"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

              <Form.Group className="mb-3">
                <Form.Label>دسته بندی</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">انتخاب دسته بندی</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
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
