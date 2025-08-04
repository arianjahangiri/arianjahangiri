"use client";

import { setComment } from "@/app/home/lib/CommentProduct/setComment";
import { getComment } from "@/app/home/lib/CommentProduct/getComment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Comments = () => {
  const { id } = useParams(); // productId از URL
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState({
    text: "",
    productId: id,
    userId: "",
    isApproval: false,
  });
  const [comments, setComments] = useState([]);

  // وقتی سشن لود شد، userId رو ست کن
  useEffect(() => {
    if (session?.user?.id) {
      setData((prev) => ({
        ...prev,
        userId: session.user.id,
      }));
    }
  }, [session]);

  // گرفتن کامنت‌های محصول
  const fetchComments = async () => {
    try {
      setLoading(true);
      const result = await getComment(id); // فقط کامنت‌های این محصول
      setComments(result);
    } catch (error) {
      console.log("خطا در دریافت کامنت‌ها:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchComments();
  }, [id]);

  // ارسال کامنت
  const handleSendComment = async () => {
    if (!data.text.trim()) {
      alert("متن دیدگاه را وارد کنید.");
      return;
    }

    try {
      setLoading(true);
      await setComment(data.text, data.productId, data.userId, data.isApproval);
      setData((prev) => ({ ...prev, text: "" }));
      setShowModal(false);
      fetchComments(); // رفرش کامنت‌ها
    } catch (error) {
      console.log("خطا در ارسال کامنت:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status !== "authenticated") {
    return (
      <section className="product-comment-body text-center p-4">
        <p>برای ثبت دیدگاه ابتدا وارد حساب کاربری خود شوید.</p>
        <Link href={"/auth/login"}>
          <button className="btn btn-primary">ورود</button>
        </Link>
      </section>
    );
  }

  return (
    <div className="comments-container">
      <section id="comments" className="content-header mt-4 mb-5">
        <h2 className="content-header-title">دیدگاه ها</h2>
      </section>

      <section className="product-comments">
        <section className="comment-add-wrapper text-center mb-4">
          <button
            className="comment-add-button btn btn-outline-primary"
            onClick={() => setShowModal(true)}
          >
            <i className="fa fa-plus"></i> افزودن دیدگاه
          </button>
        </section>

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fa fa-plus"></i> افزودن دیدگاه
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>دیدگاه شما</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="دیدگاه خود را وارد کنید..."
                  value={data.text}
                  onChange={(e) => setData({ ...data, text: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              بستن
            </Button>
            <Button
              variant="primary"
              onClick={handleSendComment}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "ثبت دیدگاه"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* لیست دیدگاه‌ها */}
{comments.length > 0 ? (
  comments
    .filter(comment => comment.isApproval === true)
    .map(comment => (
      <section className="product-comment-list" key={comment._id}>
        <section className="product-comment">
          <section className="product-comment-header d-flex justify-content-between">
            <span className="product-comment-date">
              {comment.createdAt
                ? new Date(comment.createdAt).toLocaleDateString("fa-IR")
                : "تاریخ نامشخص"}
            </span>
            <span className="product-comment-title">
              {comment.userId?.name || "کاربر ناشناس"}
            </span>
          </section>
          <section className="product-comment-body">{comment.text}</section>
        </section>
      </section>
    ))
) : (
  <p className="text-center text-muted mt-3">هیچ دیدگاهی ثبت نشده است.</p>
)}

      </section>
    </div>
  );
};

export default Comments;
