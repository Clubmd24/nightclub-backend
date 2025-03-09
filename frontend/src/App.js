import React, { useState, useEffect } from "react";  // Add this import

function App() {
  const [tillCash, setTillCash] = useState([]);  // Correctly using useState

  useEffect(() => {
    // Fetch data from the backend API
    fetch("/till-cash")  // Assuming your backend endpoint is '/till-cash'
      .then((res) => res.json())
      .then((data) => setTillCash(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);  // useEffect hook to fetch data on mount

  return (
    <div>
      <h1>Nightclub Till Cash Control</h1>
      <ul>
        {/* Render each item in the tillCash array */}
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
