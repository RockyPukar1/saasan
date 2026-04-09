import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, Globe, Edit, Award, Target } from "lucide-react";
import type { PoliticianDto } from "@/types/api";
import { dummyPolitician } from "@/data/dummy-data";

export function ProfilePage() {
  const politician: PoliticianDto = dummyPolitician;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your public information and professional details
        </p>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl">{politician.fullName}</CardTitle>
              <CardDescription className="text-base">
                {politician.profession} • {politician.sourceCategories.party}
              </CardDescription>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {politician.sourceCategories.positions[0]}
                </Badge>
                <Badge variant="secondary">
                  {politician.experienceYears} years experience
                </Badge>
              </div>
            </div>
            <div className="ml-auto">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {politician.biography}
          </p>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="contact" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contact">Contact Information</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="professional">Professional Details</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How constituents can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={politician.contact.email}
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={politician.contact.phone}
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      value={politician.contact.website}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Profiles</CardTitle>
              <CardDescription>
                Connect with constituents on social platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <Input
                      id="facebook"
                      value={politician.socialMedia.facebook}
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-400" />
                    <Input
                      id="twitter"
                      value={politician.socialMedia.twitter}
                      readOnly
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-pink-600" />
                    <Input
                      id="instagram"
                      value={politician.socialMedia.instagram}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Professional Background</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Education</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {politician.education}
                  </p>
                </div>
                <div>
                  <Label>Experience</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {politician.experienceYears} years in public service
                  </p>
                </div>
                <div>
                  <Label>Political Affiliation</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {politician.isIndependent
                      ? "Independent"
                      : politician.sourceCategories.party}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Public Rating</span>
                  <Badge variant="secondary">{politician.rating}/5.0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Votes</span>
                  <Badge variant="outline">
                    {politician.totalVotes.toLocaleString()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reports Filed</span>
                  <Badge variant="outline">{politician.totalReports}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verified Reports</span>
                  <Badge variant="default">{politician.verifiedReports}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>
                Notable accomplishments and milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {politician.achievements?.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-start space-x-3 p-4 border rounded-lg"
                  >
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Badge variant="outline">{achievement.category}</Badge>
                        <span>
                          {new Date(achievement.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {(!politician.achievements ||
                  politician.achievements.length === 0) && (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No achievements recorded yet
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Active Promises Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Active Promises</span>
              </CardTitle>
              <CardDescription>
                Current commitments to constituents
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {politician.promises
              ?.filter((p) => p.status === "ongoing")
              .slice(0, 3)
              .map((promise) => (
                <div
                  key={promise.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium">{promise.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {promise.progress}% complete
                    </p>
                  </div>
                  <Badge variant="secondary">{promise.status}</Badge>
                </div>
              ))}
            {(!politician.promises ||
              politician.promises.filter((p) => p.status === "ongoing")
                .length === 0) && (
              <div className="text-center py-4">
                <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No active promises
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
