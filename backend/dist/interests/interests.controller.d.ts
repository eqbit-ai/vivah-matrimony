import { InterestsService, SendInterestDto, RespondInterestDto } from './interests.service';
export declare class InterestsController {
    private interestsService;
    constructor(interestsService: InterestsService);
    sendInterest(userId: string, dto: SendInterestDto): Promise<{
        message: string;
        interest: any;
    }>;
    respondToInterest(userId: string, interestId: string, dto: RespondInterestDto): Promise<{
        message: string;
        interest: any;
    }>;
    getSentInterests(userId: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getReceivedInterests(userId: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMutualMatches(userId: string, page?: number, limit?: number): Promise<{
        data: any;
        meta: {
            total: any;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
