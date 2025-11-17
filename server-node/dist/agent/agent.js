"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleChat = handleChat;
exports.clearConversationMemory = clearConversationMemory;
exports.clearAllMemories = clearAllMemories;
const openai_1 = require("@langchain/openai");
const agents_1 = require("langchain/agents");
const prompts_1 = require("@langchain/core/prompts");
const memory_1 = require("langchain/memory");
const index_js_1 = require("./tools/index.js");
const config_js_1 = require("./config.js");
// Initialize the LLM
const llm = new openai_1.ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
});
// Define the tools
const tools = [index_js_1.googleSheetsTool, index_js_1.deliveryStatusTool, index_js_1.messageTool];
// Create the prompt template
const prompt = prompts_1.ChatPromptTemplate.fromMessages([
    ['system', config_js_1.SYSTEM_PROMPT],
    new prompts_1.MessagesPlaceholder('chat_history'),
    ['human', '{input}'],
    new prompts_1.MessagesPlaceholder('agent_scratchpad'),
]);
// Create memory instances for each conversation
const conversationMemories = new Map();
// Get or create memory for a specific conversation
function getMemory(conversationId) {
    if (!conversationMemories.has(conversationId)) {
        conversationMemories.set(conversationId, new memory_1.BufferMemory({
            returnMessages: true,
            memoryKey: 'chat_history',
            inputKey: 'input',
            outputKey: 'output',
        }));
    }
    return conversationMemories.get(conversationId);
}
// Main function to handle chat
async function handleChat(request) {
    try {
        const { name, phone, message } = request;
        const conversationId = phone; // Use phone as conversation ID
        // Get memory for this conversation
        const memory = getMemory(conversationId);
        // Create the agent
        const agent = await (0, agents_1.createOpenAIFunctionsAgent)({
            llm,
            tools,
            prompt,
        });
        // Create the agent executor
        const agentExecutor = new agents_1.AgentExecutor({
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
            await index_js_1.messageTool.func({
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
function clearConversationMemory(conversationId) {
    conversationMemories.delete(conversationId);
}
// Clear all memories
function clearAllMemories() {
    conversationMemories.clear();
}
//# sourceMappingURL=agent.js.map