import React, { useEffect, useState } from 'react';

function App() {
  const [tillCash, setTillCash] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://nightclubapp-56121564c956.herokuapp.com/till-cash')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("API Response:", data);
      setTillCash(data);
    })
    .catch(error => {
      console.error("Error fetching till cash:", error);
      setError("Error fetching till cash data. Please try again.");
    });
}, []);

  return (
    <div>
      <h1>Nightclub Till Cash Control</h1>
      {tillCash.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <ul>
          {tillCash.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  ); // ✅ Ensure this closing bracket exists
}

export default App; // ✅ Ensure this export exists
