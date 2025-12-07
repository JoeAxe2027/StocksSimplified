// client/src/App.jsx

import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>StocksSimplified</h1>
      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>
          count is {count}
        </button>
        <p>
          Temporary test UI  we will plug in the real Navbar/pages/routes here
          later.
        </p>
      </div>
    </>
  );
}

export default App;
