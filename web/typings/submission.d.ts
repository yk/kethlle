interface Submission {
    _id?: string;
    taskId: string;
    teamId: string;
    teamName: string;
    userId: string;
    comment?: string;
    fileId: string;
    filename: string;
    score?: number;
    error?: string;
    createdAt: Date;
    scoredAt?: Date;
}
