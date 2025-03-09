import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

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
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
        {/* Add additional routes as needed */}
      </Switch>
    </Router>
  );
}

export default App;
