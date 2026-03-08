// src/components/OrderCard.jsx
import React from "react";

const OrderCard = ({ order, index }) => {
  return (
    <tr className="border-b border-blue-200 hover:bg-blue-50 transition">
      <td className="px-4 py-2 text-blue-700 font-semibold">{index + 1}</td>
      <td className="px-4 py-2 text-blue-600">{order.user.name}</td>
      <td className="px-4 py-2 text-blue-600">{order.user.email}</td>
      <td className="px-4 py-2 text-blue-600">{order.user.address || "-"}</td>
      <td className="px-4 py-2 text-blue-600">
        {order.items.map((item) => `${item.title} x ${item.quantity}`).join(", ")}
      </td>
      <td className="px-4 py-2 text-blue-600">
        {order.currency} {order.totalAmount}
      </td>
      <td className="px-4 py-2 text-blue-600">{order.paymentStatus}</td>
      <td className="px-4 py-2 text-blue-600">{order.orderStatus}</td>
      <td className="px-4 py-2 text-blue-600">
        {new Date(order.createdAt).toLocaleString()}
      </td>
    </tr>
  );
};

export default OrderCard;