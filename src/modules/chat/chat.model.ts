import { Schema, model } from 'mongoose';
import { IChatSessionDocument, IChatMessageDocument } from './chat.interface';
import { MessageRole } from '../../constants/enums';

const chatSessionSchema = new Schema<IChatSessionDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const chatMessageSchema = new Schema<IChatMessageDocument>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'ChatSession',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(MessageRole),
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

export const ChatSession = model<IChatSessionDocument>('ChatSession', chatSessionSchema);
export const ChatMessage = model<IChatMessageDocument>('ChatMessage', chatMessageSchema);
