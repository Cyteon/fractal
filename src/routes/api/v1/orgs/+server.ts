import prisma from "$lib/prisma";
import verify from "$lib/server/verify.server";

export async function PUT({ request }) {
    const user = await verify(request);

    if (!user) {
        return Response.json({ error: "Unauthorized" }, {
            status: 401,
        });
    }

    if (user.suspended) {
        return Response.json({ error: "Your account has been suspended" }, {
            status: 403,
        });
    }

    const { name, slug } = await request.json();

    if (!name || !slug) {
        return Response.json({ error: "Name and slug are required" }, {
            status: 400,
        });
    }

    const exists = await prisma.org.findUnique({
        where: {
            slug,
        },
    });

    if (exists) {
        return Response.json({ error: "Org with this slug already exists" }, {
            status: 409,
        });
    }

    const org = await prisma.org.create({
        data: {
            name,
            slug,
            members: {
                create: {
                    userId: user.id,
                    role: "OWNER",
                },
            },
        },
    });

    return Response.json({
        id: org.id,
        name: org.name,
        slug: org.slug,
    }, {
        status: 201,
    });
}