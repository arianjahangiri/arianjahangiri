"use client";
 
import { useParams, useRouter } from "next/navigation";
import React, {   useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

const UpdateProduct = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [discount, setdiscount] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
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
        const productResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${id}` );
        const productData = await productResponse.json();
        setName(productData.name);
        setDescription(productData.description);
        setPrice(productData.price);
        setStock(productData.stock);
        setCategory(productData.category);
        setCurrentImage(productData.imageUrl);

        const categoriesResponse = await fetch(` ${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/home-menu`);
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } catch (error) {
        setError("مشکلی در دریافت محصول پیش آمده است");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const validateForm = () => {
    if (!name || name.trim() === "") {
      setFormError("نام محصول الزامی میباشد");
      return false;
    } else if (name.length < 3 || name.length > 30) {
      setFormError("نام محصول باید بین ۳ تا ۳۰ باشد");
      return false;
    }

    if (!description || description.trim() === "") {
      setFormError("توضیحات محصول الزامی میباشد");
      return false;
    } else if (description.length < 3 || description.length > 500) {
      setFormError("توضیحات محصول باید بین ۳ تا ۵۰۰ باشد");
      return false;
    }

    if (price <= 0) {
      setFormError("قیمت محصول باید یک مقدار مثبت باشد");
      return false;
    }
    if (stock < 0) {
      setFormError("موجودی محصول باید بزرگ تر از ۰ باشد");
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
    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("stock", stock);
      formData.append("category", category);
      if (image) {
        formData.append("imageUrl", image);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${id}` , {
        method: "PUT",
        body: formData,
      });

      if (response.status === 400) {
        let message = await response.json();
        setFormError(message.message);
      }

      if (!response.ok) throw new Error("مشکلی در ویرایش محصول پیش آمده است");
       router.push("/admin/product/post");

    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return  
  }
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="vh-100">
   
        </Col>
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
                  placeholder={""}
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
                <Form.Label>درصد تخفیف</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="0"
                  value={discount}
                  onChange={(e) => setdiscount(e.target.value)}
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
                <Form.Label>دسته بندی</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">انتخاب دسته بندی</option>
                  {categories.map((cat) => {
                    return (
                      <option key={cat._id} value={cat._id}>
                        {cat.title}
                      </option>
                    );
                  })}
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
