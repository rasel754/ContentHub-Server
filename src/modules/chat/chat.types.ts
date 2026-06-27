import { MessageRole } from '../../constants/enums';

export type CreateSessionDTO = {
  userId: string;
  title: string;
};

export type AddMessageDTO = {
  sessionId: string;
  role: MessageRole;
  content: string;
};
