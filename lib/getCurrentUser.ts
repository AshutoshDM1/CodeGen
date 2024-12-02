import { auth } from "@/auth";
import { prismaClient } from "@/lib/db";

export async function getCurrentUser() {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return null;
        }

        const currentUser = await db.user.findUnique({
            where: {
                email: session.user.email
            }
        });

        if (!currentUser) {
            return null;
        }

        return currentUser;
    } catch {
        return null;
    }
}

export default getCurrentUser;