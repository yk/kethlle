interface Submission {
    _id?: string;
    taskId: string;
    teamId: string;
    userId: string;
    comment?: string;
    fileId: string;
    score?: number;
    created: Date;
    scored?: Date;
}
