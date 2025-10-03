import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useSignup(setIsAuthenticated) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const website = process.env.API_URL;
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
    const user = await response.json();

    if (!response.ok) {
      console.log(user.error);
      setError(user.error);
      setIsLoading(false);
      return error;
    }

    localStorage.setItem("user", JSON.stringify(user));
    setIsLoading(false);
    setIsAuthenticated(true);
    navigate("/");
  };

  return { signup, isLoading, error };
}
