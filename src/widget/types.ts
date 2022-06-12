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
    dueDateTime: string;
    description: string;
    importance: string;
    reminder: string;
    status: string;
}