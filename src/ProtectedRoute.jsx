import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const ProtectedRoute = ({ requiredRole }) => {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        if (requiredRole) {
          // Fetch role from profiles table
          const { data, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          console.log("Role from database:", data?.role);
          console.log("Error if any:", error);

          setUserRole(data?.role || "USER");
        } else {
          // No role required, user is authenticated
          setUserRole("USER");
        }
      }

      setLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => subscription.unsubscribe();
  }, [requiredRole]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log(
      "❌ Access denied. User role:",
      userRole,
      "Required:",
      requiredRole
    );
    return <Navigate to="/dashboard" replace />;
  }

  console.log("✅ Access granted. User role:", userRole);
  return <Outlet />;
};

export default ProtectedRoute;
