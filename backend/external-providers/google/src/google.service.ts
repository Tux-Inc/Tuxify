import {Inject, Injectable, Logger} from '@nestjs/common';
import {ProviderInfos} from "./dtos/provider-infos.dto";
import {ReactionInfos} from "./dtos/reaction-infos.dto";
import { catchError, lastValueFrom, Observable, of, timeout, toArray } from "rxjs";
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {ActionInfos} from "./dtos/action-infos.dto";

@Injectable()
export class GoogleService {
    private readonly logger: Logger = new Logger(GoogleService.name);
    constructor(
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
    }
}
