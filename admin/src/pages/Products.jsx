/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: "",
    subCategory: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
const API_URL = import.meta.env.VITE_API_URL;
 
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/all-products`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setForm({ ...form, image: file });

      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        if (form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (editingProduct) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/admin/update-product/${editingProduct._id}`,
          formData,
          config
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/admin/create-product`,
          formData,
          config
        );
        toast.success("Product created successfully");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving product");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/delete-product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  
  const handleEdit = (product) => {
    setEditingProduct(product);

    setForm({
      title: product.title,
      category: product.category,
      subCategory: product.subCategory,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: null,
    });

    setPreview(product.image || null);
  };

  const resetForm = () => {
    setForm({
      title: "",
      category: "",
      subCategory: "",
      description: "",
      price: "",
      stock: "",
      image: null,
    });
    setPreview(null);
    setEditingProduct(null);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-600 font-semibold">
        Loading products...
      </div>
    );

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        {editingProduct ? "Edit Product" : "Create New Product"}
      </h2>

      <form
        onSubmit={handleCreateOrUpdate}
        className="flex flex-col gap-4 mb-8 max-w-lg bg-white p-6 rounded shadow"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <input
          type="text"
          name="subCategory"
          placeholder="Sub Category"
          value={form.subCategory}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="border p-2 rounded"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded"
          />
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            {editingProduct ? "Update Product" : "Create Product"}
          </button>

          {editingProduct && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Sub Category</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product, index) => (
              <tr key={product._id} className="border-t">
                <td className="px-4 py-2">{index + 1}</td>

                <td className="px-4 py-2">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>

                <td className="px-4 py-2">{product.title}</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">{product.subCategory}</td>
                <td className="px-4 py-2">₹{product.price}</td>
                <td className="px-4 py-2">{product.stock}</td>

                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;