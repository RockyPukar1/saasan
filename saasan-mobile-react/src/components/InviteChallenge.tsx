import React, { useState } from "react";
import {
  Trophy,
  Share as ShareIcon,
  MessageCircle,
  Mail,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

    // try {
    //   switch (platform) {
    //     case "whatsapp":
    //       const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(
    //         message
    //       )}`;
    //       await Linking.openURL(whatsappUrl);
    //       break;

    //     case "facebook":
    //       const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    //         "https://saasan.app"
    //       )}&quote=${encodeURIComponent(message)}`;
    //       await Linking.openURL(facebookUrl);
    //       break;

    //     case "instagram":
    //       await Share.share({
    //         message: message,
    //       });
    //       break;

    //     case "sms":
    //       const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
    //       await Linking.openURL(smsUrl);
    //       break;

    //     case "email":
    //       const emailUrl = `mailto:?subject=Join me on Saasan App&body=${encodeURIComponent(
    //         message
    //       )}`;
    //       await Linking.openURL(emailUrl);
    //       break;
    //   }

    //   // Track invitation
    //   Alert.alert(
    //     "Invitation Sent!",
    //     "Thank you for helping spread Saasan! Keep inviting to unlock more rewards."
    //   );
    // } catch (error) {
    //   Alert.alert("Error", "Could not share invitation. Please try again.");
    // }
  };

  const shareAll = async () => {
    try {
      // const message = generateInviteMessage();
      // await Share.share({
      //   message: message,
      //   title: "Join Saasan App - Fight Corruption",
      // });
    } catch (error) {
      // Alert.alert("Error", "Could not share invitation.");
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
    <div className="space-y-4">
      {/* Challenge Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-4">
          <div className="flex-row items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-800">
                🚀 Invite Friends Challenge
              </p>
              <p className="text-sm text-gray-600">
                Help spread Saasan and unlock exclusive rewards
              </p>
            </div>
            <Trophy className="text-yellow-500" size={24} />
          </div>
        </CardContent>
      </Card>

      {/* Current Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex-row items-center justify-between mb-4">
            <div className="items-center">
              <p className="text-2xl font-bold text-blue-600">
                {userStats.friendsInvited}
              </p>
              <p className="text-sm text-gray-600">Invited</p>
            </div>
            <div className="items-center">
              <p className="text-2xl font-bold text-green-600">
                {userStats.friendsJoined}
              </p>
              <p className="text-sm text-gray-600">Joined</p>
            </div>
            <div className="items-center">
              <p className="text-2xl font-bold text-purple-600">
                {userStats.currentStreak}
              </p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
            <div className="items-center">
              <p className="text-2xl font-bold text-orange-600">
                {userStats.totalRewards}
              </p>
              <p className="text-sm text-gray-600">Rewards</p>
            </div>
          </div>

          {/* Progress to Next Milestone */}
          {nextMilestone && (
            <div>
              <div className="flex-row justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">
                  Next Reward: {nextMilestone.friends} friends
                </p>
                <p className="text-sm text-gray-600">
                  {userStats.friendsJoined}/{nextMilestone.friends}
                </p>
              </div>
              <div className="bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {nextMilestone.reward}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-bold text-gray-800 mb-3">
            🏆 Challenge Milestones
          </p>
          <div className="space-y-3">
            {challengeMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`flex-row items-center p-3 rounded-lg border ${
                  milestone.unlocked
                    ? "bg-green-50 border-green-200"
                    : milestone.current
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <p className="text-2xl mr-3">{milestone.icon}</p>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    Invite {milestone.friends} friends
                  </p>
                  <p className="text-sm text-gray-600">
                    {milestone.reward}
                  </p>
                </div>
                <div className="items-end">
                  {milestone.unlocked && (
                    <div className="bg-green-500 rounded-full w-6 h-6 items-center justify-center">
                      <p className="text-white text-xs font-bold">✓</p>
                    </div>
                  )}
                  {milestone.current && (
                    <div className="bg-blue-500 rounded-full w-6 h-6 items-center justify-center">
                      <p className="text-white text-xs font-bold">!</p>
                    </div>
                  )}
                  {!milestone.unlocked && !milestone.current && (
                    <div className="bg-gray-300 rounded-full w-6 h-6 items-center justify-center">
                      <p className="text-gray-600 text-xs font-bold">?</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invite Methods */}
      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-bold text-gray-800 mb-3">
            📱 Invite Your Friends
          </p>

          <div className="space-y-2">
            <Button
              onClick={() => shareInvite("whatsapp")}
              className="flex-row items-center justify-center bg-green-500 py-3 rounded-lg"
            >
              <MessageCircle className="text-white mr-2" size={20} />
              <p className="text-white font-medium">
                Invite via WhatsApp
              </p>
            </Button>

            <Button
              onClick={() => shareInvite("facebook")}
              className="flex-row items-center justify-center bg-blue-600 py-3 rounded-lg"
            >
              <ShareIcon className="text-white mr-2" size={20} />
              <p className="text-white font-medium">
                Invite via Facebook
              </p>
            </Button>

            <Button
              onClick={() => shareInvite("instagram")}
              className="flex-row items-center justify-center bg-pink-500 py-3 rounded-lg"
            >
              <ShareIcon className="text-white mr-2" size={20} />
              <p className="text-white font-medium">
                Invite via Instagram
              </p>
            </Button>

            <Button
              onClick={() => shareInvite("sms")}
              className="flex-row items-center justify-center bg-gray-600 py-3 rounded-lg"
            >
              <MessageCircle className="text-white mr-2" size={20} />
              <p className="text-white font-medium">Invite via SMS</p>
            </Button>

            <Button
              onClick={() => shareInvite("email")}
              className="flex-row items-center justify-center bg-orange-500 py-3 rounded-lg"
            >
              <Mail className="text-white mr-2" size={20} />
              <p className="text-white font-medium">Invite via Email</p>
            </Button>

            <Button
              onClick={shareAll}
              className="flex-row items-center justify-center bg-purple-600 py-3 rounded-lg"
            >
              <ShareIcon className="text-white mr-2" size={20} />
              <p className="text-white font-medium">Share to All Apps</p>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
        <CardContent className="p-4">
          <p className="text-white font-bold text-center mb-2">
            🌟 Make Saasan Viral!
          </p>
          <p className="text-white text-center text-sm">
            Every friend you invite helps build a stronger anti-corruption
            movement in Nepal. Together, we can create real change!
          </p>
        </CardContent>
      </Card>

      {/* Viral Stats */}
      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-bold text-gray-800 mb-3">
            📊 Your Impact
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {userStats.friendsJoined * 10}
              </p>
              <p className="text-sm text-gray-600">
                Potential corruption reports prevented
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {userStats.friendsJoined * 5}
              </p>
              <p className="text-sm text-gray-600">
                Additional citizens engaged
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
