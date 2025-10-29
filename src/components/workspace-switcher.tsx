"use client"

import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from '@/components/ui/select'
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspace"
import { WorkspaceAvatar } from '@/features/workspaces/component/workspace-avatar';
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';
import {RiAddCircleFill} from "react-icons/ri"


export const WorkspaceSwitcher = () => {
    const workspaceId = useWorkspaceId()  
    const router = useRouter()
    const {data:workspace} = useGetWorkspaces();


    const {open} = useCreateWorkspaceModal()

    const onSelect = (id:string) => {
        router.push(`${id}`)
    }
    
    return(
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">workspace</p>
                <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"/>
            </div>
            <Select onValueChange={onSelect} value={workspaceId}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="No workspace selected"/>
                </SelectTrigger>
                <SelectContent>
                    {workspace?.documents.map((item) => (
                        <SelectItem key={item.$id} value={item.$id}>
                            <div className="flex justify-start items-center gap-3 font-medium">                                
                                <WorkspaceAvatar name={item.name} image={item.imageUrl}/>
                                <span className="truncate">{item.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                    
                </SelectContent>
                </Select>
        </div>
    )
}