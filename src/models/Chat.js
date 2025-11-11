class Message {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.chatId = data.chatId;
    this.senderId = data.senderId;
    this.receiverId = data.receiverId;
    this.content = data.content;
    this.type = data.type || "text"; // text, image, emoji
    this.read = data.read || false;
    this.edited = data.edited || false;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

class Chat {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.participants = data.participants || []; // [userId1, userId2]
    this.lastMessage = data.lastMessage || null;
    this.lastMessageTime = data.lastMessageTime || null;
    this.unreadCount = data.unreadCount || {
      [data.participants[0]]: 0,
      [data.participants[1]]: 0,
    };
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }
}

export { Message, Chat };
