import { Link } from "react-router-dom";

function Navbar({ setIsAuthenticated, isAuthenticated }) {
  return (
    <nav className="navbar">
      <h1>Job Search</h1>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/add-job">Add Job</Link>
        {isAuthenticated ? (
          <button onClick={() => {
            localStorage.removeItem("user");
            setIsAuthenticated(false);
          }}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;