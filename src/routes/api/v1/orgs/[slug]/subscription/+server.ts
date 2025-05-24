import prisma from "$lib/prisma";
import { Polar } from "@polar-sh/sdk";
import { POLAR_ACCESS_TOKEN, POLAR_ENVIRONMENT } from "$env/static/private";
import verify from "$lib/server/verify.server.js";
import type { SubscriptionMeter } from "@polar-sh/sdk/models/components/subscriptionmeter.js";

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

    if (!org.subscriptionId) {
        return Response.json({ error: "Organization does not have a subscription" }, {
            status: 404,
        });
    }

    const subscription = await polar.subscriptions.get({
        id: org.subscriptionId
    });

    if (!subscription) {
        return Response.json({ error: "Subscription not found" }, {
            status: 404,
        });
    }

    if (subscription.metadata.orgId !== org.id) {
        return Response.json({ error: "Unprocessable subscription data, contact support" }, {
            status: 500,
        });
    }

    let handledMeterIDs: string[] = [];
    let meters = [];

    subscription.meters.map((meter) => {
        if (handledMeterIDs.includes(meter.meterId)) {
            return undefined; // there was duplicate?
        }

        handledMeterIDs.push(meter.meterId);

        meters.push({
            id: meter.meterId,
            name: meter.meter.name,
            consumedUnits: meter.consumedUnits,
            price: parseFloat(
                subscription.prices.find((price) => (price.meterId || "") === meter.meterId).unitAmount
            ) / 100, // cause its in cents it appears
        });
    });

    return Response.json({
        subscription: {
            name: subscription.product.name,
            createdAt: subscription.createdAt,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            status: subscription.status,
            amount: subscription.amount,
            meters,
        },
    });
}