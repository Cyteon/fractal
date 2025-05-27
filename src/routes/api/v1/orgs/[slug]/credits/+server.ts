import prisma from "$lib/prisma";
import { Polar } from "@polar-sh/sdk";
import { POLAR_ACCESS_TOKEN, POLAR_ENVIRONMENT } from "$env/static/private";
import verify from "$lib/server/verify.server.js";

const polar = new Polar({
    accessToken: POLAR_ACCESS_TOKEN,
    server: POLAR_ENVIRONMENT as "production" | "sandbox",
});

export async function GET({ params, request }) {
    const { slug } = params;

    if (!slug) {
        return Response.json({ error: "Missing org slug" }, {
            status: 400,
        });
    }

    const user = await verify(request);

    if (!user) {
        return Response.json({ error: "Unauthorized" }, {
            status: 401,
        });
    }

    const org = await prisma.org.findUnique({
        where: {
            slug,
        },
        include: {
            members: true,
        },
    });

    if (!org) {
        return Response.json({ error: "Organization not found" }, {
            status: 404,
        });
    }

    const orgMembership = org.members.find((member) => member.userId === user.id);

    if (!orgMembership) {
        return Response.json({ error: "User not a member of the organization" }, {
            status: 403,
        });
    }

    if (!(orgMembership.role == "OWNER" || orgMembership.role == "ADMIN")) {
        return Response.json({ error: "Insufficient permissions" }, {
            status: 403,
        });
    }

    if (!org.customerMeterId) {
        return Response.json({
            creditsBought: 0,
            creditsUsed: 0,
            creditsBalance: 0,
        }, {
            status: 404,
        });
    }

    return Response.json({ error: "Not implemented" }, { status: 501 });
}