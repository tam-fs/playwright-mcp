//import { test } from '@playwright/test';
/**
 * Step decorator for logging method execution
 * @param message - Static string or function that generates message from method arguments
 * @returns Method decorator
 */
export function step(message: string | ((...args: any[]) => string)) {
    return function (
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor | void {
        // Skip if descriptor is undefined or not a method
        if (!descriptor || !descriptor.value || typeof descriptor.value !== 'function') {
            return;
        }

        const originalMethod = descriptor.value;
        
        descriptor.value = async function (...args: any[]) {
            // Generate the step title based on message type
            const title = typeof message === "function" 
                ? message(...args) 
                : message;
            
            console.log(`\n=== Step: ${title} ===`);
            
            try {
                const result = await originalMethod.apply(this, args);
                console.log(`=== Step: ${title} - Completed ===\n`);
                return result;
            } catch (error) {
                console.error(`=== Step: ${title} - Failed ===\n`, error);
                throw error;
            }
            // return await test.step(title, async () => {
            //     return await originalMethod.apply(this, args);
            // });
        };
        
        return descriptor;
    };
}