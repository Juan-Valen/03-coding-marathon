

## Issues Identified

1. **Import Error**: You're importing `link` (lowercase) but using `Link` (uppercase)
2. **JSX Parent Element**: Multiple JSX elements need a single parent wrapper
3. **Unused Import**: The imported `link` isn't being used

## Solutions

Here's the corrected code:

````jsx
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
````

## Key Changes Explained

1. **Fixed Import**: Changed `import { link }` to `import { Link }` - React Router exports `Link` with a capital L
2. **Added Fragment**: Wrapped the Login and Signup links in a React Fragment (`<>...</>`) since JSX expressions must have one parent element
3. **Consistent Naming**: Now using `Link` consistently throughout the component

## Why These Changes Matter

- **Import Case Sensitivity**: JavaScript imports are case-sensitive, and React Router's navigation component is specifically named `Link`
- **JSX Fragment Rule**: In conditional rendering, if you return multiple elements, they must be wrapped in a single parent (Fragment is perfect for this)
- **Component Recognition**: With the correct import, your IDE and React will now recognize `Link` as a valid component

The component should now work correctly for navigation between your routes!

NooaV-M: why does this not work?

GitHub Copilot: The issue with `const website = process.env.API_URL;` not working is because **environment variables in Vite (which your project uses) have a different naming convention**.

In Vite, environment variables must be prefixed with `VITE_` to be accessible in the client-side code.

## The Problem
- `process.env.API_URL` won't work in Vite
- Vite only exposes environment variables that start with `VITE_`

## The Solution
You need to either:

### Option 1: Use the Vite naming convention
Change your environment variable to `VITE_API_URL` and access it like this: 

Using "Replace String in File"


```

```
### Option 2: Use a fallback for development
If you don't have the environment variable set up yet, you can provide a fallback: 

Using "Replace String in File"


```

```
## To set up the environment variable:

1. **Create a `.env` file** in your frontend directory:
```
VITE_API_URL=http://localhost:3000
```

2. **Or set it in your system environment** with the name `VITE_API_URL`

## Key Differences:
- **Vite**: Uses `import.meta.env.VITE_*` instead of `process.env.*`
- **Create React App**: Uses `process.env.REACT_APP_*`
- **Node.js**: Uses `process.env.*` (server-side only)

The `import.meta.env.VITE_API_URL || "http://localhost:3000"` approach I used provides a fallback URL for development, so your app will work even if the environment variable isn't set.

Made changes.

NooaV-M: the useSignup logs (and presumably fetches from) localhost 3000 when it should get localhost 4000 from the frontend .env file, why?

GitHub Copilot: Let me check your `.env` file and `useSignup.jsx` to see what's happening. 

