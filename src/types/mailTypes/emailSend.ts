export type EmailSend = {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
}