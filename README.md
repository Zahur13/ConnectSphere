# ConnectSphere - Modern Social Media Platform 🌐

<div align="center">
  
![ConnectSphere](https://img.shields.io/badge/ConnectSphere-v1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

**A full-featured social media platform built with React and modern web technologies**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Technologies](#-technologies) • [Architecture](#-architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Key Implementations](#-key-implementations)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Overview

**ConnectSphere** is a modern, fully-functional social media web application inspired by platforms like Instagram and Twitter. Built entirely with React and using localStorage for data persistence, it demonstrates advanced front-end development techniques without requiring a backend server.

### 🎯 Key Highlights

- **No Backend Required** - Fully functional using localStorage
- **Real-time Features** - Instant updates without page refresh
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Production-Ready** - Complete with authentication, security, and error handling
- **Modern UI/UX** - Beautiful animations and intuitive interface

---

## ✨ Features

### 🔐 **Authentication System**

- User registration with validation
- Secure login with JWT-like tokens
- Password encryption (base64)
- Protected routes and auth guards
- Persistent sessions
- Auto-logout on token expiration

### 👤 **User Profiles**

- Customizable profiles with bio
- Profile picture and cover image upload
- Following/Followers system
- User statistics (posts, followers, following)
- Edit profile functionality
- Profile discovery (`/profile/:username`)

### 📝 **Post Management**

- Create posts with text and images
- Image upload with preview
- Delete own posts
- Character limit (280 characters)
- Rich text formatting
- Post timestamps with relative time

### 💬 **Social Interactions**

- **Like System**
  - Like/unlike posts
  - Real-time like counter
  - Animated like button
- **Comment System**
  - Add comments to posts
  - Real-time comment updates
  - Comment counter
  - Nested comment threads
- **Follow System**
  - Follow/unfollow users
  - Mutual follow indicators
  - Following-only feed

### 🔔 **Notification System**

- Real-time notifications for:
  - New followers
  - Post likes
  - Comments on posts
  - New posts from followed users
- Unread notification badges
- Mark as read functionality
- Notification filtering
- Sound alerts for new notifications
- Notification page with history

### 💌 **Direct Messaging (DM)**

- Real-time chat with followed users
- Message read receipts
- Typing indicators
- Online/offline status
- Emoji picker
- Message deletion
- Chat search
- Unread message counter
- Sound notifications for new messages

### 🔍 **Discovery Features**

- User search functionality
- Discover page with user suggestions
- Search by username, name, or email
- Instant search results
- User recommendations

### 📱 **Feed & Timeline**

- Personalized feed (following-only)
- Chronological timeline
- Auto-refresh capability
- Infinite scroll (pagination ready)
- Empty state handling

### ⚙️ **Settings & Preferences**

- Account settings
- Privacy controls
- Notification preferences
- Theme toggle (UI ready)
- Data management
- Account deletion option

### 🎨 **UI/UX Features**

- Responsive design (mobile, tablet, desktop)
- Dark mode support (UI ready)
- Smooth animations and transitions
- Loading states and skeletons
- Error boundaries
- Toast notifications
- Modal dialogs
- Dropdown menus

---

## 🛠 Technologies

### **Core Technologies**

| Technology   | Version | Purpose                     |
| ------------ | ------- | --------------------------- |
| React        | 18.2.0  | UI Framework                |
| Vite         | 4.4.0   | Build Tool & Dev Server     |
| React Router | 6.x     | Navigation & Routing        |
| Tailwind CSS | 3.3.0   | Utility-First CSS Framework |
| JavaScript   | ES6+    | Programming Language        |

### **Libraries & Tools**

| Library      | Purpose           |
| ------------ | ----------------- |
| Lucide React | Icon Library      |
| date-fns     | Date Formatting   |
| Context API  | State Management  |
| localStorage | Data Persistence  |
| Custom Hooks | Logic Reusability |

### **Development Tools**

- ESLint - Code Linting
- Prettier - Code Formatting
- PostCSS - CSS Processing
- Autoprefixer - CSS Vendor Prefixes

---

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

### 🚀 Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/connectsphere.git
cd connectsphere
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Start development server**

```bash
npm run dev
# or
yarn dev
```

4. **Open in browser**

```
http://localhost:5173
```

### 🏗 Build for Production

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

### 📱 Preview Production Build

```bash
npm run preview
# or
yarn preview
```

---

## 📁 Project Structure

```
connectsphere/
│
├── public/                      # Static assets
│   └── index.html
│
├── src/
│   ├── components/             # React components
│   │   ├── auth/              # Authentication components
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── AuthGuard.jsx
│   │   │
│   │   ├── chat/              # Chat/DM components
│   │   │   ├── ChatList.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── ChatBubble.jsx
│   │   │   ├── NewChatModal.jsx
│   │   │   └── EmojiPicker.jsx
│   │   │
│   │   ├── common/            # Shared components
│   │   │   ├── Navbar.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── PrivateRoute.jsx
│   │   │
│   │   ├── notifications/     # Notification components
│   │   │   └── NotificationDropdown.jsx
│   │   │
│   │   ├── posts/             # Post-related components
│   │   │   ├── PostCard.jsx
│   │   │   ├── CreatePostForm.jsx
│   │   │   ├── CreatePostModal.jsx
│   │   │   ├── PostList.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   └── LikeButton.jsx
│   │   │
│   │   └── profile/           # Profile components
│   │       ├── ProfileHeader.jsx
│   │       ├── ProfileStats.jsx
│   │       ├── EditProfileModal.jsx
│   │       └── FollowButton.jsx
│   │
│   ├── contexts/              # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   ├── NotificationContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── models/                # Data models
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Chat.js
│   │   └── Notification.js
│   │
│   ├── pages/                 # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── DiscoverPage.jsx
│   │   ├── MessagesPage.jsx
│   │   ├── NotificationsPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── NotFoundPage.jsx
│   │
│   ├── services/              # Business logic & API
│   │   ├── api/
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── postService.js
│   │   │   ├── chatService.js
│   │   │   ├── notificationService.js
│   │   │   └── commentService.js
│   │   │
│   │   └── storage/
│   │       ├── db.js          # localStorage manager
│   │       └── storageManager.js
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   ├── useNotifications.js
│   │   └── useLocalStorage.js
│   │
│   ├── styles/
│   │   └── globals.css        # Global styles & Tailwind
│   │
│   ├── App.jsx               # Main App component
│   ├── main.jsx             # Entry point
│   └── router.jsx           # Route definitions
│
├── .env                     # Environment variables
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js         # Vite configuration
└── README.md
```

---

## 🏗 Architecture

### **Application Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │    Pages     │  │  Components  │  │   Contexts   │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                  │                  │         │
│  ┌──────▼──────────────────▼──────────────────▼──────┐ │
│  │              Service Layer (API)                   │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │ │
│  │  │  Auth  │ │  User  │ │  Post  │ │  Chat  │    │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘    │ │
│  └──────────────────────┬─────────────────────────────┘ │
│                         │                               │
│  ┌──────────────────────▼─────────────────────────────┐ │
│  │           Storage Layer (localStorage)              │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │ │
│  │  │ Users  │ │ Posts  │ │ Chats  │ │Notifs  │    │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘    │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### **Data Flow**

1. **Component** triggers action
2. **Service** processes business logic
3. **Storage** persists data to localStorage
4. **Context** updates global state
5. **Components** re-render with new data

### **State Management**

- **Global State**: React Context API
  - AuthContext - User authentication
  - ChatContext - Messaging state
  - NotificationContext - Notification state
- **Local State**: useState/useReducer
  - Form inputs
  - UI toggles
  - Component-specific data

---

## 💡 Key Implementations

### **1. Authentication Flow**

```javascript
// JWT-like token generation
const generateToken = (userId) => {
  return `${userId}_${Date.now()}_${Math.random().toString(36)}`;
};

// Secure route protection
<Route element={<PrivateRoute />}>
  <Route path="/profile/:username" element={<ProfilePage />} />
</Route>;
```

### **2. Real-time Updates**

```javascript
// Custom event system for real-time updates
window.dispatchEvent(
  new CustomEvent("newMessage", {
    detail: { message, chatId, receiverId },
  })
);

// Listener for real-time updates
window.addEventListener("newMessage", handleNewMessage);
```

### **3. localStorage Database**

```javascript
// Generic CRUD operations
class LocalDB {
  getAll(collection) {
    /* ... */
  }
  getById(collection, id) {
    /* ... */
  }
  create(collection, item) {
    /* ... */
  }
  update(collection, id, updates) {
    /* ... */
  }
  delete(collection, id) {
    /* ... */
  }
}
```

### **4. Image Handling**

```javascript
// Convert images to base64 for localStorage
const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
```

### **5. Responsive Design**

```jsx
// Mobile-first responsive components
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Content */}
</div>
```

---

## 📸 Screenshots

<div align="center">

### Login Page

<img src="https://via.placeholder.com/800x450?text=Login+Page" alt="Login Page" width="800">

### Home Feed

<img src="https://via.placeholder.com/800x450?text=Home+Feed" alt="Home Feed" width="800">

### User Profile

<img src="https://via.placeholder.com/800x450?text=User+Profile" alt="User Profile" width="800">

### Direct Messages

<img src="https://via.placeholder.com/800x450?text=Direct+Messages" alt="Direct Messages" width="800">

### Discover Page

<img src="https://via.placeholder.com/800x450?text=Discover+Page" alt="Discover Page" width="800">

</div>

---

## 🔥 Performance Optimizations

- **Code Splitting** - Lazy loading of routes
- **Image Optimization** - Base64 encoding with size limits
- **Memoization** - React.memo for expensive components
- **Debouncing** - Search and typing indicators
- **Virtual Scrolling** - Ready for large lists
- **Caching** - localStorage caching strategies

---

## 🧪 Testing

```bash
# Run tests (setup required)
npm run test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🚀 Deployment

### Deploy to Netlify

```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --dir=dist --prod
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - _Initial work_ - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide React for the beautiful icons
- All contributors who have helped this project grow

---

## 📞 Support

For support, email support@connectsphere.com or open an issue in the GitHub repository.

---

## 🗺 Roadmap

- [ ] Add video upload support
- [ ] Implement stories feature
- [ ] Add voice/video calling
- [ ] Implement group chats
- [ ] Add real backend integration
- [ ] PWA support
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] AI-powered content recommendations
- [ ] Live streaming feature

---

<div align="center">

**Made with ❤️ by the ConnectSphere Team**

[⬆ Back to top](#connectsphere---modern-social-media-platform-)

</div>
