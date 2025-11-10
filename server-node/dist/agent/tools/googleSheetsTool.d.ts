import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
export declare const googleSheetsTool: DynamicStructuredTool<z.ZodObject<{
    action: z.ZodEnum<["read", "write", "update"]>;
    phone: z.ZodString;
    data: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
        lastOrder: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        name?: string | undefined;
        address?: string | undefined;
        lastOrder?: string | undefined;
    }, {
        email?: string | undefined;
        name?: string | undefined;
        address?: string | undefined;
        lastOrder?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    action: "read" | "write" | "update";
    phone: string;
    data?: {
        email?: string | undefined;
        name?: string | undefined;
        address?: string | undefined;
        lastOrder?: string | undefined;
    } | undefined;
}, {
    action: "read" | "write" | "update";
    phone: string;
    data?: {
        email?: string | undefined;
        name?: string | undefined;
        address?: string | undefined;
        lastOrder?: string | undefined;
    } | undefined;
}>>;
//# sourceMappingURL=googleSheetsTool.d.ts.map