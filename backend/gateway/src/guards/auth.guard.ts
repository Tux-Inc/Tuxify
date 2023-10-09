import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
    Injectable, Logger, UnauthorizedException
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
            throw new UnauthorizedException('Bearer token not found');
        }
        let userId: number = null;
        try {
            userId = await firstValueFrom(this.getUserData(bearerToken));
        } catch (error) {
            throw new ForbiddenException(error);
        }

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