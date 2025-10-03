import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useLogin(setIsAuthenticated) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const website = process.env.API_URL;
  const url = "/api/users/login";
  const navigate = useNavigate();

  const login = async (object) => {
    setIsLoading(true);
    setError(null);
    const response = await fetch(website + url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(object),
    });
    const user = await response.json();

    if (!response.ok) {
      setError(user.error);
      setIsLoading(false);
      return error;
    }

    // localStorage.setItem("token", user.token);
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoading(false);
    setIsAuthenticated(true);
    navigate("/");
  };

  return { login, isLoading, error };
}