import React, { useState, useEffect } from 'react';  // Ensure this import is correct

function App() {
  const [tillCash, setTillCash] = useState([]);

  useEffect(() => {
    useEffect(() => {
      fetch('/till-cash')
        .then((response) => response.json())
        .then((data) => {
          console.log("API Response:", data); // ✅ Log the response
          setTillCash(data);
        })
        .catch((error) => console.error("Error fetching till cash:", error));
  }, []);

  return (
    <div>
      <h1>Nightclub Till Cash Control</h1>
      <ul>
        {tillCash.length > 0 ? (
          tillCash.map((item, index) => (
            <li key={index}>
              {item.name || "Unknown"} - ${item.amount || "0.00"}
            </li>
          ))
        ) : (
          <p>No data available.</p>
        )}
      </ul>
    </div>
  );
}

export default App;