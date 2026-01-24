import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    private sendEmail;
    sendVerificationEmail(email: string, token: string): Promise<void>;
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
    sendMeetingInvitation(email: string, userName: string, partnerName: string, meetingDate: Date, venue: string): Promise<void>;
    sendInterestNotification(email: string, userName: string, senderName: string): Promise<void>;
}
