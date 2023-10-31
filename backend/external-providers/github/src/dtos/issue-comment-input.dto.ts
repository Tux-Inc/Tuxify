export interface IssueCommentInput {
    owner: string;
    repository: string;
    issue_number: number;
    body: string;
}