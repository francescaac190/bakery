import { z } from "zod";
export declare const createOrderSchema: z.ZodObject<{
    customerName: z.ZodString;
    customerPhone: z.ZodString;
    customerEmail: z.ZodOptional<z.ZodString>;
    fulfillmentType: z.ZodEnum<{
        PICKUP: "PICKUP";
        DELIVERY: "DELIVERY";
    }>;
    pickupAt: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
    deliveryAddress: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    items: z.ZodDefault<z.ZodArray<z.ZodObject<{
        productId: z.ZodString;
        quantity: z.ZodNumber;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    customCake: z.ZodOptional<z.ZodObject<{
        eventDate: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodString]>>;
        servings: z.ZodOptional<z.ZodNumber>;
        size: z.ZodOptional<z.ZodString>;
        flavor: z.ZodOptional<z.ZodString>;
        filling: z.ZodOptional<z.ZodString>;
        frosting: z.ZodOptional<z.ZodString>;
        messageOnCake: z.ZodOptional<z.ZodString>;
        designNotes: z.ZodOptional<z.ZodString>;
        allergies: z.ZodOptional<z.ZodString>;
        inspirationImage: z.ZodOptional<z.ZodString>;
        budgetCents: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const orderIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=orders.schemas.d.ts.map