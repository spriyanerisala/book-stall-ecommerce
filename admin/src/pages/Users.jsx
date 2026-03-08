
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get( `${import.meta.env.VITE_API_URL}/api/admin/get-all-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-600 font-semibold">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-blue-50 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 sm:mb-6">Users</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-blue-200 rounded-lg">
          <thead className="bg-blue-100 text-blue-700">
            <tr>
              <th className="py-2 px-4 border-b text-center">S.No</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <UserCard key={user._id} user={user} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;