import cuid from "cuid";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

import type { Site } from ".prisma/client";
import type { Session } from "next-auth";
import { placeholderBlurhash } from "../utils";

// READ
export const getAllUsers = async () => {

    try {
        const users = await prisma.user.findMany({})
        return { users }

    } catch (error) {
        return { error }
    }

}

export const getUser = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id }
    })
    return user
}

// CREATE
export const createUser = async (name: string, email: string,) => {

    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
            }
        })
        return user

    } catch (error) {
        return { error }
    }

}

// UPDATE
export const updateUser = async (id: string, updateData: NextApiResponse<any>) => {
    const user = await prisma.user.update({
        where: {
            id
        },
        data: {
            ...updateData
        }
    })
    return user
}

// DELETE
export const deleteUser = async (id: string) => {
    const user = await prisma.user.delete({
        where: {
            id
        }
    })
    return user
}

// /**
//  * Get Site
//  *
//  * Fetches & returns either a single or all sites available depending on
//  * whether a `siteId` query parameter is provided. If not all sites are
//  * returned
//  *
//  * @param req - Next.js API Request
//  * @param res - Next.js API Response
//  * @param session - NextAuth.js session
//  */
// export async function getUser(
//     req: NextApiRequest,
//     res: NextApiResponse,
//     session: Session
// ): Promise<void | NextApiResponse<Array<Site> | (Site | null)>> {
//     const { userId } = req.query;

//     if (Array.isArray(userId))
//         return res
//             .status(400)
//             .end("Bad request. siteId parameter cannot be an array.");

//     if (!session.user.id)
//         return res.status(500).end("Server failed to get session user ID");

//     try {
//         if (userId) {
//             const settings = await prisma.site.findFirst({
//                 where: {
//                     id: userId,
//                     user: {
//                         id: session.user.id,
//                     },
//                 },
//             });

//             return res.status(200).json(settings);
//         }

//         const sites = await prisma.site.findMany({
//             where: {
//                 user: {
//                     id: session.user.id,
//                 },
//             },
//         });

//         return res.status(200).json(sites);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).end(error);
//     }
// }



// /**
//  * Create Site
//  *
//  * Creates a new site from a set of provided query parameters.
//  * These include:
//  *  - name
//  *  - description
//  *  - subdomain
//  *  - userId
//  *
//  * Once created, the sites new `siteId` will be returned.
//  *
//  * @param req - Next.js API Request
//  * @param res - Next.js API Response
//  */
// export async function createUser(
//     req: NextApiRequest,
//     res: NextApiResponse
// ): Promise<void | NextApiResponse<{
//     siteId: string;
// }>> {
//     const { name, email, password } = req.body;

//     try {
//         const user = await prisma.site.create({
//             data: {
//                 name: name,
//                 email: email,
//                 password: password,
//             },
//         });

//         return res.status(201).json({ user });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).end(error);
//     }
// }

// /**
//  * Delete Site
//  *
//  * Deletes a site from the database using a provided `siteId` query
//  * parameter.
//  *
//  * @param req - Next.js API Request
//  * @param res - Next.js API Response
//  */
// export async function deleteUser(
//     req: NextApiRequest,
//     res: NextApiResponse
// ): Promise<void | NextApiResponse> {
//     const session = await unstable_getServerSession(req, res, authOptions);
//     if (!session?.user.id) return res.status(401).end("Unauthorized");
//     const { userId } = req.query;

//     if (!userId || typeof userId !== "string") {
//         return res.status(400).json({ error: "Missing or misconfigured site ID" });
//     }

//     const user = await prisma.site.findFirst({
//         where: {
//             id: userId,
//             user: {
//                 id: session.user.id,
//             },
//         },
//     });
//     if (!user) return res.status(404).end("Site not found");

//     if (Array.isArray(userId))
//         return res
//             .status(400)
//             .end("Bad request. siteId parameter cannot be an array.");

//     try {
//         await prisma.$transaction([
//             prisma.post.deleteMany({
//                 where: {
//                     site: {
//                         id: userId,
//                     },
//                 },
//             }),
//             prisma.site.delete({
//                 where: {
//                     id: userId,
//                 },
//             }),
//         ]);

//         return res.status(200).end();
//     } catch (error) {
//         console.error(error);
//         return res.status(500).end(error);
//     }
// }

/**
 * Update site
 *
 * Updates a site & all of its data using a collection of provided
 * query parameters. These include the following:
 *  - id
 *  - currentSubdomain
 *  - name
 *  - description
 *  - image
 *  - imageBlurhash
 *
//  * @param req - Next.js API Request
//  * @param res - Next.js API Response
//  */
// export async function updateUser(
//     req: NextApiRequest,
//     res: NextApiResponse
// ): Promise<void | NextApiResponse<Site>> {
//     const session = await unstable_getServerSession(req, res, authOptions);
//     if (!session?.user.id) return res.status(401).end("Unauthorized");

//     const {
//         id,
//         currentSubdomain,
//         name,
//         description,
//         font,
//         image,
//         imageBlurhash,
//     } = req.body;

//     if (!id || typeof id !== "string") {
//         return res.status(400).json({ error: "Missing or misconfigured site ID" });
//     }

//     const site = await prisma.site.findFirst({
//         where: {
//             id,
//             user: {
//                 id: session.user.id,
//             },
//         },
//     });
//     if (!site) return res.status(404).end("Site not found");

//     const sub = req.body.subdomain.replace(/[^a-zA-Z0-9/-]+/g, "");
//     const subdomain = sub.length > 0 ? sub : currentSubdomain;

//     try {
//         const response = await prisma.site.update({
//             where: {
//                 id: id,
//             },
//             data: {
//                 name,
//                 description,
//                 font,
//                 subdomain,
//                 image,
//                 imageBlurhash,
//             },
//         });

//         return res.status(200).json(response);
//     } catch (error) {
//         console.error(error);
//         return res.status(500).end(error);
//     }
// }
