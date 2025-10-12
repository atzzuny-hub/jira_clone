import { getCurrent } from "@/features/auth/queries"
import { JoinWorkspaceForm } from "@/features/workspaces/component/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkspaceIdJoinPageProps{
    params:{
        workspaceId: string,
    }
}

const WorkspaceIdJoinPage = async({params}:WorkspaceIdJoinPageProps) => {

    const user = await getCurrent();
    if(!user) redirect("/sign-in");

    const workspace = await getWorkspaceInfo({
        workspaceId:params.workspaceId
    })

    if(!workspace){
        redirect("/")
    }

    return(
        <div className="w-full lg:max-w-xl">
            {/* <p className="w-100">{JSON.stringify(workspace)}</p> */}
            <JoinWorkspaceForm initialValues={workspace}/>
        </div>
    )
}

export default WorkspaceIdJoinPage