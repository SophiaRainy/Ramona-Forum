import mongoose from 'mongoose';
import User, { IUser } from '../User';

describe('User Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/testdb');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create & save user successfully', async () => {
    const userData: IUser = {
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123',
      role: 'user',
      membershipLevel: 'basic',
      currency: 0,
      createdAt: new Date(),
      followers: [],
      following: [],
      aiAssistantEnabled: false,
    };
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
  });

  // 添加更多测试...
});