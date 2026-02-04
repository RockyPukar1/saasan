import React, { useState } from "react";
import {
  Share as ShareIcon,
  MessageCircle,
} from "lucide-react";
import { viralApi } from "@/services/viralApi";
import { Button } from "./ui/button";

interface ShareableImageProps {
  type: "corruption_report" | "poll_result" | "politician_rating";
  data: any;
  onShare?: () => void;
}

export const ShareableImage: React.FC<ShareableImageProps> = ({
  type,
  data,
  onShare,
}) => {
  const [sharing, setSharing] = useState(false);

  const generateShareText = () => {
    switch (type) {
      case "corruption_report":
        return `🚨 CORRUPTION ALERT 🚨\n\n"${data.title}"\n📍 ${
          data.location
        }\n💰 ${
          data.amountInvolved
            ? `Amount: ${data.amountInvolved}`
            : "Amount: Unknown"
        }\n\nReported on Saasan App\n#FightCorruption #SaasanApp #Nepal`;

      case "poll_result":
        return `📊 POLL RESULT 📊\n\n"${data.title}"\n\n${data.options
          ?.map(
            (opt: any, i: number) =>
              `${i + 1}. ${opt.option}: ${opt.votes} votes (${Math.round(
                (opt.votes / data.total_votes) * 100
              )}%)`
          )
          .join("\n")}\n\nTotal Votes: ${
          data.total_votes
        }\n\nVote on Saasan App\n#SaasanPoll #Nepal`;

      case "politician_rating":
        return `👤 POLITICIAN RATING 👤\n\n${data.name}\n${data.position}\n📍 ${data.constituency}\n⭐ Rating: ${data.rating}/5\n\nRated on Saasan App\n#PoliticianRating #SaasanApp #Nepal`;

      default:
        return `Check this out on Saasan App!\n#SaasanApp #Nepal`;
    }
  };

  const generateViralText = () => {
    switch (type) {
      case "corruption_report":
        const amount = data.amountInvolved;
        if (amount && amount > 1000000) {
          return `💸 ${(amount / 1000000).toFixed(1)}M NPR MISUSED in ${
            data.location
          } — Reported on Saasan 🔥`;
        } else if (amount && amount > 100000) {
          return `💸 ${(amount / 100000).toFixed(1)}L NPR MISUSED in ${
            data.location
          } — Reported on Saasan 🔥`;
        } else {
          return `🚨 CORRUPTION REPORTED in ${data.location} — Join the fight on Saasan 🔥`;
        }

      case "poll_result":
        const topOption = data.options?.reduce(
          (max: any, opt: any) => (opt.votes > max.votes ? opt : max),
          data.options[0]
        );
        const percentage = Math.round(
          (topOption?.votes / data.total_votes) * 100
        );
        return `⚡ ${percentage}% of citizens say "${topOption?.option}" — Join the poll on Saasan 📊`;

      case "politician_rating":
        return `⭐ ${data.name} rated ${data.rating}/5 by citizens — See all ratings on Saasan 👤`;

      default:
        return `Check this out on Saasan App! 🔥`;
    }
  };

  const shareToSocial = async (
    platform: "whatsapp" | "facebook" | "instagram" | "tiktok"
  ) => {
    setSharing(true);
    try {
      // Generate share content from API
      const shareContent = await viralApi.generateShareContent({
        id: data.id,
        type,
        title: data.title,
        description: data.description,
        location: data.location,
        amountInvolved: data.amountInvolved,
        total_votes: data.total_votes,
        options: data.options,
        name: data.name,
        position: data.position,
        constituency: data.constituency,
        rating: data.rating,
      });

      // Track the share
      await viralApi.trackShare(data.id, type, platform);

      switch (platform) {
        case "whatsapp":
          const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(
            shareContent.viralText + "\n\n" + shareContent.shareText
          )}`;
          await Linking.openURL(whatsappUrl);
          break;

        case "facebook":
          const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            "https://saasan.app"
          )}&quote=${encodeURIComponent(shareContent.viralText)}`;
          await Linking.openURL(facebookUrl);
          break;

        case "instagram":
          // Instagram doesn't support direct text sharing, so we'll copy to clipboard
          await Share.share({
            message: shareContent.viralText + "\n\n" + shareContent.shareText,
          });
          break;

        case "tiktok":
          // TikTok doesn't support direct text sharing, so we'll copy to clipboard
          await Share.share({
            message:
              shareContent.viralText +
              "\n\n" +
              shareContent.shareText +
              "\n\n#SaasanApp #FightCorruption #Nepal #Viral",
          });
          break;
      }

      onShare?.();
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Could not share to this platform");
    } finally {
      setSharing(false);
    }
  };

  const shareAll = async () => {
    setSharing(true);
    try {
      const viralText = generateViralText();
      const shareText = generateShareText();

      await Share.share({
        message: viralText + "\n\n" + shareText,
        title: "Saasan App - Fight Corruption",
      });

      onShare?.();
    } catch (error) {
      Alert.alert("Error", "Could not share");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <p className="text-lg font-bold text-gray-800 mb-3">
        Share This Content
      </p>

      {/* Viral Preview */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
        <p className="text-sm font-medium text-red-800 mb-2">
          Viral Preview:
        </p>
        <p className="text-red-700 text-sm">{generateViralText()}</p>
      </div>

      {/* Social Media Buttons */}
      <div className="space-y-2">
        <Button
          onPress={() => shareToSocial("whatsapp")}
          disabled={sharing}
          className="flex-row items-center justify-center bg-green-500 py-3 rounded-lg"
        >
          <MessageCircle className="text-white mr-2" size={20} />
          <p className="text-white font-medium">Share to WhatsApp</p>
        </Button>

        <Button
          onPress={() => shareToSocial("facebook")}
          disabled={sharing}
          className="flex-row items-center justify-center bg-blue-600 py-3 rounded-lg"
        >
          <ShareIcon className="text-white mr-2" size={20} />
          <p className="text-white font-medium">Share to Facebook</p>
        </Button>

        <Button
          onPress={() => shareToSocial("instagram")}
          disabled={sharing}
          className="flex-row items-center justify-center bg-pink-500 py-3 rounded-lg"
        >
          <ShareIcon className="text-white mr-2" size={20} />
          <p className="text-white font-medium">Share to Instagram</p>
        </Button>

        <Button
          onPress={() => shareToSocial("tiktok")}
          disabled={sharing}
          className="flex-row items-center justify-center bg-black py-3 rounded-lg"
        >
          <ShareIcon className="text-white mr-2" size={20} />
          <p className="text-white font-medium">Share to TikTok</p>
        </Button>

        <Button
          onPress={shareAll}
          disabled={sharing}
          className="flex-row items-center justify-center bg-gray-600 py-3 rounded-lg"
        >
          <ShareIcon className="text-white mr-2" size={20} />
          <p className="text-white font-medium">
            {sharing ? "Sharing..." : "Share to All Apps"}
          </p>
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-3">
        Help make Saasan viral! Share corruption reports and poll results to
        spread awareness.
      </p>
    </div>
  );
};
