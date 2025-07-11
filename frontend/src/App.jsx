import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [ping, setPing] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/ping").then((res) => {
      setPing(res.data.message);
    });
  }, []);

  return (
    <div className="App">
      <h1>Welcome to CodeNova 🚀</h1>
      <p>Backend says: {ping}</p>
    </div>
  );
}

export default App;

