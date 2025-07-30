"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // اضافه شده ایمیل
  const [Image_profile, setImage_profile] = useState(null);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || name.trim().length < 3 || name.trim().length > 30) {
      setError("نام و نام خانوادگی باید بین 3 تا 30 کاراکتر باشد.");
      return;
    }

    if (!email || !emailRegex.test(email)) {
      setError("ایمیل وارد شده معتبر نیست.");
      return;
    }

    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      setError("شماره تلفن وارد شده صحیح نیست.");
      return;
    }

    setLoading(true);

    try {
      // ارسال با استفاده از FormData به جای JSON
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("type", "register");

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        body: formData,
        // **هدر Content-Type را ننویسید**
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "خطایی سمت سرور رخ داده است.");
      } else {
        setSuccess("کد تایید برای شما ارسال شد.");
        setStep(2);
      }
    } catch (error) {
      setError("خطایی رخ داده است.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("کد تایید باید 6 رقمی باشد.");
      return;
    }

    if (!Image_profile) {
      setError("تصویر پروفایل را انتخاب کنید.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email); // اضافه شده ایمیل به فرم دیتا
    formData.append("code", otp);
    formData.append("Image_profile", Image_profile);

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "خطا در ثبت‌نام");
      } else {
        setSuccess("ثبت‌نام موفقیت‌آمیز بود");
        router.push("/");
      }
    } catch (err) {
      setError("خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full" style={{ backgroundColor: "#f9f9f9" }}>
      <Container className="d-flex justify-content-center align-items-center w-full">
        <Row className="w-full d-flex justify-content-center align-items-center">
          <Col md={6} lg={4}>
            <Card
              className="shadow py-3"
              style={{ borderRadius: "10px", border: "none" }}
            >
              <Card.Body>
                <h2
                  className="text-center mb-4 fw-bolder"
                  style={{ color: "#212529" }}
                >
                  ثبت نام در سیستم
                </h2>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                {step === 1 && (
                  <Form onSubmit={handleSendOtp}>
                    <Form.Group className="mb-3">
                      <Form.Label>تصویر</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage_profile(e.target.files[0])}
                      />
                    </Form.Group>
                    <Form.Group className="my-4">
                      <Form.Label>نام و نام خانوادگی</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="نام و نام خانوادگی"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="my-4">
                      <Form.Label>ایمیل</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="ایمیل"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Form.Group>
                    <Form.Group className="my-4">
                      <Form.Label>شماره تلفن</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="شماره تلفن"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </Form.Group>
                    <Button type="submit" className="w-100" disabled={loading}>
                      {loading ? "در حال ارسال..." : "ثبت نام"}
                    </Button>
                  </Form>
                )}
                {step === 2 && (
                  <Form onSubmit={handleVerifyOtp}>
                    <Form.Group className="my-4">
                      <Form.Label>کد تایید</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </Form.Group>

                    <Button type="submit" className="w-100" disabled={loading}>
                      {loading ? "در حال تایید..." : "تایید کد"}
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
