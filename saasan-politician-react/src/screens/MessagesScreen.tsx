import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  AlertCircle,
  User,
  Reply,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Share,
  Bookmark,
  Flag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { messagesApi, type MessageThread } from "@/services/api";
import { PERMISSIONS } from "@/constants/permission.constants";
import { useAuth } from "@/contexts/AuthContext";

export const MessagesScreen: React.FC = () => {
  const { hasPermission } = useAuth();

  const canReplyMessages = hasPermission(PERMISSIONS.messages.reply);
  const canManageMessages = hasPermission(PERMISSIONS.messages.manage);

  const [messages, setMessages] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(
    null,
  );
  const [replyText, setReplyText] = useState("");
  const [upvotedMessages, setUpvotedMessages] = useState<Set<string>>(
    new Set(),
  );
  const [downvotedMessages, setDownvotedMessages] = useState<Set<string>>(
    new Set(),
  );
  const [collapsedThreads, setCollapsedThreads] = useState<Set<string>>(
    new Set(),
  );

  console.log(messages);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await messagesApi.getJurisdictionMessages();
      setMessages(data);
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedThread || !replyText.trim()) return;
    if (!canReplyMessages) {
      return;
    }

    try {
      await messagesApi.addReply(selectedThread.id, replyText);
      setReplyText("");
      const updatedThread = await messagesApi.getById(selectedThread.id);
      setSelectedThread(updatedThread);
      loadMessages();
    } catch (error) {
      console.error("Failed to send reply:", error);
    }
  };

  const handleUpvote = async (messageId: string) => {
    try {
      setUpvotedMessages((prev) => new Set([...prev, messageId]));
      await messagesApi.upvoteMessage(messageId);
    } catch (error) {
      console.error("Failed to upvote:", error);
    }
  };

  const handleDownvote = async (messageId: string) => {
    try {
      setDownvotedMessages((prev) => new Set([...prev, messageId]));
      await messagesApi.downvoteMessage(messageId);
    } catch (error) {
      console.error("Failed to downvote:", error);
    }
  };

  const handleStatusUpdate = async (
    messageId: string,
    status: "pending" | "in_progress" | "resolved" | "closed",
  ) => {
    if (!canManageMessages) {
      return;
    }

    try {
      await messagesApi.updateStatus(messageId, status);
      loadMessages();
      if (selectedThread && selectedThread.id === messageId) {
        const updatedThread = await messagesApi.getById(messageId);
        setSelectedThread(updatedThread);
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const toggleThreadCollapse = (threadId: string) => {
    setCollapsedThreads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(threadId)) {
        newSet.delete(threadId);
      } else {
        newSet.add(threadId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "just now";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-green-600";
      case "in_progress":
        return "text-blue-600";
      case "closed":
        return "text-gray-600";
      case "pending":
      default:
        return "text-yellow-600";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-orange-600";
      case "low":
      default:
        return "text-gray-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "COMPLAINT":
        return <AlertCircle className="w-4 h-4" />;
      case "SUGGESTION":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const RedditMessage = ({
    message,
    isMain = false,
    level = 0,
  }: {
    message: any;
    isMain?: boolean;
    level?: number;
  }) => {
    const isUpvoted = upvotedMessages.has(message.id);
    const isDownvoted = downvotedMessages.has(message.id);
    const voteCount =
      (message.upvotesCount || 0) - (message.downvotesCount || 0);

    return (
      <div className={`flex ${level > 0 ? "ml-4" : ""}`}>
        {/* Voting Section */}
        <div className="flex flex-col items-center mr-2">
          <button
            onClick={() => handleUpvote(message.id)}
            disabled={isUpvoted}
            className={`p-1 rounded hover:bg-gray-100 ${
              isUpvoted ? "text-orange-500" : "text-gray-400"
            }`}
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <span
            className={`text-sm font-bold ${
              isUpvoted
                ? "text-orange-500"
                : isDownvoted
                  ? "text-blue-600"
                  : "text-gray-900"
            }`}
          >
            {voteCount}
          </span>
          <button
            onClick={() => handleDownvote(message.id)}
            disabled={isDownvoted}
            className={`p-1 rounded hover:bg-gray-100 ${
              isDownvoted ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Message Content */}
        <div className="flex-1">
          <div
            className={`bg-white border rounded-lg p-3 hover:border-gray-300 transition-colors ${
              isMain ? "border-blue-200 border-2" : "border-gray-200"
            }`}
          >
            {/* Message Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isMain ? "bg-blue-500" : "bg-gray-200"
                  }`}
                >
                  <User
                    className={`w-4 h-4 ${isMain ? "text-white" : "text-gray-600"}`}
                  />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-900">
                    {message.senderType === "politician"
                      ? selectedThread?.participants.politician.name
                      : selectedThread?.participants.citizen.name}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatDate(message.createdAt)}
                  </span>
                  {isMain && (
                    <Badge className="ml-2 text-xs bg-blue-100 text-blue-800">
                      Original Message
                    </Badge>
                  )}
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Message Content */}
            <div className="text-gray-900 text-sm mb-2">{message.content}</div>

            {/* Message Actions */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <button className="flex items-center space-x-1 hover:text-gray-700">
                <Reply className="w-3 h-3" />
                <span>Reply</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-gray-700">
                <Share className="w-3 h-3" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-gray-700">
                <Bookmark className="w-3 h-3" />
                <span>Save</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-gray-700">
                <Flag className="w-3 h-3" />
                <span>Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RedditThread = ({ thread }: { thread: MessageThread }) => {
    const isCollapsed = collapsedThreads.has(thread.id);
    const voteCount = (thread.upvotesCount || 0) - (thread.downvotesCount || 0);
    const isUpvoted = upvotedMessages.has(thread.id);
    const isDownvoted = downvotedMessages.has(thread.id);

    return (
      <div
        className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
        onClick={() => setSelectedThread(thread)}
      >
        {/* Thread Header */}
        <div className="flex">
          {/* Voting Section */}
          <div
            className="flex flex-col items-center p-3 border-r border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleUpvote(thread.id)}
              disabled={isUpvoted}
              className={`p-1 rounded hover:bg-gray-100 ${
                isUpvoted ? "text-orange-500" : "text-gray-400"
              }`}
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <span
              className={`text-lg font-bold ${
                isUpvoted
                  ? "text-orange-500"
                  : isDownvoted
                    ? "text-blue-600"
                    : "text-gray-900"
              }`}
            >
              {voteCount}
            </span>
            <button
              onClick={() => handleDownvote(thread.id)}
              disabled={isDownvoted}
              className={`p-1 rounded hover:bg-gray-100 ${
                isDownvoted ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Thread Content */}
          <div className="flex-1 p-3">
            {/* Thread Meta */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <button
                  className="flex items-center space-x-2 hover:text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleThreadCollapse(thread.id);
                  }}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isCollapsed ? "rotate-180" : ""
                    }`}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {thread.participants.citizen.name}
                  </span>
                </button>
                <span className="text-xs text-gray-500">
                  {formatDate(thread.createdAt)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {getCategoryIcon(thread.category)}
                <span
                  className={`text-xs font-medium ${getUrgencyColor(
                    thread.urgency,
                  )}`}
                >
                  {thread.urgency}
                </span>
                <span
                  className={`text-xs font-medium ${getStatusColor(
                    thread.status?.replace("_", " ") || thread.status,
                  )}`}
                >
                  {thread.status?.replace("_", " ") || thread.status}
                </span>
              </div>
            </div>

            {/* Thread Title */}
            <h3 className="text-lg font-medium text-gray-900 mb-2 hover:underline">
              {thread.subject}
            </h3>

            {/* Thread Content Preview */}
            {!isCollapsed && (
              <div className="text-gray-700 text-sm mb-3 line-clamp-2">
                {thread.content}
              </div>
            )}

            {/* Thread Tags */}
            {!isCollapsed && (
              <div className="flex items-center space-x-2 mb-3">
                {thread.messageOrigin === "report_converted" && (
                  <Badge variant="outline" className="text-xs">
                    <span className="mr-1">From Report</span>
                  </Badge>
                )}
                {thread.messageOrigin === "report_escalated" && (
                  <Badge variant="outline" className="text-xs">
                    <span className="mr-1">Escalated</span>
                  </Badge>
                )}
                <span className="text-xs text-gray-500">
                  {thread.messages?.length || 0} comments
                </span>
              </div>
            )}

            {/* Thread Actions */}
            {!isCollapsed && (
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <button
                  className="flex items-center space-x-1 hover:text-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{thread.messages?.length || 0} Comments</span>
                </button>
                <button
                  className="flex items-center space-x-1 hover:text-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Share className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button
                  className="flex items-center space-x-1 hover:text-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedThread(thread);
                  }}
                  className="flex items-center space-x-1 hover:text-gray-700 text-blue-600"
                >
                  <span>View Thread</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Message List */}
      <div className="w-1/2 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-600">Messages in your jurisdiction</p>
        </div>

        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No messages found in your jurisdiction
            </div>
          ) : (
            messages.map((thread) => (
              <RedditThread key={thread.id} thread={thread} />
            ))
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="w-1/2 bg-gray-50 overflow-y-auto">
        {selectedThread ? (
          <div className="bg-white">
            {/* Thread Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedThread.subject}
                </h2>
                <Select
                  value={selectedThread.status}
                  onValueChange={(value) =>
                    handleStatusUpdate(selectedThread.id, value as any)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Thread Meta */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(selectedThread.category)}
                  <span className="capitalize">{selectedThread.category}</span>
                </div>
                <span
                  className={`font-medium ${getUrgencyColor(selectedThread.urgency)}`}
                >
                  {selectedThread.urgency}
                </span>
                {selectedThread.messageOrigin === "report_converted" && (
                  <Badge variant="outline" className="text-xs">
                    From Report
                  </Badge>
                )}
              </div>

              {/* Location Information */}
              {selectedThread.messageOrigin &&
                (selectedThread.messageOrigin === "report_converted" ||
                  selectedThread.messageOrigin === "report_escalated") && (
                  <div className="mt-3 p-3 bg-gray-50 rounded text-xs">
                    <div className="font-medium text-gray-700 mb-2">
                      Report Location:
                    </div>
                    <div className="space-y-1">
                      {selectedThread.jurisdiction.provinceId && (
                        <div>
                          Province: {selectedThread.jurisdiction.provinceId}
                        </div>
                      )}
                      {selectedThread.jurisdiction.districtId && (
                        <div>
                          District: {selectedThread.jurisdiction.districtId}
                        </div>
                      )}
                      {selectedThread.jurisdiction.constituencyId && (
                        <div>
                          Constituency:{" "}
                          {selectedThread.jurisdiction.constituencyId}
                        </div>
                      )}
                      {selectedThread.jurisdiction.municipalityId && (
                        <div>
                          Municipality:{" "}
                          {selectedThread.jurisdiction.municipalityId}
                        </div>
                      )}
                      {selectedThread.jurisdiction.wardId && (
                        <div>Ward: {selectedThread.jurisdiction.wardId}</div>
                      )}
                      {!selectedThread.jurisdiction.provinceId &&
                        !selectedThread.jurisdiction.districtId &&
                        !selectedThread.jurisdiction.constituencyId &&
                        !selectedThread.jurisdiction.municipalityId &&
                        !selectedThread.jurisdiction.wardId && (
                          <div className="text-orange-600">
                            Location information not available
                          </div>
                        )}
                    </div>
                  </div>
                )}
            </div>

            {/* Messages */}
            <div className="p-4 space-y-4">
              {selectedThread.messages?.map((message, index) => (
                <RedditMessage
                  key={message.id}
                  message={message}
                  isMain={index === 0}
                  level={0}
                />
              ))}
            </div>

            {/* Reply Form */}
            <div className="border-t border-gray-200 p-4">
              <div className="space-y-3">
                <Input
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleReply}
                    disabled={!replyText.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Select a message to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
