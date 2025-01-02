import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import LoadingSpinner from "./components/common/LoadingSpinner";

const apiUrl = "https://twitter-1a5z.onrender.com";

function App() {
	const { data: authUser, isLoading, isError, error } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
		  const res = await fetch(`${apiUrl}/api/auth/me`, {
			credentials: "include", // Ensures cookies are sent with the request
		  });
	  
		  if (!res.ok) {
			const data = await res.json();
			console.error('Error fetching authUser:', data);
			throw new Error(data.error || "Failed to fetch user data");
		  }
	  
		  const data = await res.json();
		  return data;
		},
		retry: false,
	  });
	  

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching authUser:", error.message);
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {/* Sidebar */}
      {authUser && <Sidebar />}

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      {/* Right Panel */}
      {authUser && <RightPanel />}

      {/* Toaster Notifications */}
      <Toaster />
    </div>
  );
}

export default App;
