import { useCallback, useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    type DropResult
} from "@hello-pangea/dnd"

import { KanbanCard } from "./kanban-card";
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
    data: Task[],
    onChange: (tasks: {$id:string; status:TaskStatus; position:number}[])=>void
}



export const DataKanban = ({data, onChange}:DataKanbanProps) => {
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

    useEffect(()=>{
        const newTasks: TasksState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_PREVIEW]: [],
            [TaskStatus.DONE]: [],
        };

        data.forEach((task) => {
            newTasks[task.status].push(task)
        })

        Object.keys(newTasks).forEach((status)=>{
            newTasks[status as TaskStatus].sort((a, b)=> a.position - b.position );
        });

        setTasks(newTasks)

    },[data])

    const onDragEnd = useCallback((result: DropResult)=>{
        if(!result.destination) return;

        const {source, destination} = result;
        const sourceStatus = source.droppableId as TaskStatus;
        const destStatus = destination.droppableId as TaskStatus;

        let updatesPayload : {$id:string; status: TaskStatus, position:number}[]=[]

        setTasks((prevTasks) => {
            const newTasks = {...prevTasks}

            const sourceColumn = [...newTasks[sourceStatus]];
            const [movedTask] = sourceColumn.splice(source.index, 1);

            if(!movedTask){
                console.log("No task found at the source index");
                return prevTasks
            }

            const updatedMovedTask = sourceStatus !== destStatus
                ? {...movedTask, status: destStatus}
                : movedTask;

            newTasks[sourceStatus] = sourceColumn

            const destColumn = [...newTasks[destStatus]];;
            destColumn.splice(destination.index, 0, updatedMovedTask)
            newTasks[destStatus] = destColumn

            updatesPayload = [];

            updatesPayload.push({
                $id: updatedMovedTask.$id,
                status: destStatus,
                position: Math.min((destination.index + 1) * 1000, 1_000_000)
            })

            newTasks[destStatus].forEach((task, index) => {
                if(task && task.$id !== updatedMovedTask.$id){
                    const newPosition = Math.min((index + 1) * 1000, 1_000_000);
                    if(task.position !== newPosition){
                        updatesPayload.push({
                            $id: task.$id,
                            status: destStatus,
                            position: newPosition
                        })
                    }
                }
            })

            if(sourceStatus !== destStatus){
                newTasks[sourceStatus].forEach((task, index) => {
                    if(task){
                        const newPosition = Math.min((index + 1) * 1000, 1_000_000);
                        if(task.position !== newPosition){
                            updatesPayload.push({
                                $id: task.$id,
                                status: sourceStatus,
                                position: newPosition
                            })
                        }
                    }
                })
            }

            return newTasks
        });

        onChange(updatesPayload);

    },[onChange])
    
    return(
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto">
                {boards.map((board) => {
                    return(
                        <div key={board} className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]">
                            {/* 열의 타이틀은 컴포넌트로 따로 작업해줌 */}
                            <KanbanColumnHeader
                                board={board}
                                taskCount={tasks[board].length}
                            />
                            <Droppable droppableId={board}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="min-h-[200px] py-1.5" 
                                    >
                                        {tasks[board].map((task, index) => (
                                            <Draggable
                                                key={task.$id}
                                                draggableId={task.$id}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        {/* 프로젝트 컴포넌트 */}
                                                        <KanbanCard task={task}/>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    )
                })}
            </div>
            
        </DragDropContext>
    )
}