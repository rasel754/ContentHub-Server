import { Document, Types } from 'mongoose';
import { MessageRole } from '../../constants/enums';

export interface IChatSession {
  userId: string;
  title: string;
}

export interface IChatSessionDocument extends IChatSession, Document {
  createdAt: Date;
  updatedAt: Date;
}

export interface IChatMessage {
  sessionId: Types.ObjectId | string;
  role: MessageRole;
  content: string;
}

export interface IChatMessageDocument extends IChatMessage, Document {
  createdAt: Date;
}
