import React, { useState, useEffect } from 'react';  // Ensure this import is correct

function App() {
  const [tillCash, setTillCash] = useState([]);  // Correctly using useState

  useEffect(() => {
    fetch('/till-cash')
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Till Cash Data:", data); // Debugging log
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