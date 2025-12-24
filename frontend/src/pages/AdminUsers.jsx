import { useEffect, useState } from "react";
import "./AdminUsers.css";

function AdminUsers() {

  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    fetch("http://localhost/DBMS/backend/api/admin_users.php")
      .then(res => res.json())
      .then(data => setUsers(data.data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = (userID, role) => {
    fetch("http://localhost/DBMS/backend/api/admin_users.php", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID, role })
    })
      .then(res => res.json())
      .then(() => fetchUsers());
  };

  return (
    <div className="admin-users-page">
      <h1>User Management</h1>
      <p>View and assign system user roles.</p>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Names</th>
            <th>Email</th>
            <th>Role</th>
            <th>Update</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.userID}>
              <td>{u.userID}</td>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>

              <td>
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u.userID, e.target.value)}
                >
                  <option value="passenger">passenger</option>
                  <option value="crew">crew</option>
                  <option value="admin">admin</option>
                </select>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
