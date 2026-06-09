export interface AuthenticatedUser {
    sub: string;
    email: string;
    role: 'USER' | 'ADMIN';
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
