import React, { useEffect, useState, type ReactNode } from "react";
import {
  MessageSquare,
  AlertCircle,
  ChevronDown,
  Send,
  MapPin,
  ArrowBigUp,
  ArrowBigDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  messagesApi,
  reportsApi,
  type MessageThread,
  type ReportDiscussionComment,
  type ReportDiscussionThread,
} from "@/services/api";
import { PERMISSIONS } from "@/constants/permission.constants";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";

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
  const [collapsedThreads, setCollapsedThreads] = useState<Set<string>>(
    new Set(),
  );
  const [discussionThread, setDiscussionThread] =
    useState<ReportDiscussionThread | null>(null);
  const [discussionLoading, setDiscussionLoading] = useState(false);
  const [discussionDraft, setDiscussionDraft] = useState("");
  const [activeReplyTargetId, setActiveReplyTargetId] = useState<string | null>(
    null,
  );
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [submittingReply, setSubmittingReply] = useState(false);
  const [submittingDiscussion, setSubmittingDiscussion] = useState(false);
  const [submittingVote, setSubmittingVote] = useState<string | null>(null);

  useEffect(() => {
    void loadMessages();
  }, []);

  useEffect(() => {
    if (!selectedThread?.sourceReportId) {
      setDiscussionThread(null);
      setDiscussionDraft("");
      setReplyDrafts({});
      setActiveReplyTargetId(null);
      return;
    }

    void loadDiscussion(selectedThread.sourceReportId);
  }, [selectedThread?.sourceReportId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await messagesApi.getJurisdictionMessages();
      setMessages(data);
      setSelectedThread((current) => {
        if (!current) {
          return data[0] || null;
        }

        return data.find((thread) => thread.id === current.id) || current;
      });
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const loadDiscussion = async (reportId: string) => {
    try {
      setDiscussionLoading(true);
      const thread = await reportsApi.getDiscussion(reportId);
      setDiscussionThread(thread);
    } catch (error) {
      console.error("Failed to load discussion:", error);
      setDiscussionThread(null);
    } finally {
      setDiscussionLoading(false);
    }
  };

  const refreshSelectedThread = async (threadId: string) => {
    const updatedThread = await messagesApi.getById(threadId);
    setSelectedThread(updatedThread);
    setMessages((current) =>
      current.map((thread) => (thread.id === threadId ? updatedThread : thread)),
    );
  };

  const handleReply = async () => {
    if (!selectedThread || !replyText.trim() || !canReplyMessages) return;

    try {
      setSubmittingReply(true);
      await messagesApi.addReply(selectedThread.id, replyText.trim());
      setReplyText("");
      await refreshSelectedThread(selectedThread.id);
    } catch (error) {
      console.error("Failed to send reply:", error);
      toast.error("Failed to send reply");
    } finally {
      setSubmittingReply(false);
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
      await refreshSelectedThread(messageId);
      await loadMessages();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleJoinDiscussion = async () => {
    if (!selectedThread?.sourceReportId) return;

    try {
      setSubmittingDiscussion(true);
      const thread = await reportsApi.joinDiscussion(selectedThread.sourceReportId);
      setDiscussionThread(thread);
      toast.success("Joined discussion");
    } catch (error) {
      console.error("Failed to join discussion:", error);
      toast.error("Failed to join discussion");
    } finally {
      setSubmittingDiscussion(false);
    }
  };

  const handleAddDiscussionComment = async () => {
    if (!selectedThread?.sourceReportId || !discussionDraft.trim()) return;

    try {
      setSubmittingDiscussion(true);
      const thread = await reportsApi.addDiscussionComment(
        selectedThread.sourceReportId,
        discussionDraft.trim(),
      );
      setDiscussionThread(thread);
      setDiscussionDraft("");
    } catch (error) {
      console.error("Failed to post comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setSubmittingDiscussion(false);
    }
  };

  const handleReplyToDiscussionComment = async (commentId: string) => {
    if (!selectedThread?.sourceReportId) return;
    const content = replyDrafts[commentId]?.trim();
    if (!content) return;

    try {
      setSubmittingDiscussion(true);
      const thread = await reportsApi.replyToDiscussionComment(
        selectedThread.sourceReportId,
        commentId,
        content,
      );
      setDiscussionThread(thread);
      setReplyDrafts((current) => ({ ...current, [commentId]: "" }));
      setActiveReplyTargetId(null);
    } catch (error) {
      console.error("Failed to send discussion reply:", error);
      toast.error("Failed to send discussion reply");
    } finally {
      setSubmittingDiscussion(false);
    }
  };

  const handleVoteOnDiscussionComment = async (
    commentId: string,
    direction: "up" | "down",
  ) => {
    if (!selectedThread?.sourceReportId) return;

    try {
      setSubmittingVote(commentId);
      const thread = await reportsApi.voteOnDiscussionComment(
        selectedThread.sourceReportId,
        commentId,
        direction,
      );
      setDiscussionThread(thread);
    } catch (error) {
      console.error("Failed to record discussion vote:", error);
      toast.error("Failed to record discussion vote");
    } finally {
      setSubmittingVote(null);
    }
  };

  const toggleThreadCollapse = (threadId: string) => {
    setCollapsedThreads((prev) => {
      const next = new Set(prev);
      if (next.has(threadId)) {
        next.delete(threadId);
      } else {
        next.add(threadId);
      }
      return next;
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
    switch (String(category).toLowerCase()) {
      case "complaint":
        return <AlertCircle className="w-4 h-4" />;
      case "suggestion":
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const renderDiscussionComments = (
    comments: ReportDiscussionComment[],
    level = 0,
  ): ReactNode =>
    comments.map((comment) => (
      <div
        key={comment.id}
        className={`space-y-3 ${level > 0 ? "ml-4 border-l border-gray-200 pl-4" : ""}`}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {comment.author.isReportOwner
                  ? `${comment.author.displayName} • Report Creator`
                  : comment.author.displayName}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-600">
              {comment.author.role}
            </span>
          </div>
          <p className="mt-3 text-sm text-gray-700">{comment.content}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 rounded-full bg-gray-50 px-1 py-1">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${
                  comment.currentUserVote === "up"
                    ? "text-orange-600"
                    : "text-gray-500"
                }`}
                onClick={() => handleVoteOnDiscussionComment(comment.id, "up")}
                disabled={submittingVote === comment.id}
              >
                <ArrowBigUp className="h-4 w-4" />
              </Button>
              <span className="min-w-8 text-center text-xs font-semibold text-gray-700">
                {comment.upvotesCount - comment.downvotesCount}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${
                  comment.currentUserVote === "down"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() =>
                  handleVoteOnDiscussionComment(comment.id, "down")
                }
                disabled={submittingVote === comment.id}
              >
                <ArrowBigDown className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-xs text-gray-500">
              {comment.upvotesCount} upvotes • {comment.downvotesCount} downvotes
            </span>
            {comment.canReply && (
              <Button
                variant="ghost"
                className="px-0 text-sm text-blue-600 hover:text-blue-700"
                onClick={() =>
                  setActiveReplyTargetId((current) =>
                    current === comment.id ? null : comment.id,
                  )
                }
              >
                Reply
              </Button>
            )}
          </div>
          {activeReplyTargetId === comment.id && (
            <div className="mt-3 space-y-2">
              <Textarea
                value={replyDrafts[comment.id] || ""}
                onChange={(e) =>
                  setReplyDrafts((current) => ({
                    ...current,
                    [comment.id]: e.target.value,
                  }))
                }
                placeholder="Write a reply..."
                className="min-h-[90px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveReplyTargetId(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleReplyToDiscussionComment(comment.id)}
                  disabled={
                    submittingDiscussion ||
                    !(replyDrafts[comment.id] || "").trim()
                  }
                >
                  Reply
                </Button>
              </div>
            </div>
          )}
        </div>
        {comment.replies?.length > 0 &&
          renderDiscussionComments(comment.replies, level + 1)}
      </div>
    ));

  const ThreadListCard = ({ thread }: { thread: MessageThread }) => {
    const isCollapsed = collapsedThreads.has(thread.id);

    return (
      <div
        className="cursor-pointer rounded-lg border border-gray-200 bg-white transition-colors hover:border-gray-300"
        onClick={() => setSelectedThread(thread)}
      >
        <div className="p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                className="flex items-center space-x-2 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleThreadCollapse(thread.id);
                }}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isCollapsed ? "-rotate-90" : "rotate-0"
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
              <span className={`text-xs font-medium ${getUrgencyColor(thread.urgency)}`}>
                {thread.urgency}
              </span>
              <span className={`text-xs font-medium ${getStatusColor(thread.status)}`}>
                {thread.status.replace("_", " ")}
              </span>
            </div>
          </div>

          <h3 className="mb-2 text-lg font-medium text-gray-900 hover:underline">
            {thread.subject}
          </h3>

          {!isCollapsed && (
            <>
              <div className="mb-3 line-clamp-2 text-sm text-gray-700">
                {thread.content}
              </div>
              <div className="mb-3 flex items-center space-x-2">
                {thread.messageOrigin === "report_converted" && (
                  <Badge variant="outline" className="text-xs">
                    From Report
                  </Badge>
                )}
                {thread.messageOrigin === "report_escalated" && (
                  <Badge variant="outline" className="text-xs">
                    Escalated
                  </Badge>
                )}
                <span className="text-xs text-gray-500">
                  {thread.messages?.length || 0} messages
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex flex-1 items-center justify-center">
          <div className="text-gray-500">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/2 overflow-y-auto border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-4">
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-600">Messages in your jurisdiction</p>
        </div>

        <div className="space-y-4 p-4">
          {messages.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No messages found in your jurisdiction
            </div>
          ) : (
            messages.map((thread) => (
              <ThreadListCard key={thread.id} thread={thread} />
            ))
          )}
        </div>
      </div>

      <div className="w-1/2 overflow-y-auto bg-gray-50">
        {selectedThread ? (
          <div className="space-y-4 bg-white p-4">
            <div className="border-b border-gray-200 pb-4">
              <div className="mb-3 flex items-center justify-between">
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

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(selectedThread.category)}
                  <span className="capitalize">{selectedThread.category}</span>
                </div>
                <span className={`font-medium ${getUrgencyColor(selectedThread.urgency)}`}>
                  {selectedThread.urgency}
                </span>
                {selectedThread.messageOrigin === "report_converted" && (
                  <Badge variant="outline" className="text-xs">
                    From Report
                  </Badge>
                )}
              </div>

              {(selectedThread.messageOrigin === "report_converted" ||
                selectedThread.messageOrigin === "report_escalated") && (
                <div className="mt-3 rounded bg-gray-50 p-3 text-xs">
                  <div className="mb-2 flex items-center gap-2 font-medium text-gray-700">
                    <MapPin className="h-3.5 w-3.5" />
                    Report Location
                  </div>
                  <div className="space-y-1 text-gray-600">
                    {selectedThread.jurisdiction.provinceId && (
                      <div>Province: {selectedThread.jurisdiction.provinceId}</div>
                    )}
                    {selectedThread.jurisdiction.districtId && (
                      <div>District: {selectedThread.jurisdiction.districtId}</div>
                    )}
                    {selectedThread.jurisdiction.constituencyId && (
                      <div>
                        Constituency: {selectedThread.jurisdiction.constituencyId}
                      </div>
                    )}
                    {selectedThread.jurisdiction.municipalityId && (
                      <div>
                        Municipality: {selectedThread.jurisdiction.municipalityId}
                      </div>
                    )}
                    {selectedThread.jurisdiction.wardId && (
                      <div>Ward: {selectedThread.jurisdiction.wardId}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Report Conversation
                  </h3>
                  <p className="text-sm text-gray-600">
                    Private conversation between the report creator and assigned
                    politicians.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedThread.messages?.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`rounded-xl border p-3 ${
                      message.senderType === "citizen"
                        ? "border-red-100 bg-red-50/70"
                        : "border-blue-100 bg-blue-50/70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {message.senderType === "citizen"
                          ? selectedThread.participants.citizen.name
                          : "Representative office"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>

              {canReplyMessages && (
                <div className="mt-4 space-y-3">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Reply to this report conversation..."
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleReply}
                      disabled={submittingReply || !replyText.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {selectedThread.sourceReportId && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Community Discussion
                      </h3>
                      <p className="text-sm text-gray-600">
                        Public nested discussion for this approved report.
                      </p>
                    </div>
                  </div>
                  {!discussionThread?.hasJoined && (
                    <Button
                      onClick={handleJoinDiscussion}
                      disabled={submittingDiscussion}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Join Thread
                    </Button>
                  )}
                </div>

                {discussionLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                      <div
                        key={index}
                        className="h-16 animate-pulse rounded-lg bg-gray-100"
                      />
                    ))}
                  </div>
                ) : discussionThread ? (
                  <>
                    <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                      {discussionThread.participantCount} participants joined
                      this discussion.
                    </div>

                    <div className="mt-4 space-y-3">
                      <Textarea
                        value={discussionDraft}
                        onChange={(e) => setDiscussionDraft(e.target.value)}
                        placeholder="Add a top-level comment to the discussion..."
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleAddDiscussionComment}
                          disabled={
                            submittingDiscussion || !discussionDraft.trim()
                          }
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Comment
                        </Button>
                      </div>
                    </div>

                    {discussionThread.comments.length > 0 ? (
                      <div className="mt-4 space-y-4">
                        {renderDiscussionComments(discussionThread.comments)}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-lg bg-gray-50 px-3 py-4 text-sm text-gray-600">
                        No discussion comments yet. Start the thread with a
                        top-level comment.
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-lg bg-amber-50 px-3 py-3 text-sm text-amber-900">
                    Discussion could not be loaded for this report yet.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p>Select a message to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
