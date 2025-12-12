"use client"
import { UserButton } from "@/features/auth/components/user-button"
import { MobileSidebar } from "./mobile-sidebar"
import { usePathname } from "next/navigation"


const pathnameMap = {
    "tasks":{
        title: "My Tasks",
        description: "view all of your tasks here"
    },
    "projects":{
        title: "My Project",
        description: "view tasks of your project here"
    }
}
const defaultMap={
    title:"Home",
    description: "Monitor all of your project and tasks here"
}

export const Navbar =() => {

    const pathname = usePathname();
    const pathnameParts = pathname.split("/")
    // URL 경로의 세 번째 부분(예: /workspaces/id/tasks -> tasks)을 키로 사용
    const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap; 

    // 현재 경로에 맞는 title과 description을 가져오거나 기본값 사용
    const {title, description} = pathnameMap[pathnameKey] || defaultMap
    
    
    return(
        <nav className='pt-4 px-6 flex items-center justify-between'>
            <div className='flex-col hidden lg:flex'>
                <h1 className='text-2xl font-semibold'>{title}</h1>
                <p className='text-muted-foreground'>{description}</p>
            </div>
            <MobileSidebar/>
            <UserButton/>
        </nav>
    )
}