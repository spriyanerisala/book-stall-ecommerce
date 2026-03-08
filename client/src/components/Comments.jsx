/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";

// Component to display average stars dynamically
const Star = ({ filled }) => (
  <span className={`text-yellow-400 text-xl`} style={{ color: filled ? "#FBBF24" : "#D1D5DB" }}>
    ★
  </span>
);

const AverageRatingStars = ({ avg }) => {
  const fullStars = Math.floor(avg);
  const halfStar = avg - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => <Star key={"f" + i} filled={true} />)}
      {halfStar && <span className="text-yellow-400 text-xl">☆</span>}
      {[...Array(emptyStars)].map((_, i) => <Star key={"e" + i} filled={false} />)}
      <span className="ml-2 text-sm font-semibold">{avg.toFixed(1)} / 5</span>
    </div>
  );
};

const Comments = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0); // optional
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);

  const token = localStorage.getItem("token");
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  // Fetch comments and calculate average rating
  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/comments/${productId}`);

      // Sort: user's comment first
      const sortedComments = data.comments.sort((a, b) => {
        if (a.userId?._id === loggedUser?._id) return -1;
        if (b.userId?._id === loggedUser?._id) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setComments(sortedComments);

      // Calculate average rating from all comments with ratings
      const ratings = data.comments
        .filter(c => c.rating && c.rating > 0)
        .map(c => c.rating);

      const avg = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
        : 0;

      setAvgRating(avg);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  const userComment = comments.find(c => c.userId?._id === loggedUser?._id);

  // Add comment
  const addComment = async () => {
    if (!token) return alert("Login first");
    if (!text.trim()) return alert("Comment cannot be empty");
    if (rating < 0 || rating > 5) return alert("Rating must be 1 to 5 stars");

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/comments/${productId}`,
        { text, rating: rating || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setText("");
      setRating(0);
      fetchComments();
    } catch (err) {
      console.error("Add comment error:", err.response || err);
    }
  };

  // Update comment
  const updateComment = async (id, newText, newRating) => {
    if (!newText.trim()) return alert("Comment cannot be empty");
    if (newRating < 0 || newRating > 5) return alert("Rating must be 1 to 5 stars");

    try {
      await axios.put(
        `http://localhost:5000/api/comments/${id}`,
        { text: newText, rating: newRating || undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditId(null);
      setEditText("");
      setEditRating(0);
      fetchComments();
    } catch (err) {
      console.error("Update comment error:", err.response || err);
    }
  };

  // Delete comment
  const deleteComment = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/comments/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchComments();
    } catch (err) {
      console.error("Delete comment error:", err.response || err);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-3">Comments & Ratings</h2>

      {/* Average rating stars */}
      {avgRating > 0 && (
        <div className="mb-4">
          <span className="font-semibold mr-2">Average Rating:</span>
          <AverageRatingStars avg={avgRating} />
        </div>
      )}

      {/* Show add-comment form only if user hasn't commented yet */}
      {!userComment && (
        <div className="flex flex-col gap-2 mb-6 border p-4 rounded shadow-sm">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Write your comment..."
          />

          <div className="flex items-center gap-2">
            <span>Rate this product (optional 1-5):</span>
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border p-1 w-16 rounded"
            />
          </div>

          <button
            onClick={addComment}
            className="bg-indigo-600 text-white px-4 py-2 rounded w-32"
          >
            Submit
          </button>
        </div>
      )}

      {/* Comments list */}
      <div className="flex flex-col gap-3">
        {comments.map((c) => {
          const isOwner = c.userId?._id === loggedUser?._id;

          return (
            <div key={c._id} className="bg-gray-100 p-3 rounded">
              <p className="font-semibold">{c.userId?.name || "User"}</p>
              <p>{c.text}</p>
              {c.rating ? <p>Rating: {c.rating}/5</p> : null}

              {isOwner && (
                <div className="flex gap-2 mt-2">
                  {editId === c._id ? (
                    <>
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="border p-1 rounded w-full mb-1"
                      />
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={editRating}
                        onChange={(e) => setEditRating(Number(e.target.value))}
                        className="border p-1 w-20 rounded"
                      />
                      <button
                        onClick={() => updateComment(c._id, editText, editRating)}
                        className="text-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditId(null);
                          setEditText("");
                          setEditRating(0);
                        }}
                        className="text-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditId(c._id);
                          setEditText(c.text);
                          setEditRating(c.rating || 0);
                        }}
                        className="text-blue-500 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteComment(c._id)}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
