// Local Storage Database Manager
class LocalDB {
  constructor() {
    this.initDB();
    this.seedData(); // Add seed data for testing
  }

  initDB() {
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify([]));
    }
    if (!localStorage.getItem("posts")) {
      localStorage.setItem("posts", JSON.stringify([]));
    }
    if (!localStorage.getItem("comments")) {
      localStorage.setItem("comments", JSON.stringify([]));
    }
  }

  // Add seed data for testing
  seedData() {
    const users = this.getAll("users");
    if (users.length === 0) {
      // Create some test users
      const testUsers = [
        {
          id: "1",
          name: "John Doe",
          username: "johndoe",
          email: "john@example.com",
          password: btoa("password123"),
          bio: "Software developer and tech enthusiast",
          profilePicture:
            "https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff",
          coverImage: "",
          followers: [],
          following: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Jane Smith",
          username: "janesmith",
          email: "jane@example.com",
          password: btoa("password123"),
          bio: "Designer and creative thinker",
          profilePicture:
            "https://ui-avatars.com/api/?name=Jane+Smith&background=ec4899&color=fff",
          coverImage: "",
          followers: [],
          following: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem("users", JSON.stringify(testUsers));
    }
  }

  // Generic CRUD operations
  getAll(collection) {
    const data = localStorage.getItem(collection);
    return data ? JSON.parse(data) : [];
  }

  getById(collection, id) {
    const items = this.getAll(collection);
    return items.find((item) => item.id === id);
  }

  create(collection, item) {
    const items = this.getAll(collection);
    const newItem = {
      ...item,
      id: item.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    localStorage.setItem(collection, JSON.stringify(items));
    return newItem;
  }

  update(collection, id, updates) {
    const items = this.getAll(collection);
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(collection, JSON.stringify(items));
      return items[index];
    }
    return null;
  }

  delete(collection, id) {
    const items = this.getAll(collection);
    const filtered = items.filter((item) => item.id !== id);
    localStorage.setItem(collection, JSON.stringify(filtered));
    return true;
  }

  findOne(collection, predicate) {
    const items = this.getAll(collection);
    return items.find(predicate);
  }

  filter(collection, predicate) {
    const items = this.getAll(collection);
    return items.filter(predicate);
  }
}

export default new LocalDB();
