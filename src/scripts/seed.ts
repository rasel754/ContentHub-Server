import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../modules/user/user.model';
import { Content } from '../modules/content/content.model';
import { ChatSession, ChatMessage } from '../modules/chat/chat.model';
import { UserRole } from '../constants/roles';
import { ContentType, MessageRole } from '../constants/enums';

const seedDatabase = async (): Promise<void> => {
  try {
    console.log('🌱 Starting database seeding...');
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ Connected to MongoDB.');

    // Clear existing mock data
    await User.deleteMany({});
    await Content.deleteMany({});
    await ChatSession.deleteMany({});
    await ChatMessage.deleteMany({});
    console.log('🧹 Cleared existing collections.');

    // 1. Seed User Accounts
    const adminUser = await User.create({
      clerkId: 'user_admin_clerk_id_123',
      email: 'admin@ai-assistant.com',
      firstName: 'Admin',
      lastName: 'Supervisor',
      role: UserRole.ADMIN,
      profileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
    });

    const standardUser = await User.create({
      clerkId: 'user_normal_clerk_id_456',
      email: 'john.doe@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.USER,
      profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    });

    console.log(`👤 Seeded User profiles:
    - Admin: ${adminUser.email} (Clerk ID: ${adminUser.clerkId})
    - User: ${standardUser.email} (Clerk ID: ${standardUser.clerkId})`);

    // 2. Seed Content
    const sampleContent = await Content.create({
      userId: standardUser.clerkId,
      prompt: 'Why clean architecture matters',
      type: ContentType.BLOG,
      output: 'Clean Architecture segregates business logic from frameworks, making systems maintainable, testable, and robust against technological churn.',
      metadata: {
        model: 'gpt-4o-mini',
        generationTimeMs: 450,
        wordCount: 18,
      },
    });

    console.log(`📝 Seeded Content record: ${sampleContent._id}`);

    // 3. Seed Chat Thread
    const sampleSession = await ChatSession.create({
      userId: standardUser.clerkId,
      title: 'Coding Patterns Discussion',
    });

    await ChatMessage.create([
      {
        sessionId: sampleSession._id,
        role: MessageRole.USER,
        content: 'What is the SOLID S principle?',
      },
      {
        sessionId: sampleSession._id,
        role: MessageRole.ASSISTANT,
        content: 'Single Responsibility Principle states that a class or module should have one, and only one, reason to change, meaning it performs exactly one function.',
      },
    ]);

    console.log(`💬 Seeded Chat Session: "${sampleSession.title}" (${sampleSession._id}) with messages.`);
    console.log('🎉 Database seeding completed successfully.');
  } catch (error) {
    console.error('❌ Seeding process failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
};

seedDatabase();
export default seedDatabase;
