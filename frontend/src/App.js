import React, { useState, useEffect } from 'react'; // Import React and hooks
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Import Routes and Route

// Home component to display till cash control info
function Home() {
  const [tillCash, setTillCash] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API (assuming '/till-cash' exists)
    fetch("/till-cash")
      .then((res) => res.json())
      .then((data) => setTillCash(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div>
      <h1>Nightclub Till Cash Control</h1>
      <ul>
        {/* Display till cash items */}
        {tillCash.length > 0 ? (
          tillCash.map((item, index) => (
            <li key={index}>
              {item.name} - ${item.amount}
            </li>
          ))
        ) : (
          <p>No data available</p>
        )}
      </ul>
    </div>
  );
}

// About component (if you want to add an About page)
function About() {
  return (
    <div>
      <h2>About Nightclub Till Cash Control</h2>
      <p>This app helps manage the nightclub till cash flow efficiently.</p>
    </div>
  );
}

// Main App component
function App() {
  const [tillCash, setTillCash] = useState([]);

  useEffect(() => {
    fetch("/till-cash") // Backend API endpoint
      .then((res) => res.json())
      .then((data) => setTillCash(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Nightclub Till Cash Control</h1>} />
        {/* You can add more routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
