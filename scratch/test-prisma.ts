import { prisma } from "../src/lib/prisma";

async function main() {
    try {
        console.log("Checking prisma.question...");
        if (prisma.question) {
            console.log("prisma.question is defined!");
        } else {
            console.log("prisma.question is UNDEFINED!");
            console.log("Available prisma models:", Object.keys(prisma).filter(k => !k.startsWith('$')));
        }
    } catch (error) {
        console.error("Error checking prisma:", error);
    }
}

main();
