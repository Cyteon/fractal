import prisma from "$lib/prisma";
import { Polar } from "@polar-sh/sdk";
import { POLAR_ACCESS_TOKEN, POLAR_ENVIRONMENT } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

const polar = new Polar({
    accessToken: POLAR_ACCESS_TOKEN,
    server: POLAR_ENVIRONMENT as "production" | "sandbox",
});

export async function GET({ request, url }) {
    const checkoutId = url.searchParams.get("checkoutId");

    if (!checkoutId) {
        return Response.json({ error: "Missing checkoutId" }, {
            status: 400,
        });
    }

    const checkout = await polar.checkouts.get({
        id: checkoutId,
    });

    if (!(checkout.status == "succeeded")) {
        return Response.json({ error: "Checkout not succeeded" }, {
            status: 400,
        });
    }

    const customerId = checkout.customerId;
    const metadata = checkout.metadata;
    const externalUserId = checkout.customerExternalId;

    let subscriptionId = null;

    const subscription = await polar.subscriptions.list({
        customerId,
        active: true,
        limit: 1,
        sorting: ["-started_at"]
    });

    for await (const sub of subscription) {
        subscriptionId = sub.result.items[0].id;
        break;
    }

    if (externalUserId !== metadata.orgId) {
        return Response.json({ error: "Unprocessable checkout data" }, {
            status: 422,
        });
    }

    if (!customerId) {
        return Response.json({ error: "Missing customerId" }, {
            status: 400,
        });
    }

    const org = await prisma.org.findUnique({
        where: {
            id: metadata.orgId,
        },
    });

    if (!org) {
        return Response.json({ error: "Org not found" }, {
            status: 404,
        });
    }

    await prisma.org.update({
        where: {
            id: org.id,
        },
        data: {
            subscribed: true,
            polarCustomerId: customerId,
            subscriptionCreatedAt: new Date(),
            subcriptionMadeByUserId: metadata.responsibleUserId as string,
            subscriptionId,
        },
    });

    try {
        await prisma.auditLogEntry.create({
            data: {
                type: "billing",
                action: "checkout",
                humanReadable: "Initiated and completed billing checkout",
                userId: metadata.responsibleUserId as string,
                orgId: metadata.orgId,
            },
        });
    } catch (e) {
        console.error("Failed to create audit log entry", e);
    }

    redirect(303, `/dash/${org.slug}/billing`);
}