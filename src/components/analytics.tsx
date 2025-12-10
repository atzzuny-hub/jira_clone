// interface AnalyticsProps{
//     data?:{
//         taskCount : number;
//         taskDifference : number;
//         projectCount?: number;
//         projectDifference? : number;
//         assigneeTaskCount : number;
//         assigneeTaskDifference : number;
//         completeTaskCount : number;
//         completeTaskDifference : number;
//         incompleteTaskCount? : number;
//         incompleteTaskDifference? : number;
//         overdueTaskCount : number;
//         overdueTaskDifference : number;
//     }
// }

import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analytics-card";
import DottedSeparator from "./dottedSeparator";

export const Analytics = ({data}:ProjectAnalyticsResponseType) => {

    if(!data) return null;

    return(
        <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
            <div className="w-full flex flex-row">
                <div className="flex items-center flex-1">
                    <AnalyticsCard
                        title="Total tasks"
                        value={data.taskCount}
                        variant={data.taskDifference > 0 ? "up" : "down"} 
                        increaseValue={data.taskDifference}                    
                    />
                    <DottedSeparator direction="vertical"/>
                </div>
                <div className="flex items-center flex-1">
                    <AnalyticsCard
                        title="Assigned Tasks"
                        value={data.assigneeTaskCount}
                        variant={data.assigneeTaskDifference > 0 ? "up" : "down"} 
                        increaseValue={data.assigneeTaskDifference}                    
                    />
                    <DottedSeparator direction="vertical"/>
                </div>
                <div className="flex items-center flex-1">
                    <AnalyticsCard
                        title="Completed Tasks"
                        value={data.completeTaskCount}
                        variant={data.completeTaskDifference > 0 ? "up" : "down"} 
                        increaseValue={data.completeTaskDifference}                    
                    />
                    <DottedSeparator direction="vertical"/>
                </div>
                <div className="flex items-center flex-1">
                    <AnalyticsCard
                        title="Overdue Tasks"
                        value={data.overdueTaskCount}
                        variant={data.overdueTaskDifference > 0 ? "up" : "down"} 
                        increaseValue={data.overdueTaskDifference}                    
                    />
                    <DottedSeparator direction="vertical"/>
                </div>
                <div className="flex items-center flex-1">
                    <AnalyticsCard
                        title="Incomplete Tasks"
                        value={data.incompleteTaskCount}
                        variant={data.incompleteTaskDifference > 0 ? "up" : "down"} 
                        increaseValue={data.incompleteTaskDifference}                    
                    />
                    <DottedSeparator direction="vertical"/>
                </div>
            </div>
            <ScrollBar orientation="horizontal"/>
        </ScrollArea>
    )
}