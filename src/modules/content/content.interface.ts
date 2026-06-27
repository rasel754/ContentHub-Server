import { Document } from 'mongoose';
import { ContentType } from '../../constants/enums';

export interface IContent {
  userId: string;
  prompt: string;
  type: ContentType;
  output: string;
  metadata?: Record<string, any>;
}

export interface IContentDocument extends IContent, Document {
  createdAt: Date;
  updatedAt: Date;
}
