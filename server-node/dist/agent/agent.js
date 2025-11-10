import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { BufferMemory } from 'langchain/memory';
import { googleSheetsTool, deliveryStatusTool, messageTool } from './tools/index.js';
import { SYSTEM_PROMPT } from './config.js';
// Initialize the LLM
const llm = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
});
// Define the tools
const tools = [googleSheetsTool, deliveryStatusTool, messageTool];
// Create the prompt template
const prompt = ChatPromptTemplate.fromMessages([
    ['system', SYSTEM_PROMPT],
    new MessagesPlaceholder('chat_history'),
    ['human', '{input}'],
    new MessagesPlaceholder('agent_scratchpad'),
]);
// Create memory instances for each conversation
const conversationMemories = new Map();
// Get or create memory for a specific conversation
function getMemory(conversationId) {
    if (!conversationMemories.has(conversationId)) {
        conversationMemories.set(conversationId, new BufferMemory({
            returnMessages: true,
            memoryKey: 'chat_history',
            inputKey: 'input',
            outputKey: 'output',
        }));
    }
    return conversationMemories.get(conversationId);
}
// Main function to handle chat
export async function handleChat(request) {
    try {
        const { name, phone, message } = request;
        const conversationId = phone; // Use phone as conversation ID
        // Get memory for this conversation
        const memory = getMemory(conversationId);
        // Create the agent
        const agent = await createOpenAIFunctionsAgent({
            llm,
            tools,
            prompt,
        });
        // Create the agent executor
        const agentExecutor = new AgentExecutor({
            agent,
            tools,
            memory,
            verbose: true,
            maxIterations: 5,
        });
        // Prepare the input with context
        const input = `${name} (טלפון: ${phone}) אומר: ${message}`;
        // Execute the agent
        const result = await agentExecutor.invoke({
            input,
        });
        // Extract actions from intermediate steps
        const actions = [];
        if (result.intermediateSteps && Array.isArray(result.intermediateSteps)) {
            for (const step of result.intermediateSteps) {
                if (step.action && step.action.tool) {
                    actions.push(`${step.action.tool}`);
                }
            }
        }
        // Log the conversation to Google Sheets
        try {
            await messageTool.func({
                name,
                phone,
                message,
                response: result.output || 'אין תשובה',
            });
        }
        catch (logError) {
            console.error('Error logging to Google Sheets:', logError);
        }
        return {
            reply: result.output || 'מצטער, אני לא יכול לעזור כרגע.',
            actions,
            timestamp: new Date().toISOString(),
        };
    }
    catch (error) {
        console.error('Error in handleChat:', error);
        return {
            reply: 'מצטער, אירעה שגיאה. אנא נסה שוב מאוחר יותר.',
            actions: ['error'],
            timestamp: new Date().toISOString(),
        };
    }
}
// Clear memory for a specific conversation
export function clearConversationMemory(conversationId) {
    conversationMemories.delete(conversationId);
}
// Clear all memories
export function clearAllMemories() {
    conversationMemories.clear();
}
//# sourceMappingURL=agent.js.map