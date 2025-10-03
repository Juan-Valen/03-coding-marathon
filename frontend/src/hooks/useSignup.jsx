import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useSignup(setIsAuthenticated) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const website = import.meta.env.VITE_API_URL || "";
  const url = "/api/users/signup";
  const navigate = useNavigate();

  const signup = async (object) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(website + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(object),
    });
    console.log(website + url);
    const user = await response.json();

    if (!response.ok) {
      console.log("Signup error:", user.error);
      setError(user.error);
      setIsLoading(false);
      return false; // Return false for failure
    }

    localStorage.setItem("user", JSON.stringify(user));
    setIsLoading(false);
    setIsAuthenticated(true);
    navigate("/");
    return true; // Return true for success
  };

  return { signup, isLoading, error };
}
