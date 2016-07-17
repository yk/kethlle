interface Submission {
    _id?: string;
    taskId: string;
    teamId: string;
    userId: string;
    comment?: string;
    data: string;
    score?: number;
    created: Date;
    scored?: Date;
}
