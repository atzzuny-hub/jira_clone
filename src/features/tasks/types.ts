import { Models } from "node-appwrite";

export enum TaskStatus{
    BACKLOG = "BACKLOG", 
    TODO = "TODO", 
    IN_PROGRESS = "IN_PROGRESS", 
    IN_PREVIEW = "IN_PREVIEW",  
    DONE = "DONE", 
}

// 기본 Task 타입 (DB에 저장된 형태)
export type Task = Models.Document & {
    name: string;
    status: TaskStatus;
    workspaceId: string;
    assigneeId: string;
    projectId: string;
    position: number;
    dueDate: string
}

// Populated Task 타입 (API에서 반환되는 형태)
export type PopulatedTask = Task & {
    project: {
        $id: string;
        name: string;
        imageUrl?: string;
    };
    assignee?: {
        $id: string;
        name: string;
        email: string;
    };
}