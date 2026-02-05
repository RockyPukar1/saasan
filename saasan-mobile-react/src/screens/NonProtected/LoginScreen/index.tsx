import { useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User, Lock, AlertCircle } from "lucide-react";

export default function LoginScreen() {
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <div className="flex items-center">
            <p className="text-lg font-bold text-gray-800">Saasan</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-2 py-4">
        <div className="w-full max-w-sm">
          <div className="mb-4 ml-1">
            <p className="text-lg font-bold text-gray-800">
              Welcome Back
            </p>
            <p className="text-gray-600 text-xs">
              Sign in to continue fighting corruption
            </p>
          </div>

          {/* Login Form Card */}
          <Card className="shadow-md">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Email Field */}
                <div>
                  <div className="flex items-center mb-1">
                    <User className="text-gray-500 w-4 h-4 mr-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Email Address
                    </p>
                  </div>
                  <Input
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500 h-10"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center mb-1">
                    <Lock className="text-gray-500 w-4 h-4 mr-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Password
                    </p>
                  </div>
                  <Input
                    type="password"
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500 h-10"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 h-10 rounded-md"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center">
                  <Link to="/register" className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Don't have an account? Register
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-3 bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-start">
                <AlertCircle className="text-blue-600 w-4 h-4 mr-2 mt-0.5" />
                <div>
                  <p className="text-blue-800 text-sm font-medium mb-1">
                    About Saasan
                  </p>
                  <p className="text-blue-700 text-xs">
                    Monitor corruption, track politicians, and survey public opinion in Nepal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
