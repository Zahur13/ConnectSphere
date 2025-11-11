import db from "../storage/db";

class AuthService {
  constructor() {
    this.TOKEN_KEY = "auth_token";
    this.USER_KEY = "current_user";
  }

  generateToken(userId) {
    return `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async register(userData) {
    // Validate input
    if (!userData.username || !userData.email || !userData.password) {
      throw new Error("Username, email and password are required");
    }

    // Check if user exists
    const existingUser = db.findOne(
      "users",
      (u) => u.email === userData.email || u.username === userData.username
    );

    if (existingUser) {
      throw new Error("User already exists with this email or username");
    }

    // Hash password (in real app, use bcrypt)
    const hashedPassword = btoa(userData.password);

    // Ensure username is lowercase and trimmed
    const username = userData.username.toLowerCase().trim();

    const newUser = {
      ...userData,
      username: username,
      password: hashedPassword,
      bio: "",
      profilePicture:
        userData.profilePicture ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          userData.name
        )}&background=3b82f6&color=fff`,
      coverImage: "",
      followers: [],
      following: [],
    };

    const createdUser = db.create("users", newUser);
    const token = this.generateToken(createdUser.id);
    this.setAuthData(token, createdUser);

    return { user: this.sanitizeUser(createdUser), token };
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = db.findOne("users", (u) => u.email === email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (user.password !== btoa(password)) {
      throw new Error("Invalid credentials");
    }

    const token = this.generateToken(user.id);
    this.setAuthData(token, user);

    return { user: this.sanitizeUser(user), token };
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getCurrentUser() {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);
      // Ensure user has all required fields
      if (!user.username) {
        console.error("Current user missing username");
        return null;
      }
      return user;
    } catch (error) {
      console.error("Error parsing current user:", error);
      return null;
    }
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setAuthData(token, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    const sanitizedUser = this.sanitizeUser(user);
    localStorage.setItem(this.USER_KEY, JSON.stringify(sanitizedUser));
  }

  sanitizeUser(user) {
    if (!user) return null;
    const { password, ...sanitized } = user;
    return sanitized;
  }

  isAuthenticated() {
    return !!this.getToken() && !!this.getCurrentUser();
  }
}

export default new AuthService();