Read [](file:///c%3A/Users/Omistaja/Documents/Dev/3.10%20coding%20marathon/03-coding-marathon/frontend/.env)

Read [](file:///c%3A/Users/Omistaja/Documents/Dev/3.10%20coding%20marathon/03-coding-marathon/frontend/src/hooks/useSignup.jsx)

I found the issue! There are **two problems**:

## Problem 1: Environment Variable Name
Your .env file has `API_URL=http://localhost:4000`, but you're trying to access `import.meta.env.API_URL`. In Vite, environment variables must be prefixed with `VITE_` to be accessible in the client-side code.

## Problem 2: Fallback is Taking Effect
Since `import.meta.env.API_URL` is undefined (because it should be `VITE_API_URL`), the fallback `"http://localhost:3000"` is being used.

## Solutions:

### Fix 1: Update your .env file 

Using "Replace String in File"


```

```
### Fix 2: Update useSignup.jsx to use the correct environment variable name 

Using "Replace String in File"


```

```
Let me also check if `useLogin.jsx` needs the same fix: 

Read [](file:///c%3A/Users/Omistaja/Documents/Dev/3.10%20coding%20marathon/03-coding-marathon/frontend/src/hooks/useLogin.jsx#1-1), lines 1 to 15

Yes, useLogin.jsx also needs the same fix: 

Using "Replace String in File"


```

```
## Summary of Changes:

1. **.env file**: Changed `API_URL` to `VITE_API_URL` 
2. **useSignup.jsx**: Changed `import.meta.env.API_URL` to `import.meta.env.VITE_API_URL`
3. **useLogin.jsx**: Changed `import.meta.env.API_URL` to `import.meta.env.VITE_API_URL`

## Why This Happened:

- **Vite Security**: Vite only exposes environment variables prefixed with `VITE_` to prevent accidental exposure of server-side secrets
- **Fallback Behavior**: Since `import.meta.env.API_URL` was `undefined`, the fallback `"http://localhost:3000"` was always used

**Important**: After making these changes, you'll need to restart your Vite dev server for the environment variable changes to take effect! 

Ran terminal command: npm run dev

Let me check the current directory and run the command from the correct location: 

Ran terminal command: cd "C:\Users\Omistaja\Documents\Dev\3.10 coding marathon\03-coding-marathon\frontend" && npm run dev

Perfect! Now your environment variables should work correctly. After restarting your dev server, `useSignup` should fetch from `http://localhost:4000` instead of `http://localhost:3000`.

You can verify this is working by checking the console log in useSignup.jsx - it should now show `http://localhost:4000/api/users/signup` instead of `http://localhost:3000/api/users/signup`.

Made changes.

NooaV-M: it works now

GitHub Copilot: Great! I'm glad the environment variable fix worked. Now your frontend should be correctly fetching from `http://localhost:4000` as specified in your .env file.

To summarize what we fixed:
- Changed `API_URL` to `VITE_API_URL` in the .env file
- Updated both useSignup.jsx and useLogin.jsx to use `import.meta.env.VITE_API_URL`

This follows Vite's convention of requiring the `VITE_` prefix for client-side environment variables. Your signup and login functionality should now be communicating with the correct backend port!

NooaV-M: write an assesment of the code in useLogin, LoginPage useSignup, SignupPage and the relating minor changes to App.jsx in the style of this document:


# Self-Assessment (Template)

### Example 1: Improving Code Quality

Initially, our `filterJobsBySalary` endpoint was functional but lacked robustness to handle edge cases. Here's the original implementation:  

```javascript
// Filter jobs by salary range
filterJobsBySalary = async (req, res) => {
  try {
    const jobs = await Job.find({
      salary: { $gte: req.query.min, $lte: req.query.max },
    });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

The endpoint worked for requests like:  
`GET http://localhost:4000/api/jobs/salary?min=5000&max=6000`  

However, it failed when:
1. `min` was non-numeric (e.g., `abc`).  
2. `max` was missing from the query.  

To address these issues, we refactored the code to handle edge cases effectively:  

```javascript
// Optimized filterJobsBySalary
filterJobsBySalary = async (req, res) => {
  const minSalary = Number(req.query.min) || 0;
  const maxSalary = Number(req.query.max) || Infinity;

  try {
    const jobs = await Job.find({
      salary: { $gte: minSalary, $lte: maxSalary },
    });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Key Improvements:
- **Default Handling:** Used `Number()` with default values (`0` for `minSalary`, `Infinity` for `maxSalary`) to handle missing or invalid inputs.
- **Resilience:** Ensured the endpoint works for various scenarios, making it more user-friendly and robust.

---

### Example 2: Debugging Route Order in Express

We encountered an issue with routing in our `jobRoutes.js` file. Here's the problematic setup:  

```javascript
// Problematic route order
router.get('/:id', getJobById);
router.get('/salary', filterJobsBySalary);
```

Requests to `/api/jobs/salary` returned "Invalid ID" errors because Express evaluated the dynamic `/:id` route before `/salary`. This happened because Express matches routes in the order they are defined.  

### Solution:
We reordered the routes to prioritize specific routes before dynamic ones:  

```javascript
// Corrected route order
router.get('/salary', filterJobsBySalary); // Specific route comes first
router.get('/:id', getJobById); // Dynamic route follows
router.get('/', getAllJobs);
router.get('/location/:location', getJobsByLocation);
```

**Lessons Learned:**

1. **Route Evaluation in Express:** Routes are matched sequentially. Specific routes (e.g., `/salary`) must be defined before dynamic ones (e.g., `/:id`).  
2. **Testing Matters:** Thorough testing revealed this subtle issue, which could have led to unpredictable behavior in production.  


GitHub Copilot: Let me first examine the relevant files to understand the implementation before writing the assessment. 

Read [](file:///c%3A/Users/Omistaja/Documents/Dev/3.10%20coding%20marathon/03-coding-marathon/frontend/src/hooks/useLogin.jsx)

Read [](file:///c%3A/Users/Omistaja/Documents/Dev/3.10%20coding%20marathon/03-coding-marathon/frontend/src/pages/LoginPage.jsx)

Read [](file:///c%3A/Users/Omistaja/Documents/Dev/3.10%20coding%20marathon/03-coding-marathon/frontend/src/hooks/useSignup.jsx)

Read [](file:///c%3A/Users/Omistaja/Documents/Dev/3.10%20coding%20marathon/03-coding-marathon/frontend/src/pages/SignupPage.jsx#1-1), lines 1 to 50

Read [](file:///c%3A/Users/Omistaja/Documents/Dev/3.10%20coding%20marathon/03-coding-marathon/frontend/src/pages/SignupPage.jsx#45-45), lines 45 to 68

Read [](file:///c%3A/Users/Omistaja/Documents/Dev/3.10%20coding%20marathon/03-coding-marathon/frontend/src/App.jsx)

Read [](file:///c%3A/Users/Omistaja/Documents/Dev/3.10%20coding%20marathon/03-coding-marathon/frontend/.env)

# Self-Assessment: Authentication System Implementation

### Example 1: Resolving Environment Variable Configuration Issues

Initially, our authentication hooks (`useLogin` and `useSignup`) were failing to connect to the correct backend API. Here's the original problematic implementation:

```javascript
// Original implementation with incorrect environment variable access
export default function useLogin(setIsAuthenticated) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const website = process.env.API_URL;  // ❌ Wrong for Vite
  const url = "/api/users/login";
  // ... rest of implementation
}
```

The hooks were consistently fetching from `http://localhost:3000` instead of the intended `http://localhost:4000` specified in our .env file.

**Root Cause Analysis:**
1. **Incorrect Environment Variable Format:** The .env file contained `API_URL=http://localhost:4000` without the required `VITE_` prefix.
2. **Wrong Access Pattern:** Used `process.env.API_URL` instead of Vite's `import.meta.env.VITE_API_URL`.
3. **Fallback Masking the Issue:** The fallback `|| "http://localhost:3000"` was always triggered due to undefined environment variable.

**Solution Implementation:**

```javascript
// Fixed implementation with proper Vite environment variable handling
export default function useLogin(setIsAuthenticated) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const website = import.meta.env.VITE_API_URL || "http://localhost:3000";  // ✅ Correct
  const url = "/api/users/login";
  // ... rest of implementation
}
```

And updated .env file:
```
VITE_API_URL=http://localhost:4000
```

### Key Improvements:
- **Vite Compliance:** Used `VITE_` prefix for client-side environment variables to match Vite's security requirements.
- **Proper Access Pattern:** Switched from `process.env` to `import.meta.env` for Vite compatibility.
- **Consistent Configuration:** Applied the same fix to both `useLogin` and `useSignup` hooks for consistency.

---

### Example 2: Implementing Robust Authentication State Management

Our authentication system required careful state management across multiple components. Here's how we structured the solution:

```javascript
// App.jsx - Central authentication state management
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
            <Route path="/signup" element={<SignupPage setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
            {/* ... other routes */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
```

**Key Design Decisions:**

1. **Persistent Authentication:** Used `localStorage.getItem("user")` to maintain authentication state across browser sessions.
2. **Prop Drilling Strategy:** Passed `setIsAuthenticated` down to login/signup pages for immediate state updates after successful authentication.
3. **Automatic Navigation:** Both hooks include `navigate("/")` to redirect users to the home page after successful authentication.

### Example 3: Comprehensive User Registration Form

The `SignupPage` component demonstrates thorough user data collection:

```javascript
// SignupPage.jsx - Comprehensive user registration
const Signup = ({ setIsAuthenticated }) => {
  const name = useField("text");  
  const email = useField("email");
  const password = useField("password");
  const phoneNumber = useField("text");
  const gender = useField("text");
  const dateOfBirth = useField("date");
  const membershipStatus = useField("text");
  const address = useField("text");
  const profile_picture = useField("text");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await signup({
      email: email.value,
      password: password.value,
      name: name.value,
      phone_number: phoneNumber.value,
      gender: gender.value,
      date_of_birth: dateOfBirth.value,
      membership_status: membershipStatus.value,
      address: address.value,
      profile_picture: profile_picture.value
    });
  };
  // ... form JSX
}
```

**Notable Implementation Features:**
- **Custom Hook Integration:** Leveraged `useField` hook for consistent form field management.
- **Comprehensive Data Collection:** Captured all necessary user profile information in a single registration flow.
- **Error Handling:** Integrated error display with conditional rendering `{error && <div className="error">{error}</div>}`.

### Lessons Learned:

1. **Environment Variable Security:** Vite's `VITE_` prefix requirement prevents accidental exposure of server-side secrets to the client.
2. **State Management Patterns:** Centralized authentication state in the root component enables consistent behavior across the application.
3. **Form Abstraction Benefits:** Using custom hooks like `useField` reduces boilerplate and ensures consistent form field behavior.
4. **Error Boundary Importance:** Proper error handling in authentication flows prevents silent failures and improves user experience.

The authentication system now provides a robust foundation for user management with proper environment configuration, comprehensive error handling, and seamless user experience.
