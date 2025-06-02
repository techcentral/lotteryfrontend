import React, { useEffect, useState } from "react";
import Login from "./auth/Login";
import axios from "axios";

export default function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [username, setUsername] = useState("");
  const [price, setPrice] = useState("");
  const [tickets, setTickets] = useState([]);

  const API = "https://your-backend-url.onrender.com/api";

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${API}/tickets`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets");
    }
  };

  const sellTicket = async () => {
    try {
      await axios.post(`${API}/tickets`, { username, price }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsername("");
      setPrice("");
      if (role === "admin") fetchTickets();
    } catch (err) {
      alert("Error selling ticket");
    }
  };

  useEffect(() => {
    if (role === "admin") fetchTickets();
  }, [role]);

  if (!role) return <Login onLogin={setRole} />;

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome {role}</h2>
      <button onClick={() => { localStorage.clear(); setRole(null); }}>Logout</button>
      <hr />
      <h3>Sell Ticket</h3>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <button onClick={sellTicket}>Sell</button>

      {role === "admin" && (
        <>
          <h3>All Tickets</h3>
          <ul>
            {tickets.map((t, i) => (
              <li key={i}>{t.username} - ${t.price}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
