import prisma from "$lib/prisma";
import bcrypt from "bcrypt";

export async function POST({ request }) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return Response.json({ error: "Email and password are required" }, {
            status: 400,
        });
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        return Response.json({ error: "User already exists" }, {
            status: 409,
        });
    }

    const userCount = await prisma.user.count();

    try {
        const hash = await bcrypt.hash(password, 12);

        await prisma.user.create({
            data: {
                email,
                password: hash,
                admin: userCount === 0, // first user = admin
            },
        });

        return Response.json({ }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);

        return Response.json({ error: "User creation failed" }, {
            status: 500,
        });
    }
}