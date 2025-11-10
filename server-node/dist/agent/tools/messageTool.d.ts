import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
export declare const messageTool: DynamicStructuredTool<z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    message: z.ZodString;
    response: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    name: string;
    phone: string;
    response: string;
}, {
    message: string;
    name: string;
    phone: string;
    response: string;
}>>;
//# sourceMappingURL=messageTool.d.ts.map