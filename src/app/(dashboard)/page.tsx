import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";

export default async function Home() {

	const user = await getCurrent();
	if(!user) redirect("/sign-in")

	const workspace = await getWorkspaces();
	if(workspace.total === 0){
		redirect("/workspaces/create");
	}else{
		redirect(`/workspaces/${workspace.documents[0].$id}`)
	}
}
