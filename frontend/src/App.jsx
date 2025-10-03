import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// pages & components
import Home from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage"
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add-job" element={<AddJobPage />} />
              <Route path="/signup" element={<SignupPage setIsAuthenticated={setIsAuthenticated} />} />
              <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
              <Route path='*' element={<NotFoundPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    );
  }
  
  export default App;
