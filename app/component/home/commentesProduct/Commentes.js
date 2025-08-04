"use client";

import { setComment } from "@/app/home/lib/CommentProduct/setComment";
import { getComment } from "@/app/home/lib/CommentProduct/getComment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Comments = () => {
  const { id } = useParams();
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

  // تنظیم userId بعد از لود سشن
  useEffect(() => {
    if (session?.user?.id) {
      setData((prev) => ({
        ...prev,
        userId: session.user.id,
      }));
    }
  }, [session]);

  // دریافت کامنت‌ها
  const fetchComments = async () => {
    try {
      setLoading(true);
      const result = await getComment(id);
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
      fetchComments();
    } catch (error) {
      console.log("خطا در ارسال کامنت:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status !== "authenticated") {
    return (
      <section className="text-center p-6 bg-gray-100 rounded-lg">
        <p className="text-gray-700 mb-4">برای ثبت دیدگاه ابتدا وارد حساب کاربری خود شوید.</p>
        <Link href={"/auth/login"}>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            ورود
          </button>
        </Link>
      </section>
    );
  }

  return (
    <div className="comments-container max-w-3xl mx-auto px-4">
      {/* Header */}
      <section className="mt-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">دیدگاه ها</h2>
      </section>

      {/* Add Comment Button */}
      <section className="text-center mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2 mx-auto"
        >
          <i className="fa fa-plus"></i> افزودن دیدگاه
        </button>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">افزودن دیدگاه</h3>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="4"
              placeholder="دیدگاه خود را وارد کنید..."
              value={data.text}
              onChange={(e) => setData({ ...data, text: e.target.value })}
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                بستن
              </button>
              <button
                onClick={handleSendComment}
                className={`px-4 py-2 rounded-lg text-white ${
                  loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={loading}
              >
                {loading ? "در حال ارسال..." : "ثبت دیدگاه"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <section className="space-y-4">
        {comments.length > 0 ? (
          comments
            .filter((comment) => comment.isApproval === true)
            .map((comment) => (
              <div
                key={comment._id}
                className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex justify-between mb-2 text-gray-600 text-sm">
                  <span>
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleDateString("fa-IR")
                      : "تاریخ نامشخص"}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {comment.userId?.name || "کاربر ناشناس"}
                  </span>
                </div>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))
        ) : (
          <p className="text-center text-gray-500">هیچ دیدگاهی ثبت نشده است.</p>
        )}
      </section>
    </div>
  );
};

export default Comments;
