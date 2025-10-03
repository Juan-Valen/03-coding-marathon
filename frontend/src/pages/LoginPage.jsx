import useField from "../hooks/useField";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const email = useField("text");
    const password = useField("password");

    const { login, error } = useLogin(setIsAuthenticated);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await login({ email: email.value, password: password.value });
        if (!error) {
            console.log("success");
            navigate("/");
        }
    };

    return (
        <div className="create">
            <h2>Login</h2>
            <form onSubmit={handleFormSubmit}>
                <label>Email:</label>
                <input {...email} />
                <label>Password:</label>
                <input {...password} />
                {error && <div className="error">{error}</div>}
                <button>Login</button>
            </form>
        </div>
    );
};

export default Login;
