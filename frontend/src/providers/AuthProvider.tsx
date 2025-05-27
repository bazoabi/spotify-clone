import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import React, { useEffect } from "react";

const updateApiToken = async (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// This component initializes the authentication state and updates the API token
// based on the user's authentication status.
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        await updateApiToken(token);
        console.log("Token retrieved and API configured:", token);
      } catch (error) {
        console.error("Error retrieving and updating token:", error);
        updateApiToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader className="size-8 animate-spin h-10 w-10 text-blue-500" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
