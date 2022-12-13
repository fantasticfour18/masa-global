export interface LogsModel {
    errorType?: string
    ScreenName?: string
    errorStatus?: string
    errorDesc?: string
    createdDate?: string
    errorUser?: string 
    api?: string
    apiResonse?: string
    clientInfo?: number
}

export interface APIResponse {
    code?: string
    message?: string
    name?: string
}