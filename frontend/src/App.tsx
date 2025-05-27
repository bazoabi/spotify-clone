import { Route, Routes } from "react-router-dom";
// import { Button } from "./components/ui/button";
// import {
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   UserButton,
// } from "@clerk/clerk-react";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { axiosInstance } from "./lib/axios";

function App() {
  // clerk token example
  const getSomeData = async () => {
    const res = await axiosInstance.get("/users", {
      headers: {
        Authorization: `Bearer ${PUBLISHABLE_KEY}`,
      },
    });
    console.log(res);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
      </Routes>
    </>
  );
}

export default App;
