"use client"

import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from '@/components/ui/select'
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspace"
import { WorkspaceAvatar } from '@/features/workspaces/component/workspace-avatar';

export const WorkspaceSwitcher = () => {
    // hook 호출 → {data, isLoading, error} 반환
    const {data:workspace} = useGetWorkspaces();
    
    return(
        <div>
            <Select>
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