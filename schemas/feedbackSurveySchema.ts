export interface FeedbackSurveySchema {
    surveyName: string;
    nsp: string;
    criteria: string;
    lastModified: { date: string, by: string }
    basicQuestion: string;
    pointScaleBasic: string;
    RatingLabelBasic: any;
    AdditionalQuestions: any;
    pointScaleAdd: string;
    RatingLabelAdd: any;
    thankyouMessage: string;
    commentBox: string;
    additionalDetails: string;
    sendWhen: string;
    activated: boolean;
}