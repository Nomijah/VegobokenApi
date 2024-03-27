export type ResponseBody = {
    isSuccessful: boolean;
    statusCode: number;
    result?: {};
    errorMessages: string[];
}