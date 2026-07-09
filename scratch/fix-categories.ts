import { prisma } from "../src/lib/prisma";

async function main() {
    try {
        const categories = await prisma.category.findMany();
        console.log("Existing categories:", JSON.stringify(categories, null, 2));
        
        if (categories.length === 0) {
            console.log("No categories found. Creating a default category...");
            const defaultCategory = await prisma.category.create({
                data: {
                    name: "General",
                    slug: "general",
                    description: "Default category for questions",
                }
            });
            console.log("Default category created:", JSON.stringify(defaultCategory, null, 2));
        }
    } catch (error) {
        console.error("Error checking/creating categories:", error);
    }
}

main();
