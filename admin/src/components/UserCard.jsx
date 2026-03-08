
import React from "react";

const UserCard = ({ user, index }) => {
  return (
    <tr className="hover:bg-blue-50 transition">
      <td className="py-2 px-4 border-b text-center">{index + 1}</td>
      <td className="py-2 px-4 border-b text-blue-700 font-semibold">{user.name}</td>
      <td className="py-2 px-4 border-b text-blue-600">{user.email}</td>
     
    </tr>
  );
};

export default UserCard;