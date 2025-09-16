import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag,
  User,
  Clock,
  Heart,
  Share,
} from "lucide-react-native";
import { Card, CardContent } from "~/components/ui/card";

interface Comment {
  id: string;
  author: string;
  authorId: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
  isVerified: boolean;
  isAuthor: boolean;
  isLiked?: boolean;
  isDisliked?: boolean;
}

interface CommentSystemProps {
  itemId: string;
  itemType: "report" | "poll" | "politician";
  onComment?: (comment: string) => void;
  onLike?: (commentId: string) => void;
  onDislike?: (commentId: string) => void;
  onReply?: (commentId: string, reply: string) => void;
  onReport?: (commentId: string) => void;
}

export const CommentSystem: React.FC<CommentSystemProps> = ({
  itemId,
  itemType,
  onComment,
  onLike,
  onDislike,
  onReply,
  onReport,
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>(
    {}
  );

  // Mock comments data
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Citizen_123",
      authorId: "user1",
      content:
        "This is exactly what we need to expose! More power to the whistleblower! 🔥",
      timestamp: "2024-01-15T10:30:00Z",
      likes: 45,
      dislikes: 2,
      replies: [
        {
          id: "1a",
          author: "TruthSeeker",
          authorId: "user2",
          content: "Absolutely! We need more transparency in our government.",
          timestamp: "2024-01-15T11:00:00Z",
          likes: 12,
          dislikes: 0,
          replies: [],
          isVerified: true,
          isAuthor: false,
        },
      ],
      isVerified: true,
      isAuthor: false,
    },
    {
      id: "2",
      author: "NepalFighter",
      authorId: "user3",
      content:
        "I've seen similar cases in my area. This corruption is everywhere! 😤",
      timestamp: "2024-01-15T09:15:00Z",
      likes: 32,
      dislikes: 5,
      replies: [],
      isVerified: false,
      isAuthor: false,
    },
    {
      id: "3",
      author: "TransparencyAdvocate",
      authorId: "user4",
      content: "This is why we need Saasan! Keep reporting, keep fighting! 💪",
      timestamp: "2024-01-15T08:45:00Z",
      likes: 67,
      dislikes: 1,
      replies: [
        {
          id: "3a",
          author: "AntiCorruptionWarrior",
          authorId: "user5",
          content:
            "Saasan is changing the game! Finally, citizens have a voice!",
          timestamp: "2024-01-15T09:00:00Z",
          likes: 23,
          dislikes: 0,
          replies: [],
          isVerified: true,
          isAuthor: false,
        },
        {
          id: "3b",
          author: "Citizen_123",
          authorId: "user1",
          content: "Couldn't agree more! This app is revolutionary! 🚀",
          timestamp: "2024-01-15T09:10:00Z",
          likes: 15,
          dislikes: 0,
          replies: [],
          isVerified: true,
          isAuthor: false,
        },
      ],
      isVerified: true,
      isAuthor: false,
    },
    {
      id: "4",
      author: "LocalResident",
      authorId: "user6",
      content:
        "I know this area well. The contractor has been doing this for years. Finally exposed!",
      timestamp: "2024-01-15T07:20:00Z",
      likes: 28,
      dislikes: 3,
      replies: [],
      isVerified: false,
      isAuthor: false,
    },
  ]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - time.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "You",
        authorId: "current_user",
        content: newComment,
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        replies: [],
        isVerified: false,
        isAuthor: true,
      };

      setComments([comment, ...comments]);
      setNewComment("");
      onComment?.(newComment);
      Alert.alert(
        "Comment Posted",
        "Your comment has been posted successfully!"
      );
    }
  };

  const handleLike = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            dislikes: comment.isDisliked
              ? comment.dislikes - 1
              : comment.dislikes,
            isLiked: !comment.isLiked,
            isDisliked: false,
          };
        }
        return comment;
      })
    );
    onLike?.(commentId);
  };

  const handleDislike = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            dislikes: comment.isDisliked
              ? comment.dislikes - 1
              : comment.dislikes + 1,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes,
            isDisliked: !comment.isDisliked,
            isLiked: false,
          };
        }
        return comment;
      })
    );
    onDislike?.(commentId);
  };

  const handleReply = (commentId: string) => {
    if (replyText.trim()) {
      const reply: Comment = {
        id: Date.now().toString(),
        author: "You",
        authorId: "current_user",
        content: replyText,
        timestamp: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        replies: [],
        isVerified: false,
        isAuthor: true,
      };

      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...comment.replies, reply],
            };
          }
          return comment;
        })
      );

      setReplyText("");
      setReplyingTo(null);
      onReply?.(commentId, replyText);
      Alert.alert("Reply Posted", "Your reply has been posted successfully!");
    }
  };

  const handleReport = (commentId: string) => {
    Alert.alert(
      "Report Comment",
      "Are you sure you want to report this comment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Report",
          style: "destructive",
          onPress: () => onReport?.(commentId),
        },
      ]
    );
  };

  const toggleReplies = (commentId: string) => {
    setShowReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => (
    <View key={comment.id} className={`${isReply ? "ml-4 mt-2" : "mb-4"}`}>
      <Card className={isReply ? "bg-gray-50" : ""}>
        <CardContent className="p-3">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-row items-center flex-1">
              <User className="text-gray-400 mr-2" size={16} />
              <Text className="font-medium text-gray-800 mr-2">
                {comment.author}
              </Text>
              {comment.isVerified && (
                <View className="bg-blue-500 rounded-full w-4 h-4 items-center justify-center mr-1">
                  <Text className="text-white text-xs">✓</Text>
                </View>
              )}
              {comment.isAuthor && (
                <View className="bg-green-500 rounded-full w-4 h-4 items-center justify-center mr-1">
                  <Text className="text-white text-xs">YOU</Text>
                </View>
              )}
            </View>
            <View className="flex-row items-center">
              <Clock className="text-gray-400 mr-1" size={12} />
              <Text className="text-xs text-gray-500">
                {formatTimeAgo(comment.timestamp)}
              </Text>
            </View>
          </View>

          <Text className="text-gray-800 mb-3">{comment.content}</Text>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity
                onPress={() => handleLike(comment.id)}
                className="flex-row items-center"
              >
                <ThumbsUp
                  className={
                    comment.isLiked ? "text-blue-500" : "text-gray-400"
                  }
                  size={16}
                />
                <Text
                  className={`text-sm ml-1 ${
                    comment.isLiked ? "text-blue-500" : "text-gray-500"
                  }`}
                >
                  {comment.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDislike(comment.id)}
                className="flex-row items-center"
              >
                <ThumbsDown
                  className={
                    comment.isDisliked ? "text-red-500" : "text-gray-400"
                  }
                  size={16}
                />
                <Text
                  className={`text-sm ml-1 ${
                    comment.isDisliked ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {comment.dislikes}
                </Text>
              </TouchableOpacity>

              {!isReply && (
                <TouchableOpacity
                  onPress={() => setReplyingTo(comment.id)}
                  className="flex-row items-center"
                >
                  <Reply className="text-gray-400" size={16} />
                  <Text className="text-sm text-gray-500 ml-1">Reply</Text>
                </TouchableOpacity>
              )}
            </View>

            {!comment.isAuthor && (
              <TouchableOpacity onPress={() => handleReport(comment.id)}>
                <Flag className="text-gray-400" size={16} />
              </TouchableOpacity>
            )}
          </View>

          {/* Replies */}
          {!isReply && comment.replies.length > 0 && (
            <View className="mt-3">
              <TouchableOpacity
                onPress={() => toggleReplies(comment.id)}
                className="flex-row items-center mb-2"
              >
                <Text className="text-sm text-blue-500 font-medium">
                  {showReplies[comment.id] ? "Hide" : "Show"}{" "}
                  {comment.replies.length} replies
                </Text>
              </TouchableOpacity>

              {showReplies[comment.id] && (
                <View>
                  {comment.replies.map((reply) => renderComment(reply, true))}
                </View>
              )}
            </View>
          )}

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <View className="mt-3 pt-3 border-t border-gray-200">
              <TextInput
                value={replyText}
                onChangeText={setReplyText}
                placeholder="Write a reply..."
                className="border border-gray-300 rounded-lg p-3 mb-2"
                multiline
                numberOfLines={2}
              />
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => handleReply(comment.id)}
                  className="flex-1 bg-blue-500 py-3 rounded-lg"
                >
                  <Text className="text-white font-medium text-center text-sm">
                    Reply
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setReplyingTo(null);
                    setReplyText("");
                  }}
                  className="flex-1 bg-gray-500 py-3 rounded-lg"
                >
                  <Text className="text-white font-medium text-center text-sm">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </CardContent>
      </Card>
    </View>
  );

  return (
    <View className="space-y-4">
      {/* Comment Input */}
      <Card>
        <CardContent className="p-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            💬 Join the Discussion
          </Text>

          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Share your thoughts on this report..."
            className="border border-gray-300 rounded-lg p-3 mb-3"
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            onPress={handleSubmitComment}
            className="bg-blue-500 py-3 px-4 rounded-lg"
          >
            <Text className="text-white font-medium text-center text-sm">
              Post Comment
            </Text>
          </TouchableOpacity>
        </CardContent>
      </Card>

      {/* Comments List */}
      <Card>
        <CardContent className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Comments ({comments.length})
            </Text>
            <View className="flex-row items-center">
              <Heart className="text-red-500 mr-1" size={16} />
              <Text className="text-sm text-gray-600">
                {comments.reduce((sum, comment) => sum + comment.likes, 0)}{" "}
                total likes
              </Text>
            </View>
          </View>

          <View className="max-h-64">
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              <View>{comments.map((comment) => renderComment(comment))}</View>
            </ScrollView>
          </View>
        </CardContent>
      </Card>

      {/* Viral Call to Action */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600">
        <CardContent className="p-4">
          <Text className="text-white font-bold text-center mb-2">
            🚀 Make Your Voice Heard!
          </Text>
          <Text className="text-white text-center text-sm">
            Every comment helps build a stronger anti-corruption community.
            Share your thoughts and inspire others!
          </Text>
        </CardContent>
      </Card>
    </View>
  );
};
