import {z} from 'zod'
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/type";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utils";
import { Workspace } from '../type';

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

    .get(
        "/:workspaceId",
        sessionMiddleware,
        async (c) => {
            const user = c.get("user")
            const databases = c.get("databases")
            const {workspaceId} = c.req.param()

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id
            });
            
            if(!member){
                return c.json({error : "Unauthorized"}, 401);
            }

            const workspace = await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId
            )

            return c.json({data:workspace})
        }
    )

    .get(
        "/:workspaceId/info",
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases")
            const {workspaceId} = c.req.param()

            const workspace = await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId
            )

            return c.json({
                data:{
                    $id:workspace.$id, 
                    name: workspace.name, 
                    imageUrl: workspace.imageUrl  
                }
            })
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
                    inviteCode: generateInviteCode(6)
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

    .post(
        "/:workspaceId/reset-invite-code",
        sessionMiddleware,
        async (c) => {
            const databases = c.get("databases");
            const user = c.get("user");

            const {workspaceId} = c.req.param();

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            })

            if(!member || member.role !== MemberRole.ADMIN){
                return c.json({error:"Unauthorized"}, 401)
            }
            
            const workspace = await databases.updateDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId,
                {
                    inviteCode: generateInviteCode(6)
                }
            )

            return c.json({data:workspace});
        }
    )

    .post(
        "/:workspaceId/join",  // ← /api/workspaces/[id]/join 엔드포인트
        sessionMiddleware,
        zValidator("json", z.object({code : z.string()})),
        async (c) => {


            const {workspaceId} = c.req.param()
            const {code} = c.req.valid("json")

            const databases = c.get("databases")
            const user = c.get("user")

            // 1. 이미 멤버인지 확인
            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if(member){
                return c.json({error: "Already a member"}, 400);  // 이미 멤버면 거절
            }

            // 2. 초대 코드 검증
            const workspace = await databases.getDocument<Workspace>(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceId
            )

            if(workspace.inviteCode !== code){
                return c.json({error:"Invalid invite code"}, 400);  // 코드 불일치면 거절
            }

            // 3. 멤버 추가
            await databases.createDocument(
                DATABASE_ID,
                MEMBERS_ID,
                ID.unique(),
                {
                    workspaceId,
                    userId: user.$id,
                    role: MemberRole.MEMBER,  // ← 새 멤버는 일반 사용자로 추가
                }
            )

            return c.json({data:workspace})
        }
    )


export default app