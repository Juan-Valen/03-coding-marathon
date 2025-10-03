import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// pages & components
import Home from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage"
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import EditJobPage from "./pages/EditJobPage";
import JobPage from "./pages/JobPage";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : false
    );

    return (
        <div className="App">
            <BrowserRouter>
                <Navbar setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/jobs/:id" element={<JobPage isAuthenticated={isAuthenticated} />} />
                        <Route path="/add-job" element={isAuthenticated ? <AddJobPage /> : <Navigate to="/login" />} />
                        <Route path="/edit-job/:id" element={isAuthenticated ? <EditJobPage /> : <Navigate to="/login" />} />
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
