"use server"

import { createSessionClient } from '@/lib/appwrite'

export const getCurrent = async () => {
    try{
        // const client = new Client()
        //     .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        //     .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

        // const session = await cookies().get(AUTH_COOKIE)

        // if(!session) return null

        // client.setSession(session.value);
        // const account = new Account(client);

        // createSessionClient: 일반 조회 (getCurrent, getWorkspaces)
        const {account} = await createSessionClient()

        return await account.get();
    }catch{
        return null
    }
}