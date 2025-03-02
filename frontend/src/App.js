import React, { useState, useEffect } from "react";

function App() {
  const [tillCash, setTillCash] = useState([]);

  useEffect(() => {
    fetch("/till-cash")  // Backend API
      .then((res) => res.json())
      .then((data) => setTillCash(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div>
      <h1>Nightclub Till Cash Control</h1>
      <ul>
        {tillCash.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
