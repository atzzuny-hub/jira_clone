import { InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.auth.logout['$post']>

export const useLogout = () => {

    const router = useRouter();

    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn : async () => {
            const response = await client.api.auth.logout["$post"]();

            if(!response.ok){
                throw new Error("Failed to logout")
            }

            return await response.json()
        },
        onSuccess: () => {
            toast.success("Logged out")
            router.refresh()
            queryClient.invalidateQueries({queryKey :["current"]}) // 데이터를 강제로 "무효화"시켜서 다시 가져온다.
            queryClient.invalidateQueries({queryKey :["workspaces"]}) 
            // window.location.reload()
        },
        onError:()=>{
            toast.error("Failed to log out")
        }
    })

    return mutation
}