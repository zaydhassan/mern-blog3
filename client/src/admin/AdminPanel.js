import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminPanel.css";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import Swal from "sweetalert2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, blogsRes] = await Promise.all([
          axios.get("/api/v1/admin/users"),
          axios.get("/api/v1/admin/blogs"),
        ]);

        setUsers(usersRes.data.users || []);
        setBlogs(blogsRes.data.blogs || []);
       
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Logout Function
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        window.location.href = "/login"; // Redirect to login
      }
    });
  };

  const handleDeleteBlog = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/v1/blog/delete-blog/${id}`);
        setBlogs(blogs.filter((blog) => blog._id !== id));
        Swal.fire("Deleted!", "The blog has been removed.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to delete the blog", "error");
      }
    }
  };

  // Ban User Function
  const handleBanUser = async (id) => {
    const result = await Swal.fire({
      title: "Ban User?",
      text: "This user will be banned from the platform!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Ban",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`/api/v1/admin/ban-user/${id}`);
        setUsers(users.filter((user) => user._id !== id));
        Swal.fire("User Banned!", "The user is now banned.", "success");
      } catch (error) {
        Swal.fire("Error", "Failed to ban the user", "error");
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li>Users</li>
          <li>Blogs</li>
          <li className="logout-btn" onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="content">
        <h1>Admin Panel</h1>

        {/* Charts */}
        <div className="charts">
          <div className="chart">
            <h3>User Roles</h3>
            <Pie
              data={{
                labels: ["Reader", "Writer", "Admin"],
                datasets: [
                  {
                    data: [
                      users.filter((u) => u.role === "Reader").length,
                      users.filter((u) => u.role === "Writer").length,
                      users.filter((u) => u.role === "Admin").length,
                    ],
                    backgroundColor: ["#3498db", "#e74c3c", "#f1c40f"],
                  },
                ],
              }}
            />
          </div>
          <div className="chart">
            <h3>Blog Categories</h3>
            <Bar
              data={{
                labels: [...new Set(blogs.map((blog) => blog.category))],
                datasets: [
                  {
                    label: "Number of Blogs",
                    data: [...new Set(blogs.map((blog) => blog.category))].map(
                      (cat) => blogs.filter((b) => b.category === cat).length
                    ),
                    backgroundColor: "#1abc9c",
                  },
                ],
              }}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="table-section">
          <h2>Manage Users</h2>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="ban-btn" onClick={() => handleBanUser(user._id)}>Ban</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Blogs Table */}
        <div className="table-section">
          <h2>Manage Blogs</h2>
          <table>
            <thead>
              <tr>
              <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>{blog.title}</td>
                  <td>{blog.status}</td>
                  <td>
                  <button className="delete-btn" onClick={() => handleDeleteBlog(blog._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;