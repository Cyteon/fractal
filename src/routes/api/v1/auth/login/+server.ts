import prisma from "$lib/prisma";
import bcrypt from "bcrypt";

export async function POST({ request }) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return Response.json({ error: "Email and password are required" }, {
            status: 400,
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        return Response.json({ error: "Invalid email or password" }, {
            status: 401,
        });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return Response.json({ error: "Invalid email or password" }, {
            status: 401,
        });
    }

    
    const bytes = new Uint8Array(48);
    crypto.getRandomValues(bytes);
    const token = btoa(String.fromCharCode(...bytes));

    await prisma.token.create({
        data: {
            token,
            userId: user.id,
        },
    });

    return Response.json({ token }, { status: 200 });
}