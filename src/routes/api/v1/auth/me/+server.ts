import verify from '$lib/server/verify.server.js';
import prisma from '$lib/prisma.js';

export async function GET({ request }) {
    const user = await verify(request);

    if (!user) {
        return Response.json({ error: "Unauthorized" }, {
            status: 401,
        });
    }

    let orgs = await prisma.org.findMany({
        where: {
            members: {
                some: {
                    userId: user.id,
                },
            },
        },

        include: {
            members: {
                where: {
                    userId: user.id,
                },
            },
        },
    });

    return Response.json({
        user: {
            id: user.id,
            email: user.email,
            admin: user.admin,
            suspended: user.suspended,
        },
        orgs: orgs.map((org) => {
            return {
                id: org.id,
                name: org.name,
                slug: org.slug,
                role: org.members[0].role,
                subscribed: org.subscribed,
            };
        }),
    });
}