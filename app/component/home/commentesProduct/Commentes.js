"use client";
import { setComment } from "@/app/home/lib/CommentProduct/setComment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getToken } from "next-auth/jwt";
import { getComment } from "@/app/home/lib/CommentProduct/getComment";

const Comments = () => {
  const { id: productID } = useParams();
  const { data: session, status } = useSession();
 

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState({
    text: "",
    productId: "",
    userId: "",
    isApproval: false,
  });
 const [dataFetch,setDataFetch]=useState()

  useEffect(() => {
    if (session?.user?.id && productID) {
      setData((prev) => ({
        ...prev,
        userId: session.user.id,
        productId: productID,
      }));
    }
  }, [session, productID]);
 
  const fetchSendComment = async () => {

    try {
      setLoading(true);
      await setComment(data.text, data.productId, data.userId, data.isApproval);
      setData((prev) => ({ ...prev, text: "" }));
      setShowModal(false); // بستن مودال بعد از ثبت دیدگاه
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
 
       const fetchComment = async () => {

    try {
      setLoading(true);
 
          const data =  await getComment(productID); 
      setDataFetch(data);
      setShowModal(false); // بستن مودال بعد از ثبت دیدگاه
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
 
 
  useEffect(() => {
    if (productID) {
      fetchComment();
    }
  }, [productID]);
// console.log(session);
 console.log(dataFetch);

  if (loading) return <div>در حال بارگذاری...</div>;

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

        {/* Modal with react-bootstrap */}
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
            <Button variant="primary" onClick={fetchSendComment}>
              ثبت دیدگاه
            </Button>
          </Modal.Footer>
        </Modal>
{dataFetch&& dataFetch.map((comment)=>{ return(
      <section className="product-comment-list" key={comment._id}>
          <section className="product-comment">
            <section className="product-comment-header d-flex justify-content-between">
              <span className="product-comment-date">۲۱ مرداد ۱۴۰۰</span>
              <span className="product-comment-title"> {comment.userId.name}</span>
            </section>
            <section className="product-comment-body">
       {comment.text}
            </section>
          </section>
        </section>
        )
   })}
        {/* لیست دیدگاه‌ها (ثابت یا بعداً داینامیک) */}
    
      </section>
    </div>
  );
};

export default Comments;
