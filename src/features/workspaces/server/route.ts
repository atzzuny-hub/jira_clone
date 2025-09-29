import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono()
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
                    imageUrl: uploadedImageUrl
                }
            );

            
            

            return c.json({data:workspace})
        }
    )

export default app