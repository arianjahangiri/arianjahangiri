"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import NoAuthWrapper from "@/app/commponent/auth/NoAuthWrapper";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // شماره یا ایمیل
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();

  const isEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isPhone = (value) =>
    /^(\+98|0)?9\d{9}$/.test(value);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!identifier) {
      setError("لطفا شماره موبایل یا ایمیل را وارد کنید.");
      return;
    }

    if (!isEmail(identifier) && !isPhone(identifier)) {
      setError("شماره موبایل یا ایمیل وارد شده معتبر نیست.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: isEmail(identifier) ? "email" : "phone",
          identifier,
        }),
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("کد تایید باید 6 رقمی باشد.");
      return;
    }

    setLoading(true);

    const signInData = {
      code: otp,
      redirect: false,
    };
    if (isEmail(identifier)) {
      signInData.email = identifier;
    } else {
      signInData.phone = identifier;
    }

    const result = await signIn("credentials", signInData);

    if (!result.ok) {
      setError(result.error || "خطایی رخ داده است.");
    } else {
      setSuccess("ورود موفقیت آمیز بود.");
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <NoAuthWrapper>
      <div style={{ backgroundColor: "#f9f9f9" }}>
        <Container className="d-flex justify-content-center align-items-center vh-100">
          <Row className="w-100 d-flex justify-content-center align-items-center">
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
                    ورود به سیستم
                  </h2>
                  {error && <Alert variant="danger">{error}</Alert>}
                  {success && <Alert variant="success">{success}</Alert>}
                  {step === 1 && (
                    <Form onSubmit={handleSendOtp}>
                      <Form.Group className="my-4">
                        <Form.Label>شماره موبایل یا ایمیل</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="شماره موبایل یا ایمیل"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value.trim())}
                        />
                      </Form.Group>
                      <Button
                        type="submit"
                        className="w-100"
                        disabled={loading}
                      >
                        {loading ? "در حال ارسال..." : "ارسال کد تایید"}
                      </Button>
                    </Form>
                  )}
                  {step === 2 && (
                    <Form onSubmit={handleLogin}>
                      <Form.Group className="my-4">
                        <Form.Label>کد تایید</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        className="w-100"
                        disabled={loading}
                      >
                        {loading ? "در حال تایید..." : "تایید کد"}
                      </Button>
                    </Form>
                  )}
                </Card.Body>
              </Card>
              <p>
                قبلا ثبت نام نکرده اید : <Link href={"/auth/register"}>ثبت نام</Link>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </NoAuthWrapper>
  );
};

export default Login;
