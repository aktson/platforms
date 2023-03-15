import { createUser, deleteUser, getAllUsers, getUser, updateUser } from "@/lib/api/user";
import { NextApiRequest, NextApiResponse } from "next";
// import { getServerSession } from "next-auth/next";

// import { authOptions } from "./auth/[...nextauth]";
// import { HttpMethod } from "@/types";

// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function site(req: NextApiRequest, res: NextApiResponse) {
//     const session = await getServerSession(req, res, authOptions);
//     if (!session) return res.status(401).end();

//     switch (req.method) {
//         case HttpMethod.GET:
//             return getUser(req, res, session);
//         case HttpMethod.POST:
//             return createUser(req, res);
//         case HttpMethod.DELETE:
//             return deleteUser(req, res);
//         case HttpMethod.PUT:
//             return updateUser(req, res);
//         default:
//             res.setHeader("Allow", [
//                 HttpMethod.GET,
//                 HttpMethod.POST,
//                 HttpMethod.DELETE,
//                 HttpMethod.PUT,
//             ]);
//             return res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }



export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        switch (req.method) {
            case 'GET': {
                if (req.query.id) {
                    // Get a single user if id is provided is the query
                    // api/users?id=1
                    const user = await getUser(req.query.id as string)
                    return res.status(200).json(user)
                } else {
                    // Otherwise, fetch all users
                    const users = await getAllUsers()
                    return res.json(users)
                }
            }
            case 'POST': {
                // Create a new user
                const { name, email } = req.body
                const user = await createUser(name, email)
                return res.json(user)
            }
            case 'PUT': {
                // Update an existing user
                const { id, ...updateData } = req.body
                const user = await updateUser(id, updateData)
                return res.json(user)
            }
            case 'DELETE': {
                // Delete an existing user
                const { id } = req.body
                const user = await deleteUser(id)
                return res.json(user)
            }
            default:
                break
        }
    } catch (error) {
        return res.status(500).json({ ...error as object, message: "ERROR TO GET USERS" })
    }
}
