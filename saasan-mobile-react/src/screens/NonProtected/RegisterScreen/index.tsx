import { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, User, Lock, Mail, MapPin, Building, Home } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";

export default function RegisterScreen() {
  const { allProvinces: provinces, districtsByProvinceId: districts, fetchDistrictsByProvinceId: fetchDistricts, constituencyByWardId: constituency, fetchConstituencyByWardId: fetchConstituency, municipalitiesByDistrictId: municipalities, fetchMunicipalitiesByDistrictId: fetchMunicipalities, wardsByMunicipalityId: wards, fetchWardsByMunicipalityId: fetchWards } = useLocation()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    provinceId: "",
    districtId: "",
    constituencyId: "",
    municipalityId: "",
    wardId: ""
  });
  const { register, loading } = useAuthContext();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      // Validate all fields are filled
      const requiredFields = Object.values(formData);
      if (requiredFields.some(field => !field.trim())) {
        alert("Please fill in all fields!");
        return;
      }

      await register(formData);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error instanceof Error ? error.message : "Registration failed. Please try again.");
    }
  };

  useEffect(() => {
    if (formData.provinceId) {
      setFormData((prev) => ({ ...prev, districtId: "", constituencyId: "", municipalityId: "", wardId: "" }))
      fetchDistricts(formData.provinceId);
    }
  }, [formData.provinceId]);

  useEffect(() => {
    if (formData.districtId) {
      setFormData((prev) => ({ ...prev, constituencyId: "", wardId: "", municipalityId: "" }))
      fetchMunicipalities(formData.districtId)
    }
  }, [formData.provinceId, formData.districtId]);

  useEffect(() => {
    if (formData.municipalityId) {
      setFormData((prev) => ({ ...prev, constituencyId: "", wardId: "" }))
      fetchWards(formData.municipalityId)
    }
  }, [formData.provinceId, formData.districtId, formData.municipalityId]);

  useEffect(() => {
    if (formData.wardId) {
      setFormData((prev) => ({ ...prev, constituencyId: "" }))
      fetchConstituency(formData.wardId)
    }
  }, [formData.provinceId, formData.districtId, formData.municipalityId, formData.wardId])

  useEffect(() => {
    if (constituency) {
      setFormData(prev => ({ ...prev, constituencyId: constituency.id }))
    }
  }, [constituency])

  const selectedDistrictName = districts.find((district) => district.id === formData.districtId)?.name;
  let constituencyName = "";
  if (constituency) {
    constituencyName = `${selectedDistrictName} - ${constituency.constituencyNumber}`;
  }
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
              Join In
            </p>
            <p className="text-gray-600 text-xs">
              Sign up to start fighting corruption
            </p>
          </div>

          {/* Registration Form Card */}
          <Card className="shadow-md py-4">
            <CardContent className="p-2 py-0">
              <div className="space-y-3">
                {/* Name Field */}
                <div>
                  <div className="flex items-center mb-1">
                    <User className="text-gray-500 w-4 h-4 mr-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Full Name
                    </p>
                  </div>
                  <Input
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500 h-10"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <div className="flex items-center mb-1">
                    <Mail className="text-gray-500 w-4 h-4 mr-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Email Address
                    </p>
                  </div>
                  <Input
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500 h-10"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                </div>

                {/* Confirm Password Field */}
                <div>
                  <div className="flex items-center mb-1">
                    <Lock className="text-gray-500 w-4 h-4 mr-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </p>
                  </div>
                  <Input
                    type="password"
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500 h-10"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  />
                </div>

                {/* Location Fields Header */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center mb-2">
                    <MapPin className="text-red-600 w-4 h-4 mr-2" />
                    <p className="text-sm font-bold text-gray-800">
                      Your Location in Nepal
                    </p>
                  </div>
                </div>

                {/* Province Field */}
                <div>
                  <div className="flex items-center mb-1">
                    <Building className="text-gray-500 w-4 h-4 mr-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Province
                    </p>
                  </div>
                  <select
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-red-500 focus:ring-red-500 bg-white"
                    value={formData.provinceId}
                    onChange={(e) => handleInputChange("provinceId", e.target.value)}
                  >
                    <option value="">Select Province</option>
                    {provinces.map(province => (
                      <option key={province.id} value={province.id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Field */}
                {formData.provinceId && <div>
                  <div className="flex items-center mb-1">
                    <Home className="text-gray-500 w-4 h-4 mr-2" />
                    <p className="text-sm font-medium text-gray-700">
                      District
                    </p>
                  </div>
                  <select
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-red-500 focus:ring-red-500 bg-white"
                    value={formData.districtId}
                    onChange={(e) => handleInputChange("districtId", e.target.value)}
                    disabled={!formData.provinceId}
                  >
                    <option value="">Select District</option>
                    {districts.map(district => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>}

                {/* Municipality Field */}
                {formData.districtId && <div>
                  <div className="flex items-center mb-1">
                    <Home className="text-gray-500 w-4 h-4 mr-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Municipality
                    </p>
                  </div>
                  <select
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-red-500 focus:ring-red-500 bg-white"
                    value={formData.municipalityId}
                    onChange={(e) => handleInputChange("municipalityId", e.target.value)}
                    disabled={!formData.districtId}
                  >
                    <option value="">Select Municipality</option>
                    {municipalities.map(municipality => (
                      <option key={municipality.id} value={municipality.id}>
                        {municipality.name}
                      </option>
                    ))}
                  </select>
                </div>}

                {/* Ward Field */}
                {formData.municipalityId && <div>
                  <div className="flex items-center mb-1">
                    <Home className="text-gray-500 w-4 h-4 mr-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Ward
                    </p>
                  </div>
                  <select
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-red-500 focus:ring-red-500 bg-white"
                    value={formData.wardId}
                    onChange={(e) => handleInputChange("wardId", e.target.value)}
                    disabled={!formData.municipalityId}
                  >
                    <option value="">Select Ward Number</option>
                    {wards.map(ward => (
                      <option key={ward.id} value={ward.id}>
                        {ward.wardNumber}
                      </option>
                    ))}
                  </select>
                </div>}

                {/* Constituency Field */}
                {formData.wardId && formData.constituencyId && <div>
                  <div className="flex items-center mb-1">
                    <Home className="text-gray-500 w-4 h-4 mr-2" />
                    <p className="text-sm font-medium text-gray-700">
                      Constituency
                    </p>
                  </div>
                  <select
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-red-500 focus:ring-red-500 bg-white disabled:bg-gray-100 hover:disabled:cursor-not-allowed"
                    value={formData.constituencyId}
                    disabled
                  >
                    {formData.constituencyId ? (
                      <option value={constituency?.id}>
                       {constituencyName}
                    </option>) : null}
                    
                  </select>
                </div>}
              </div>

              <div className="mt-4 space-y-3">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 h-10 rounded-md"
                  onClick={handleRegister}
                  disabled={loading}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {loading ? "Creating account..." : "Create Account"}
                </Button>

                <div className="text-center">
                  <Link to="/login" className="text-red-600 hover:text-red-700 text-sm font-medium">
                    Already have an account? Login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-3 bg-blue-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex items-start">
                <MapPin className="text-blue-600 w-4 h-4 mr-2 mt-0.5" />
                <div>
                  <p className="text-blue-800 text-sm font-medium mb-1">
                    Why Location Matters
                  </p>
                  <p className="text-blue-700 text-xs">
                    Your location helps us connect you with the right representatives and show relevant corruption data for your area.
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
