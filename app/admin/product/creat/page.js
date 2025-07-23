"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:3000/api/categories/home-menu")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
          console.log(categories);
          
          
        } else {
          setError("داده‌ها به درستی بارگذاری نشدند");
        }
      })
      .catch(() => setError("مشکلی در دریافت دسته‌بندی‌ها رخ داده است"));
  }, []);

  const validateForm = () => {
    if (name.trim() === "") {
      setFormError("نام دسته‌بندی الزامی است");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام دسته‌بندی باید بین ۳ تا ۳۰ کاراکتر باشد");
      return false;
    } else if (!price || price <= 0) {
      setFormError("قیمت باید مقدار معتبر باشد");
      return false;
    } else if (!stock || stock < 0) {
      setFormError("موجودی باید عددی معتبر باشد");
      return false;
    } else if (!category) {
      setFormError("لطفا یک دسته‌بندی انتخاب کنید");
      return false;
    }
    setFormError("");
    return true;
  };
  console.log(categories
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("image", image);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);

      const response = await fetch("http://localhost:3000/api/product", {
        method: "POST",
        body: formData,
      });
      router.push("/admin/product/post");

      if (!response.ok) {
        const message = await response.json();
        setFormError(message.message || "مشکلی در ذخیره محصول پیش آمده است");
      } else {
        // Redirect to another page or show success message
      }
    } catch (error) {
      setError("خطایی رخ داده است، لطفاً دوباره تلاش کنید");
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
                <Form.Label>توضیحات</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="توضیحات ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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

              <Form.Group className="mb-3">
                <Form.Label>قیمت</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="30000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>موجودی</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="3"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>دسته‌بندی</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  {Array.isArray(categories) &&
                    categories.map((cat) => (
                    
                      <option key={cat._id} value={cat._id}>
                        {cat.title}
                      </option>
                    ))}
                    
                </Form.Select>
              </Form.Group>

              <Button type="submit" >ذخیره</Button>
            </Form>
          </  div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddCategory;
