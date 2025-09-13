// In-memory storage for development when MongoDB is not available
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class InMemoryUserStorage {
  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }

  async findByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  }

  async create(userData) {
    const { name, email, password } = userData;
    
    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = {
      _id: this.nextId++,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(user._id, user);
    console.log(`User created in memory: ${user.email} (ID: ${user._id})`);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findById(id) {
    const user = this.users.get(parseInt(id));
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async comparePassword(userId, candidatePassword) {
    const user = this.users.get(parseInt(userId));
    if (!user) return false;
    return bcrypt.compare(candidatePassword, user.password);
  }

  getAllUsers() {
    return Array.from(this.users.values()).map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  clear() {
    this.users.clear();
    this.nextId = 1;
  }
}

export default new InMemoryUserStorage();
