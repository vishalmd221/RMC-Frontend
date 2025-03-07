import { useState } from "react";

import "./App.css";
import Header from "./Components/Header";

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="p-6 text-center">
          <h2 className="text-2xl font-semibold">
            Welcome to the RMC Blockchain App
          </h2>
        </div>
      </div>
    </>
  );
}

export default App;
