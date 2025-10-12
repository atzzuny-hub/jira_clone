"use server"

import { cookies } from 'next/headers'
import { Client, Databases, Query, Account } from 'node-appwrite'

import { AUTH_COOKIE } from '@/features/auth/constants'
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config'
import { Workspace } from './type'
import { getMember } from '../members/utils'
import { createSessionClient } from '@/lib/appwrite'

export const getWorkspaces = async () => {
    try{
        const { databases, account } = await createSessionClient();

        const user = await account.get();

        // getMember 유틸로 권한 확인
        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("userId", user.$id)]
        );

        if(members.total === 0){
            return {documents: [], total:0}
        }

        const workspaceIds = members.documents.map((member) => member.workspaceId)

        // 워크스페이스 정보 조회
        const workspace = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACES_ID,
            [
                Query.orderDesc("$createdAt"),
                Query.contains("$id", workspaceIds)
            ]
        );

        return workspace

    }catch{
        return {documents: [], total:0}
    }
}

interface GetWorkspaceProps{
    workspaceId:string
}

export const getWorkspace = async ({workspaceId}:GetWorkspaceProps) => {
    try{

        const {databases, account} = await createSessionClient();

        const user = await account.get();

        const member = await getMember({
            databases,
            userId:user.$id,
            workspaceId
        })

        if(!member) return null

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId
        );

        return workspace

    }catch{
        return null
    }
}

interface GetWorkspaceInfoProps{
    workspaceId:string
}

export const getWorkspaceInfo = async ({workspaceId}:GetWorkspaceInfoProps) => {
    try{

        const {databases} = await createSessionClient();     

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId
        )

        return {
            name: workspace.name
        }
    }catch{
        return null
    }
}
