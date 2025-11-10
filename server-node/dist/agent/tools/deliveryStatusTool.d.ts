import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
export declare const deliveryStatusTool: DynamicStructuredTool<z.ZodObject<{
    shipmentId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    shipmentId: string;
}, {
    shipmentId: string;
}>>;
//# sourceMappingURL=deliveryStatusTool.d.ts.map