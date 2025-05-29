import { Polar } from "@polar-sh/sdk";
import { POLAR_ACCESS_TOKEN, BASE_URL, POLAR_ENVIRONMENT } from "$env/static/private";
import { PUBLIC_POLAR_PRODUCT_5000_CREDITS } from "$env/static/public";
import verify from "$lib/server/verify.server";
import prisma from "$lib/prisma.js";
import { redirect } from "@sveltejs/kit";

const polar = new Polar({
    accessToken: POLAR_ACCESS_TOKEN,
    server: POLAR_ENVIRONMENT as "production" | "sandbox",
});

let creditsMap: Record<string, string> = {
    "5000": PUBLIC_POLAR_PRODUCT_5000_CREDITS,
};

export async function GET({ url, request, params }) {
    const amount = url.searchParams.get("amount");
    const slug = params.slug;

    if (!amount || !creditsMap[amount]) {
        return Response.json({ error: "Invalid or missing amount" }, {
            status: 400,
        });
    }

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

    const checkout = await polar.checkouts.create({
        products: [creditsMap[amount]],

        customerExternalId: org.id,
        metadata: {
            orgId: org.id,
            userId: user.id,
        },

        successUrl: BASE_URL + "/api/v1/orgs/" + slug + "/credits/buy/callback?checkout_id={CHECKOUT_ID}",
    });


    redirect(303, checkout.url);
}