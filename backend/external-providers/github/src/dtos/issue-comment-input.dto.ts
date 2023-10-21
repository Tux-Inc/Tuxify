export interface IssueCommentInput {
    owner: string;
    repo: string;
    issue_number: number;
    body: string;
}