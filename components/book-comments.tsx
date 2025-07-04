"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Star, Send, MoreVertical, Edit, Trash2, Save, X } from "lucide-react"
import { useAuth } from "@/components/firebase-auth-provider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { getBookComments, addComment } from "@/lib/firebase-comments"
import { useLanguage } from "@/hooks/use-language"

interface Comment {
  id: string
  userId: string
  userName: string
  comment: string
  rating: number
  createdAt: string
  updatedAt?: string
  isEdited?: boolean
}

interface BookCommentsProps {
  bookId: string
}

export function BookComments({ bookId }: BookCommentsProps) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [editRating, setEditRating] = useState(0)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchComments()
  }, [bookId])

  const fetchComments = async () => {
    try {
      const commentsData = await getBookComments(bookId)
      setComments(commentsData)
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: t("signInRequired"),
        description: t("signInToComment"),
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: t("error"),
        description: t("commentRequired"),
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const commentData = await addComment({
        bookId,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userEmail: user.email || "",
        comment: newComment,
        rating: newRating,
      })

      if (commentData) {
        setComments([commentData, ...comments])
        setNewComment("")
        setNewRating(0)
        toast({
          title: t("commentAdded"),
          description: t("commentAddedSuccessfully"),
        })
      } else {
        throw new Error("Failed to add comment")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: t("error"),
        description: t("errorAddingComment"),
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditText(comment.comment)
    setEditRating(comment.rating)
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditText("")
    setEditRating(0)
  }

  const handleUpdateComment = async (commentId: string) => {
    if (!editText.trim()) {
      toast({
        title: t("error"),
        description: t("commentRequired"),
        variant: "destructive",
      })
      return
    }

    setUpdating(true)
    try {
      const response = await fetch(`/api/comments?commentId=${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: editText,
          rating: editRating,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Обновляем комментарий в локальном состоянии
        setComments(
          comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  comment: editText,
                  rating: editRating,
                  updatedAt: new Date().toISOString(),
                  isEdited: true,
                }
              : comment,
          ),
        )
        setEditingComment(null)
        setEditText("")
        setEditRating(0)
        toast({
          title: t("commentUpdated"),
          description: t("commentUpdatedSuccessfully"),
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error updating comment:", error)
      toast({
        title: t("error"),
        description: t("errorUpdatingComment"),
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    setDeleting(commentId)
    try {
      const response = await fetch(`/api/comments?commentId=${commentId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        setComments(comments.filter((comment) => comment.id !== commentId))
        toast({
          title: t("commentDeleted"),
          description: t("commentDeletedSuccessfully"),
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast({
        title: t("error"),
        description: t("errorDeletingComment"),
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  const averageRating = comments.length > 0 ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length : 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("reviewsAndComments")}</CardTitle>
            {comments.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 font-medium">{averageRating.toFixed(1)}</span>
                </div>
                <Badge variant="secondary">
                  {comments.length} {comments.length === 1 ? t("review") : t("reviews")}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Comment Form */}
          {user ? (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                  <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.displayName || "Anonymous"}</p>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewRating(star)}
                        className={cn(
                          "transition-colors",
                          star <= newRating ? "text-yellow-400" : "text-muted-foreground",
                        )}
                      >
                        <Star className={cn("h-4 w-4", star <= newRating && "fill-current")} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {newRating > 0 ? `${newRating}/5` : t("selectRating")}
                    </span>
                  </div>
                </div>
              </div>

              <Textarea
                placeholder={t("writeComment")}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />

              <Button onClick={handleSubmitComment} disabled={submitting || !newComment.trim()}>
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {t("posting")}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {t("postComment")}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground mb-4">{t("signInToComment")}</p>
              <Button asChild>
                <a href="/login">{t("signIn")}</a>
              </Button>
            </div>
          )}

          {/* Comments List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 bg-muted rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{comment.userName}</p>
                        {comment.rating > 0 && (
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "h-4 w-4",
                                  star <= comment.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                                )}
                              />
                            ))}
                          </div>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {formatDate(comment.createdAt)}
                          {comment.isEdited && (
                            <span className="ml-1 text-xs text-muted-foreground">({t("edited")})</span>
                          )}
                        </span>
                      </div>

                      {/* Actions Menu - только для автора комментария */}
                      {user && user.uid === comment.userId && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditComment(comment)}>
                              <Edit className="h-4 w-4 mr-2" />
                              {t("edit")}
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {t("delete")}
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>{t("deleteComment")}</AlertDialogTitle>
                                  <AlertDialogDescription>{t("deleteCommentConfirmation")}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteComment(comment.id)}
                                    disabled={deleting === comment.id}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {deleting === comment.id ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        {t("deleting")}
                                      </>
                                    ) : (
                                      t("delete")
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    {/* Comment Content - Edit Mode */}
                    {editingComment === comment.id ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setEditRating(star)}
                              className={cn(
                                "transition-colors",
                                star <= editRating ? "text-yellow-400" : "text-muted-foreground",
                              )}
                            >
                              <Star className={cn("h-4 w-4", star <= editRating && "fill-current")} />
                            </button>
                          ))}
                          <span className="ml-2 text-sm text-muted-foreground">
                            {editRating > 0 ? `${editRating}/5` : t("selectRating")}
                          </span>
                        </div>
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateComment(comment.id)}
                            disabled={updating || !editText.trim()}
                          >
                            {updating ? (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1" />
                                {t("saving")}
                              </>
                            ) : (
                              <>
                                <Save className="h-3 w-3 mr-1" />
                                {t("save")}
                              </>
                            )}
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit} disabled={updating}>
                            <X className="h-3 w-3 mr-1" />
                            {t("cancel")}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Comment Content - View Mode */
                      <p className="text-sm leading-relaxed">{comment.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("noCommentsYet")}</p>
              <p className="text-sm text-muted-foreground mt-2">{t("beFirstToComment")}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
