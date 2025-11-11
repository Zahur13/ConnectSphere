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

    const newUser = db.create("users", {
      ...userData,
      password: hashedPassword,
      bio: "",
      profilePicture: `https://ui-avatars.com/api/?name=${userData.name}&background=3b82f6&color=fff`,
      coverImage: "",
      followers: [],
      following: [],
    });

    const token = this.generateToken(newUser.id);
    this.setAuthData(token, newUser);

    return { user: this.sanitizeUser(newUser), token };
  }

  async login(email, password) {
    const user = db.findOne("users", (u) => u.email === email);

    if (!user || user.password !== btoa(password)) {
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
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setAuthData(token, user) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(
      this.USER_KEY,
      JSON.stringify(this.sanitizeUser(user))
    );
  }

  sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new AuthService();
