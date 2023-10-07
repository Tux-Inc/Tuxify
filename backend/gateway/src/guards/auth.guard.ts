import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable, Logger
} from '@nestjs/common';
import {ClientProxy, RpcException} from '@nestjs/microservices';
import {Request} from 'express';
import {firstValueFrom, Observable} from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);
    constructor(@Inject('NATS_CLIENT') private natsClient: ClientProxy) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const bearerToken: string = this.extractBearerToken(request);

        if (!bearerToken) {
            this.logger.error('Bearer token not found');
            throw new ForbiddenException('Bearer token not found');
        }
        const userId: number = await firstValueFrom(this.getUserData(bearerToken));

        if (!userId) {
            this.logger.error('Invalid bearer token');
            throw new ForbiddenException('Invalid bearer token');
        }

        request.user = userId;
        return true;

    }

    private extractBearerToken(request: any): string | null {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return null;
        }

        const [, token] = authHeader.split(' ');
        return token || null;
    }

    private getUserData(token: string): Observable<number> {
        return this.natsClient.send('auth.jwt.verify', token);
    }
}