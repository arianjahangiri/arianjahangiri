"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Form, Container, Alert, Spinner } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

const StockListPage = () => {
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("https://arianjahangiri.vercel.appi.vercel.appi.vercel.app/api/product");
      if (!res.ok) throw new Error("خطا در دریافت محصولات");
      const json = await res.json();
      setProducts(json);

      const initialStock = {};
      json.forEach((item) => {
        initialStock[item._id] = item.stock;
      });
      setStock(initialStock);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = async (e, productId) => {
    e.preventDefault();
    const newStock = stock[productId];

    try {
      // دریافت اطلاعات فعلی محصول برای ساخت FormData کامل
      const res = await fetch(`https://arianjahangiri.vercel.appi.vercel.appi.vercel.app/api/product/${productId}`);
      if (!res.ok) throw new Error("خطا در دریافت محصول");
      const product = await res.json();

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("category", product.category);
      formData.append("stock", newStock); // فقط این مقدار تغییر کرده

      // ارسال FormData کامل
      const updateRes = await fetch(`https://arianjahangiri.vercel.appi.vercel.appi.vercel.app/api/product/${productId}`, {
        method: "PUT",
        body: formData,
      });

      if (!updateRes.ok) {
        const errData = await updateRes.json();
        throw new Error(errData.message || "خطا در بروزرسانی موجودی");
      }

      fetchData(); // بارگذاری مجدد لیست
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">ویرایش موجودی محصولات</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>نام محصول</th>
              <th>موجودی فعلی</th>
              <th>موجودی جدید</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.stock}</td>
                <td>
                  <Form.Control
                    type="number"
                    min={0}
                    value={stock[product._id]}
                    onChange={(e) =>
                      setStock((prev) => ({
                        ...prev,
                        [product._id]: parseInt(e.target.value),
                      }))
                    }
                  />
                </td>
                <td>
                  <Button
                    variant="warning"
                    onClick={(e) => handleEdit(e, product._id)}
                  >
                    <FaEdit className="me-2" />
                    ویرایش
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default StockListPage;
