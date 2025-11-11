class Notification {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.type = data.type; // 'like', 'comment', 'follow', 'post'
    this.fromUserId = data.fromUserId;
    this.toUserId = data.toUserId;
    this.postId = data.postId || null;
    this.commentId = data.commentId || null;
    this.message = data.message;
    this.read = data.read || false;
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

export default Notification;
