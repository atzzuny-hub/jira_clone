import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/type";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utils";

const app = new Hono()
    .get(
        "/",
        sessionMiddleware,
        async (c) => {
            const user = c.get("user")
            const databases = c.get("databases")

            const members = await databases.listDocuments(
                DATABASE_ID,
                MEMBERS_ID,
                [Query.equal("userId", user.$id)]
            );

            if(members.total === 0){
                return c.json({data: {documents: [], total:0}})
            }

            const workspaceIds = members.documents.map((member) => member.workspaceId)

            const workspace = await databases.listDocuments(
                DATABASE_ID,
                WORKSPACES_ID,
                [
                    Query.orderDesc("$createdAt"),
                    Query.contains("$id", workspaceIds)
                ]
            );

            return c.json({data:workspace})
        }
    )
    .post(
        "/",
        zValidator("form", createWorkspaceSchema),
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases")
            // storage 불러오고
            const storage = c.get("storage")
            const user = c.get("user")
            
            const {name, image} = c.req.valid("form")

            let uploadedImageUrl: string | undefined;

            console.log('data', image);

            if(image instanceof File){

                // 안토니오 방법
                // const file = await storage.createFile(
                //     IMAGES_BUCKET_ID,
                //     ID.unique(),
                //     image
                // );

                // const arrayBuffer = await storage.getFilePreview(
                //     IMAGES_BUCKET_ID,
                //     file.$id
                // )

                // uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`

                
                // 수정된 코드
                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image
                );

                uploadedImageUrl = file.$id                
            }

            const workspace = await databases.createDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                ID.unique(),
                {
                    name,
                    userId:user.$id,
                    imageUrl: uploadedImageUrl,
                    inviteCode: generateInviteCode(10)
                }
            );


            // 여기추가
            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    userId: user.$id,
                    workspaceId: workspace.$id,
                    role: MemberRole.ADMIN
                }
            )

            
            

            return c.json({data:workspace})
        }
    )

    .patch(
        "/:workspaceId",
        sessionMiddleware,
        zValidator("form", updateWorkspaceSchema),
        async (c) => {
            const databases = c.get("databases");
            const storage = c.get("storage");
            const user = c.get("user");

            const {workspaceId} = c.req.param();
            const {name, image} = c.req.valid("form");

            const member = await getMember({
                databases,
                workspaceId,
                userId:user.$id
            })

            if(!member || member.role !== MemberRole.ADMIN){
                return c.json({ error: "Unauthorized"}, 401)
            }

            let uploadedImageUrl : string | undefined

            if(image instanceof File){

                const file = await storage.createFile(
                    IMAGES_BUCKET_ID,
                    ID.unique(),
                    image,
                    // [
                    //     Permission.read(Role.any()),    // 모든 사람이 읽을 수 있게!
                    //     Permission.write(Role.user(user.$id)), // 로그인한 유저만 쓸 수 있게? 
                    // ]

                );

                uploadedImageUrl = file.$id;

            }else{
                uploadedImageUrl = image
            }

            const workspace = await databases.updateDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
                // {
                //     name,
                //     imageUrl: uploadedImageUrl,
                // }
                {
                    ...(name && { name }), // name이 있을 때만 포함
                    ...(uploadedImageUrl && { imageUrl: uploadedImageUrl }), // imageUrl이 있을 때만 포함
                }
            );

            return c.json({data:workspace})
        }
    )

    .delete(
        "/:workspaceId",
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");

            const {workspaceId} = c.req.param();

            // 1. 권한 확인
            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            })

            if(!member || member.role !== MemberRole.ADMIN){
                return c.json({error:"Unauthorized"}, 401)
            }
            
            // TODO: Delete members, projects, and tasks
            
            // 2. 워크스페이스 삭제
            await databases.deleteDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
            )

            return c.json({data:{ $id: workspaceId}});
        }
    )


export default app