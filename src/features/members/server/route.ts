import {z} from "zod"
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";

import { createAdminClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { getMember } from "../utils";
import { MemberRole } from "../type";


const app = new Hono()
    .get(
        "/",
        sessionMiddleware,
        zValidator("query", z.object({ workspaceId: z.string()})),
        async (c) => {
            const databases = c.get("databases")
        	const user = c.get("user");
            const {workspaceId} = c.req.valid("query");

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            })

            if(!member){
                return c.json({error: "허가받지 않은 멤버입니다"}, 401)
            }

            const members = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("workspaceId", workspaceId)]
            )

            // ✅ createAdminClient를 여기서 호출
            const {users} = await createAdminClient();
            
            const populatedMembers = await Promise.all(
                members.documents.map(async(member)=>{

                    const userInfo = await users.get(member.userId);  // ✅ 각 멤버의 userId로 정보 조회

                    return {
                        ...member,
                        // name: user.name,
                        // email: user.email
                        name: userInfo.name,      // ✅ 해당 멤버의 실제 이름
                        email: userInfo.email     // ✅ 해당 멤버의 실제 이메일
                    }
                })
            );

            return c.json({
                data:{
                    ...members,
                    documents: populatedMembers
                }
            })
        }
    )

    .delete(
        "/:memberId",
        sessionMiddleware,
        async (c) => {
            const {memberId} = c.req.param();
            const user = c.get("user");
            const databases = c.get("databases");

            const memberToDelete = await databases.getDocument(
                DATABASE_ID,
                MEMBERS_ID,
                memberId,
            )

            const allMembersInWorkspace = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("workspaceId", memberToDelete.workspaceId)]
            )

            const member = await getMember({
                databases,
                workspaceId: memberToDelete.workspaceId,
                userId: user.$id
            })

            if(!member){
                return c.json({error:"Unauthorized"}, 401)
            }

            if(member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN){
                return c.json({error:"Unauthorized"}, 401)
            }

            if(allMembersInWorkspace.total === 1){
                return c.json({error:"Cannot delete the only member"}, 400)
            } 

            await databases.deleteDocument(
                DATABASE_ID,
                MEMBERS_ID,
                memberId,
            )

            return c.json({data:{$id:memberToDelete.$id}})
        }

    )

    .patch(
        "/:memberId",
        sessionMiddleware,
        // zValidator("json", z.object({role: z.nativeEnum(MemberRole)}))
        zValidator("json", z.object({role: z.enum(MemberRole)})),
        async (c) => {
            const {memberId} = c.req.param();
            const {role} = c.req.valid("json")
            const user = c.get("user");
            const databases = c.get("databases");

            const memberToUpdate = await databases.getDocument(
                DATABASE_ID,
                MEMBERS_ID,
                memberId,
            )

            const allMembersInWorkspace = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("workspaceId", memberToUpdate.workspaceId)]
            )

            const member = await getMember({
                databases,
                workspaceId: memberToUpdate.workspaceId,
                userId: user.$id
            })

            if(!member){
                return c.json({error:"Unauthorized"}, 401)
            }

            if(member.role !== MemberRole.ADMIN){
                return c.json({error:"Unauthorized"}, 401)
            }

            if(allMembersInWorkspace.total === 1){
                return c.json({error:"Cannot downgrade the only member"}, 400)
            } 

            await databases.updateDocument(
                DATABASE_ID,
                MEMBERS_ID,
                memberId,
                {
                    role
                }
            )

            return c.json({data:{$id:memberToUpdate.$id}})
        }
        

    )

export default app 