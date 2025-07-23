"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2, FiEdit3, FiPlus } from "react-icons/fi";

const AddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newAddress, setNewAddress] = useState("");
  const [editingValue, setEditingValue] = useState("");
  const [error, setError] = useState(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/User_address", { method: "GET" });
      const data = await res.json();
      setAddresses(data);
    } catch {
      setError("خطا در دریافت آدرس‌ها");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const addAddress = async () => {
    if (!newAddress.trim()) return;
    try {
      const res = await fetch(`/api/User_address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: newAddress }),
      });
      if (!res.ok) throw new Error();
      setNewAddress("");
      fetchAddresses();
    } catch {
      alert("خطا در افزودن آدرس");
    }
  };

  const deleteAddress = async (address) => {
    try {
      const res = await fetch(`/api/User_address`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (!res.ok) throw new Error();
      fetchAddresses();
    } catch {
      alert("خطا در حذف آدرس");
    }
  };

  const editAddress = async (oldAddress, newAddress) => {
    if (!newAddress.trim()) return;
    try {
      const res = await fetch(`/api/User_address`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldAddress, newAddress }),
      });
      if (!res.ok) throw new Error();
      setEditingValue("");
      setNewAddress("");
      fetchAddresses();
    } catch {
      alert("خطا در ویرایش آدرس");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold mb-4">مدیریت آدرس‌ها</h1>

        <div className="flex gap-2">
          <input
            type="text"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="آدرس جدید را وارد کنید"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
          />
          <button
            onClick={addAddress}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white flex items-center gap-1"
          >
            <FiPlus />
            افزودن
          </button>
        </div>

        {loading ? (
          <div className="text-center py-6">در حال بارگذاری...</div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-6 text-gray-400">هیچ آدرسی یافت نشد</div>
        ) : (
          <div className="space-y-4">
            {addresses && addresses.address.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 p-4 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">{item}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => deleteAddress(item)}
                      className="text-red-500"
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      onClick={() => {
                        setEditingValue(item);
                        setNewAddress(item);
                      }}
                      className="text-yellow-400"
                    >
                      <FiEdit3 />
                    </button>
                  </div>
                </div>

                {editingValue === item && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newAddress}
                      onChange={(e) => setNewAddress(e.target.value)}
                      placeholder="آدرس جدید"
                      className="flex-1 px-3 py-1 rounded-lg bg-gray-800 text-white"
                    />
                    <button
                      onClick={() => editAddress(item, newAddress)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-white"
                    >
                      ثبت
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressManager;
