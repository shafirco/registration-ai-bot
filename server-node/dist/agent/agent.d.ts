import type { ChatRequest, ChatResponse } from './types.js';
export declare function handleChat(request: ChatRequest): Promise<ChatResponse>;
export declare function clearConversationMemory(conversationId: string): void;
export declare function clearAllMemories(): void;
//# sourceMappingURL=agent.d.ts.map