import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../modules/user/user.model';
import { Content } from '../modules/content/content.model';
import { ChatSession, ChatMessage } from '../modules/chat/chat.model';
import { UserRole } from '../constants/roles';
import { ContentType, MessageRole } from '../constants/enums';
import { clerkClient } from '@clerk/clerk-sdk-node';

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

    // 1. Sync and Seed User Accounts with Clerk
    console.log('🔄 Syncing demo users with Clerk...');
    const demoUsersData = [
      {
        email: 'admin@contenthub.ai',
        password: 'Admin!Demo!Secure!Pass!2026',
        firstName: 'Admin',
        lastName: 'Demo',
        role: UserRole.ADMIN,
        profileImageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
      },
      {
        email: 'manager@contenthub.ai',
        password: 'Manager!Demo!Secure!Pass!2026',
        firstName: 'Manager',
        lastName: 'Demo',
        role: UserRole.MANAGER,
        profileImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
      },
      {
        email: 'user@contenthub.ai',
        password: 'User!Demo!Secure!Pass!2026',
        firstName: 'User',
        lastName: 'Demo',
        role: UserRole.USER,
        profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      }
    ];

    const seededUsers: Record<UserRole, any> = {} as any;

    for (const data of demoUsersData) {
      console.log(`Checking Clerk for user: ${data.email}...`);
      const existingClerkUsers = await clerkClient.users.getUserList({ emailAddress: [data.email] });
      if (existingClerkUsers.data.length > 0) {
        console.log(`Deleting existing Clerk user: ${data.email}...`);
        await clerkClient.users.deleteUser(existingClerkUsers.data[0].id);
      }
      
      console.log(`Creating Clerk user: ${data.email}...`);
      const newClerkUser = await clerkClient.users.createUser({
        emailAddress: [data.email],
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        publicMetadata: { role: data.role },
      });

      console.log(`Seeding MongoDB user profile for: ${data.email}...`);
      const dbUser = await User.create({
        clerkId: newClerkUser.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        profileImageUrl: data.profileImageUrl,
      });

      seededUsers[data.role] = dbUser;
    }

    console.log('👤 Seeded all user profiles in MongoDB and Clerk.');

    // 2. Seed Content
    const sampleContent = await Content.create({
      userId: seededUsers[UserRole.USER].clerkId,
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
      userId: seededUsers[UserRole.USER].clerkId,
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
