import prisma from "$lib/prisma";

export default async function verify(request: Request) {
    let token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
        // try to get token from cookie, tho we prefer auth header
        const cookies = request.headers.get("cookie");
        if (cookies) {
            const tokenMatch = cookies.match(/(?:^|; )token=([^;]*)/);
            token = tokenMatch?.[1];
        }
    }

    if (!token) {
        return null;
    }

    const tokenData = await prisma.token.findUnique({
        where: {
            token,
        },
        include: {
            user: true,
        },
    });

    if (!tokenData) {
        return null;
    }

    const user = tokenData.user;

    if (!user) {
        return null;
    }

    // i think ill do suspended checks on routes
    /*if (user.suspended) {
        return null;
    }*/

    return user;
}