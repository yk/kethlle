interface Competition {
    _id?: string;
    name: string;
    description?: string;
    admins: string[];
    participants: string[];
    solution: string;
    scoring: string;
}
