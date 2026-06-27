import { Schema, model } from 'mongoose';
import { IContentDocument } from './content.interface';
import { ContentType } from '../../constants/enums';

const contentSchema = new Schema<IContentDocument>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(ContentType),
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const Content = model<IContentDocument>('Content', contentSchema);
export default Content;
