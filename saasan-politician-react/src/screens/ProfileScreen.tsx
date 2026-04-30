import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  User,
  Edit,
  X,
  Save,
  Briefcase,
  Award,
  GraduationCap,
  Phone,
  Mail,
  Globe,
  Flag,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import type { AchievementDto, PoliticianDto, PromiseDto } from "@/types/api";

const getEditData = (politician: Partial<PoliticianDto>) => ({
  fullName: politician.fullName || "",
  biography: politician.biography || "",
  email: politician.contact?.email || "",
  phone: politician.contact?.phone || "",
  website: politician.contact?.website || "",
  facebook: politician.socialMedia?.facebook || "",
  twitter: politician.socialMedia?.twitter || "",
  instagram: politician.socialMedia?.instagram || "",
  education: politician.education || "",
  experienceYears: politician.experienceYears || 0,
  profession: politician.profession || "",
});

export const ProfileScreen: React.FC = () => {
  const { data: profilePayload, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const politician = useMemo(
    () => ((profilePayload?.profile as Partial<PoliticianDto>) || {}),
    [profilePayload],
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(() => getEditData(politician));

  useEffect(() => {
    if (!isEditing) {
      setEditData(getEditData(politician));
    }
  }, [isEditing, politician]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        fullName: editData.fullName,
        biography: editData.biography,
        contact: {
          email: editData.email,
          phone: editData.phone,
          website: editData.website,
        },
        socialMedia: {
          facebook: editData.facebook,
          twitter: editData.twitter,
          instagram: editData.instagram,
        },
        education: editData.education,
        experienceYears: Number(editData.experienceYears) || 0,
        profession: editData.profession,
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditData(getEditData(politician));
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="h-32 rounded-lg bg-gray-200 animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-28 rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 mb-6 mx-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold mb-2">Profile</h1>
            <p className="text-indigo-100 text-sm">
              Manage your professional information and public presence
            </p>
          </div>
          <div className="bg-indigo-500 rounded-full p-3">
            <User className="text-white" size={24} />
          </div>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                  <Briefcase className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-indigo-600">
                  {politician.experienceYears || 0}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">
                Experience
              </p>
              <p className="text-indigo-500 text-xs mt-1">Years in service</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-md">
                  <Award className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-orange-600">
                  {politician.achievements?.length || 0}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">
                Achievements
              </p>
              <p className="text-orange-500 text-xs mt-1">Success stories</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                  <GraduationCap className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {politician.education ? 1 : 0}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">
                Education
              </p>
              <p className="text-blue-500 text-xs mt-1">Qualifications</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                  <TrendingUp className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-green-600">
                  {politician.rating ? politician.rating.toFixed(1) : "N/A"}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-3 font-medium">Rating</p>
              <p className="text-green-500 text-xs mt-1">Platform score</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                      <User className="text-white" size={20} />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-800">
                        Personal Information
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Your basic profile details
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                    size="sm"
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    {isEditing ? (
                      <X className="h-4 w-4 mr-1" />
                    ) : (
                      <Edit className="h-4 w-4 mr-1" />
                    )}
                    {isEditing ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <Input
                          value={editData.fullName}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              fullName: e.target.value,
                            })
                          }
                          className="border-indigo-200 focus:border-indigo-400 bg-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Profession
                        </label>
                        <Input
                          value={editData.profession}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              profession: e.target.value,
                            })
                          }
                          className="border-indigo-200 focus:border-indigo-400 bg-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Biography
                      </label>
                      <Textarea
                        value={editData.biography}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            biography: e.target.value,
                          })
                        }
                        rows={4}
                        className="border-indigo-200 focus:border-indigo-400 bg-white"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-gray-300 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={updateProfile.isPending}
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {updateProfile.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <User className="text-white" size={40} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          {politician.fullName}
                        </h3>
                        <p className="text-gray-600 text-lg mb-3">
                          {politician.profession}
                        </p>
                        <div className="flex items-center space-x-3">
                          <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm">
                            Political Leader
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-white shadow-sm border-indigo-300"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Biography
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {politician.biography}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Social Media</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Facebook</label>
                    {isEditing ? (
                      <Input
                        value={editData.facebook}
                        onChange={(e) =>
                          setEditData({ ...editData, facebook: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm">
                        {politician.socialMedia?.facebook || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Twitter</label>
                    {isEditing ? (
                      <Input
                        value={editData.twitter}
                        onChange={(e) =>
                          setEditData({ ...editData, twitter: e.target.value })
                        }
                      />
                    ) : (
                      <p className="text-sm">
                        {politician.socialMedia?.twitter || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Instagram</label>
                    {isEditing ? (
                      <Input
                        value={editData.instagram}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            instagram: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm">
                        {politician.socialMedia?.instagram || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements Section */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {politician.achievements?.length ? (
                  politician.achievements.map((achievement: AchievementDto) => (
                  <div
                    key={achievement.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          {achievement.category}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No achievements added yet.</p>
                )}
              </CardContent>
            </Card>

            {/* Active Promises Section */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Active Promises</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {politician.promises?.length ? (
                  politician.promises.map((promise: PromiseDto) => (
                  <div
                    key={promise.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{promise.title}</h4>
                        <p className="text-sm text-gray-600">
                          {promise.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{promise.status}</Badge>
                        <span className="text-xs text-gray-600 block mt-1">
                          Due: {new Date(promise.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-medium">
                        {promise.progress}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${promise.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No promises added yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">
                      {politician.contact?.email || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">
                      {politician.contact?.phone || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <p className="text-sm text-gray-600">
                      {politician.contact?.website || "Not provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Political Affiliation */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Flag className="h-5 w-5" />
                  <span>Political Affiliation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Party</p>
                    <p className="text-sm text-gray-600">
                      {politician.sourceCategories?.party || "Independent"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Positions</p>
                    <div className="space-y-1">
                      {(politician.sourceCategories?.positions || []).map(
                        (position: string, index: number) => (
                          <p key={index} className="text-sm text-gray-600">
                            • {position}
                          </p>
                        ),
                      )}
                      {!(politician.sourceCategories?.positions || []).length && (
                        <p className="text-sm text-gray-600">No positions listed</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Levels</p>
                    <div className="space-y-1">
                      {(politician.sourceCategories?.levels || []).map(
                        (level: string, index: number) => (
                          <p key={index} className="text-sm text-gray-600">
                            • {level}
                          </p>
                        ),
                      )}
                      {!(politician.sourceCategories?.levels || []).length && (
                        <p className="text-sm text-gray-600">No levels listed</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
