export interface SampleAppGlobalParams {
    baseUrl: string;
}

export interface SampleAppParams {
    imageId: string;
    useGreyScale: boolean;
    useBlur: boolean;
    blur: number;
}

export interface Task {
    id: string;
    title: string;
    createdDateTime: string;
    description: string;
    importance: string;
    isReminderOn?: string;
    status: string;
    categories: string[];
    body?: TaskBody;
    dueDateTime?: DateTime;
    checklistItems?: CheckListItem[];
}

export interface CheckListItem {
    displayName: string;
    createdDateTime: string;
    isChecked: boolean;
    id: string;
}

export interface DateTime {
    datetime: string;
    timeZone?: string;
}

export interface TaskBody {
    content: string;
    contentType: string;
}

export interface GraphList {
    "@odata.context": string;
    "@odata.nextLink"?:  string;
}

export interface TodoList {
    displayName: string;
    id: string;
}

export interface TodoLists extends GraphList {
    value: TodoList[];
}

export interface TaskList extends GraphList {
    value: Task[];
}