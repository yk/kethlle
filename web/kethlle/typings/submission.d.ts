interface Submission {
    _id?: string;
    competitionId: string;
    teamId: string;
    username: string;
    comment: string;
    data: string;
    score?: number;
    created: Date;
    scored?: Date;
}
