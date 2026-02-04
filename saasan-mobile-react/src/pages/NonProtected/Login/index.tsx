import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      // Alert.alert(
      //   "Login Failed",
      //   error instanceof Error ? error.message : "Please check your credentials"
      // );
    }
  };

  return (
    <div className="flex-1 justify-center px-4 bg-background">
      <div className="bg-card rounded-lg p-6 shadow-md">
        <p className="text-2xl font-bold text-center mb-6 text-foreground">
          Welcome Back
        </p>

        <div className="my-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Email
            </p>
            <Input
              className="bg-input rounded-md px-4 py-2 text-foreground"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              autoComplete="email"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Password
            </p>
            <Input
              className="bg-input rounded-md px-4 py-2 text-foreground"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-4">
          <Button
            className="bg-primary py-3 rounded-md"
            onClick={handleLogin}
            disabled={loading}
          >
            <p className="text-white text-center font-semibold">
              {loading ? "Logging in..." : "Login"}
            </p>
          </Button>

          <Link to="/register" className="mt-4">
            <p className="text-primary text-center">
              Don't have an account? Register
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
