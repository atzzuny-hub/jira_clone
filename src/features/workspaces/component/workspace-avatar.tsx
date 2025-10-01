import Image from "next/image"
import {cn} from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  APPWRITE_ENDPOINT, // 너의 appwrite 엔드포인트 (ex: fra.cloud.appwrite.io)
  PROJECT_ID,         // 너의 프로젝트 ID
  IMAGES_BUCKET_ID    // images Storage 버킷 ID
} from "@/config" 


interface WorkspaceAvatarProps {
    name: string,
    image?: string,
    className?:string
}

export const WorkspaceAvatar = ({name, image, className}:WorkspaceAvatarProps) => {
    

    let imageUrl = ''; 

    if(image && typeof image === 'string') {

        // baseEndpoint에서 '/v1' 경로 추가
        const baseEndpoint = APPWRITE_ENDPOINT.startsWith('https://') 
            ? APPWRITE_ENDPOINT 
            : `https://${APPWRITE_ENDPOINT}`;

        // '/v1'이 이미 포함되어 있는지 확인
        const endpoint = baseEndpoint.includes('/v1') 
            ? baseEndpoint 
            : `${baseEndpoint}/v1`;

        imageUrl = `${endpoint}/storage/buckets/${IMAGES_BUCKET_ID}/files/${image}/view?project=${PROJECT_ID}`;

        // https://fra.cloud.appwrite.io/v1/storage/buckets/68d8d717003253abebae/files/68da5074000291bf93ab/view?project=68ca4e5d002612399c40&mode=admin
        // 만약 'mode=admin' 이 꼭 필요하다면 &mode=admin 을 붙여도 되지만 보통은 필요 없음.

        return(
            <div className={cn(
                "size-10 relative rounded-md overflow-hidden",
                className
            )}>
                <Image src={imageUrl} alt={name} fill className="object-cover"/>
            </div>
        )
    }

    
    return(
        <Avatar className={cn("size-10 rounded-md", className)}>
            <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase rounded-md">
                {name[0]}
            </AvatarFallback>
        </Avatar>
    )
}