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

let productMap: Record<string, number> = {
    [PUBLIC_POLAR_PRODUCT_5000_CREDITS]: 5000,
};

export async function GET({ url, request, params }) {
    const checkoutId = url.searchParams.get("checkout_id");

    if (!checkoutId) {
        return Response.json({ error: "Missing checkout_id" }, {
            status: 400,
        });
    }

    const slug = params.slug;

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

    const checkout = await polar.checkouts.get({
        id: checkoutId,
    });

    const meters = await polar.customerMeters.list({
        customerId: checkout.customerId,
        limit: 1,
        sorting: ["created_at"]
    });

    let meter = null;

    for await (const results of meters) {
        meter = results.result.items[0];
        break;
    }

    if (!meter) {
        return Response.json({ error: "Meter not found" }, {
            status: 404,
        });
    }

    if (checkout.status !== "succeeded") {
        return Response.json({ error: "Checkout not succeeded" }, {
            status: 400,
        });
    }

    if (checkout.customerExternalId !== org.id) {
        return Response.json({ error: "Unprocessable checkout data" }, {
            status: 422,
        });
    }

    await prisma.org.update({
        where: {
            id: org.id,
        },
        data: {
            polarCustomerId: checkout.customerId,
            customerMeterId: meter.id,
        },
    });

    const creditsBought = productMap[checkout.productId] || 0;

    await prisma.auditLogEntry.create({
        data: {
            type: "billing",
            action: "buy_credits",
            humanReadable: `Bought ${creditsBought} credits`,
            userId: checkout.metadata.userId as string,
            orgId: checkout.customerExternalId as string,
        },
    });

    redirect(303, `${BASE_URL}/dash/${slug}/billing?success=true&message=${creditsBought} credits bought successfully`);
}