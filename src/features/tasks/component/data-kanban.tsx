import { useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd"

import { KanbanColumnHeader } from "./kanbanColumnHeader";

import { Task, TaskStatus } from "../types";



// 모든 작업(Task)들을 상태(Status)에 따라 깔끔하게 분리하고 그룹화하여, 
// 드래그 앤 드롭(Drag-and-Drop)으로 작업 상태를 쉽게 변경하거나, 
// 각 상태별로 몇 개의 작업이 있는지 쉽게 파악할 수 있도록 데이터 모델을 설계하는 핵심 작업

const boards:TaskStatus[] = [
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_PREVIEW,
    TaskStatus.DONE
]

type TasksState = {
    [key in TaskStatus]: Task[];
}



interface DataKanbanProps{
    data: Task[]
}



export const DataKanban = ({data,}:DataKanbanProps) => {
    const [tasks, setTasks] = useState<TasksState>(()=>{

        const initialTasks: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_PREVIEW]: [],
            [TaskStatus.DONE]: [],
        };

        data.forEach((task) => {
            initialTasks[task.status].push(task)
        })

        Object.keys(initialTasks).forEach((status)=>{
            initialTasks[status as TaskStatus].sort((a, b)=> a.position - b.position );
        });

        return initialTasks 

    })
    return(
        <DragDropContext onDragEnd={()=>{}}>
            <div className="flex overflow-x-auto">
                {boards.map((board) => {
                    return(
                        <div key={board} className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]">
                            {/* 열의 타이틀은 컴포넌트로 따로 작업해줌 */}
                            <KanbanColumnHeader
                                board={board}
                                taskCount={tasks[board].length}
                            />
                        </div>
                    )
                })}
            </div>
            
        </DragDropContext>
    )
}