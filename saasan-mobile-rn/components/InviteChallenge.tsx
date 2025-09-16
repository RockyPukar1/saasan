import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Share,
  Linking,
} from "react-native";
import {
  Users,
  Gift,
  Trophy,
  Share as ShareIcon,
  MessageCircle,
  Mail,
} from "lucide-react-native";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface InviteChallengeProps {
  userStats: {
    friendsInvited: number;
    friendsJoined: number;
    currentStreak: number;
    totalRewards: number;
  };
}

export const InviteChallenge: React.FC<InviteChallengeProps> = ({
  userStats,
}) => {
  const [inviteMessage, setInviteMessage] = useState("");

  const challengeMilestones = [
    {
      id: 1,
      friends: 3,
      reward: 'Unlock "Community Builder" badge',
      icon: "🏆",
      unlocked: userStats.friendsJoined >= 3,
      current: userStats.friendsJoined === 3,
    },
    {
      id: 2,
      friends: 5,
      reward: 'Unlock "Saasan Ambassador" badge',
      icon: "⭐",
      unlocked: userStats.friendsJoined >= 5,
      current: userStats.friendsJoined === 5,
    },
    {
      id: 3,
      friends: 10,
      reward: 'Unlock "Viral Champion" badge + Special recognition',
      icon: "👑",
      unlocked: userStats.friendsJoined >= 10,
      current: userStats.friendsJoined === 10,
    },
    {
      id: 4,
      friends: 25,
      reward: 'Unlock "Legendary Inviter" badge + Exclusive features',
      icon: "🚀",
      unlocked: userStats.friendsJoined >= 25,
      current: userStats.friendsJoined === 25,
    },
  ];

  const generateInviteMessage = () => {
    const messages = [
      `🔥 Join me in fighting corruption in Nepal! I'm using Saasan App to report corruption and make our country better. Download it now: https://saasan.app #FightCorruption #SaasanApp #Nepal`,

      `⚡ I just reported corruption on Saasan App! Join thousands of citizens fighting for transparency in Nepal. Get the app: https://saasan.app #SaasanApp #Transparency #Nepal`,

      `🛡️ Corruption affects us all. I'm using Saasan App to report it and track politicians. Join the movement: https://saasan.app #SaasanApp #AntiCorruption #Nepal`,

      `📊 I'm voting on important polls about Nepal's future on Saasan App. Your voice matters! Download: https://saasan.app #SaasanApp #CitizenVoice #Nepal`,

      `🚨 Just saw a corruption report on Saasan App that made me angry! We need to fight this together. Get the app: https://saasan.app #FightCorruption #SaasanApp #Nepal`,
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  };

  const shareInvite = async (
    platform: "whatsapp" | "facebook" | "instagram" | "sms" | "email"
  ) => {
    const message = generateInviteMessage();

    try {
      switch (platform) {
        case "whatsapp":
          const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(
            message
          )}`;
          await Linking.openURL(whatsappUrl);
          break;

        case "facebook":
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            "https://saasan.app"
          )}&quote=${encodeURIComponent(message)}`;
          await Linking.openURL(facebookUrl);
          break;

        case "instagram":
          await Share.share({
            message: message,
          });
          break;

        case "sms":
          const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
          await Linking.openURL(smsUrl);
          break;

        case "email":
          const emailUrl = `mailto:?subject=Join me on Saasan App&body=${encodeURIComponent(
            message
          )}`;
          await Linking.openURL(emailUrl);
          break;
      }

      // Track invitation
      Alert.alert(
        "Invitation Sent!",
        "Thank you for helping spread Saasan! Keep inviting to unlock more rewards."
      );
    } catch (error) {
      Alert.alert("Error", "Could not share invitation. Please try again.");
    }
  };

  const shareAll = async () => {
    try {
      const message = generateInviteMessage();
      await Share.share({
        message: message,
        title: "Join Saasan App - Fight Corruption",
      });
    } catch (error) {
      Alert.alert("Error", "Could not share invitation.");
    }
  };

  const getNextMilestone = () => {
    return challengeMilestones.find((milestone) => !milestone.unlocked);
  };

  const nextMilestone = getNextMilestone();
  const progress = nextMilestone
    ? (userStats.friendsJoined / nextMilestone.friends) * 100
    : 100;

  return (
    <View className="space-y-4">
      {/* Challenge Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg font-bold text-gray-800">
                🚀 Invite Friends Challenge
              </Text>
              <Text className="text-sm text-gray-600">
                Help spread Saasan and unlock exclusive rewards
              </Text>
            </View>
            <Trophy className="text-yellow-500" size={24} />
          </View>
        </CardContent>
      </Card>

      {/* Current Stats */}
      <Card>
        <CardContent className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="items-center">
              <Text className="text-2xl font-bold text-blue-600">
                {userStats.friendsInvited}
              </Text>
              <Text className="text-sm text-gray-600">Invited</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">
                {userStats.friendsJoined}
              </Text>
              <Text className="text-sm text-gray-600">Joined</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-purple-600">
                {userStats.currentStreak}
              </Text>
              <Text className="text-sm text-gray-600">Day Streak</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-orange-600">
                {userStats.totalRewards}
              </Text>
              <Text className="text-sm text-gray-600">Rewards</Text>
            </View>
          </View>

          {/* Progress to Next Milestone */}
          {nextMilestone && (
            <View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm font-medium text-gray-700">
                  Next Reward: {nextMilestone.friends} friends
                </Text>
                <Text className="text-sm text-gray-600">
                  {userStats.friendsJoined}/{nextMilestone.friends}
                </Text>
              </View>
              <View className="bg-gray-200 rounded-full h-3">
                <View
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                {nextMilestone.reward}
              </Text>
            </View>
          )}
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardContent className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            🏆 Challenge Milestones
          </Text>
          <View className="space-y-3">
            {challengeMilestones.map((milestone) => (
              <View
                key={milestone.id}
                className={`flex-row items-center p-3 rounded-lg border ${
                  milestone.unlocked
                    ? "bg-green-50 border-green-200"
                    : milestone.current
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <Text className="text-2xl mr-3">{milestone.icon}</Text>
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">
                    Invite {milestone.friends} friends
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {milestone.reward}
                  </Text>
                </View>
                <View className="items-end">
                  {milestone.unlocked && (
                    <View className="bg-green-500 rounded-full w-6 h-6 items-center justify-center">
                      <Text className="text-white text-xs font-bold">✓</Text>
                    </View>
                  )}
                  {milestone.current && (
                    <View className="bg-blue-500 rounded-full w-6 h-6 items-center justify-center">
                      <Text className="text-white text-xs font-bold">!</Text>
                    </View>
                  )}
                  {!milestone.unlocked && !milestone.current && (
                    <View className="bg-gray-300 rounded-full w-6 h-6 items-center justify-center">
                      <Text className="text-gray-600 text-xs font-bold">?</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>

      {/* Invite Methods */}
      <Card>
        <CardContent className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            📱 Invite Your Friends
          </Text>

          <View className="space-y-2">
            <TouchableOpacity
              onPress={() => shareInvite("whatsapp")}
              className="flex-row items-center justify-center bg-green-500 py-3 rounded-lg"
            >
              <MessageCircle className="text-white mr-2" size={20} />
              <Text className="text-white font-medium">
                Invite via WhatsApp
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => shareInvite("facebook")}
              className="flex-row items-center justify-center bg-blue-600 py-3 rounded-lg"
            >
              <ShareIcon className="text-white mr-2" size={20} />
              <Text className="text-white font-medium">
                Invite via Facebook
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => shareInvite("instagram")}
              className="flex-row items-center justify-center bg-pink-500 py-3 rounded-lg"
            >
              <ShareIcon className="text-white mr-2" size={20} />
              <Text className="text-white font-medium">
                Invite via Instagram
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => shareInvite("sms")}
              className="flex-row items-center justify-center bg-gray-600 py-3 rounded-lg"
            >
              <MessageCircle className="text-white mr-2" size={20} />
              <Text className="text-white font-medium">Invite via SMS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => shareInvite("email")}
              className="flex-row items-center justify-center bg-orange-500 py-3 rounded-lg"
            >
              <Mail className="text-white mr-2" size={20} />
              <Text className="text-white font-medium">Invite via Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={shareAll}
              className="flex-row items-center justify-center bg-purple-600 py-3 rounded-lg"
            >
              <ShareIcon className="text-white mr-2" size={20} />
              <Text className="text-white font-medium">Share to All Apps</Text>
            </TouchableOpacity>
          </View>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
        <CardContent className="p-4">
          <Text className="text-white font-bold text-center mb-2">
            🌟 Make Saasan Viral!
          </Text>
          <Text className="text-white text-center text-sm">
            Every friend you invite helps build a stronger anti-corruption
            movement in Nepal. Together, we can create real change!
          </Text>
        </CardContent>
      </Card>

      {/* Viral Stats */}
      <Card>
        <CardContent className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            📊 Your Impact
          </Text>
          <View className="grid grid-cols-2 gap-4">
            <View className="bg-red-50 p-3 rounded-lg">
              <Text className="text-2xl font-bold text-red-600">
                {userStats.friendsJoined * 10}
              </Text>
              <Text className="text-sm text-gray-600">
                Potential corruption reports prevented
              </Text>
            </View>
            <View className="bg-blue-50 p-3 rounded-lg">
              <Text className="text-2xl font-bold text-blue-600">
                {userStats.friendsJoined * 5}
              </Text>
              <Text className="text-sm text-gray-600">
                Additional citizens engaged
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
};
