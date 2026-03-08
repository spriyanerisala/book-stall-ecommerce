/* eslint-disable no-unused-vars */
// src/components/ProductCard.jsx
import React from "react";

const ProductCard = ({ product, index, onEdit, onDelete }) => {
  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      <td className="px-4 py-2 text-center">{index + 1}</td>
      <td className="px-4 py-2">{product.title || "-"}</td>
      <td className="px-4 py-2">{product.category || "-"}</td>
      <td className="px-4 py-2">{product.subCategory || "-"}</td>
      <td className="px-4 py-2 text-right">{product.price != null ? product.price : "-"}</td>
      <td className="px-4 py-2 text-right">{product.stock != null ? product.stock : 0}</td>
      <td className="px-4 py-2 flex gap-2 justify-center">
        <button
          onClick={() => onEdit(product)}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ProductCard;