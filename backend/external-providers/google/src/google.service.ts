import {Inject, Injectable, Logger} from '@nestjs/common';
import {ProviderInfos} from "./dtos/provider-infos.dto";
import {ReactionInfos} from "./dtos/reaction-infos.dto";
import {Observable, toArray} from "rxjs";
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {ActionInfos} from "./dtos/action-infos.dto";

@Injectable()
export class GoogleService {
    private readonly logger = new Logger(GoogleService.name);
    constructor(
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
    }

    public async getProviderInfos(): Promise<ProviderInfos> {
        try {
            const reactionsInfos: ReactionInfos[] = await this.getReactionsInfos();
            const triggersInfos: ActionInfos[] = await this.getTriggersInfos();
            return {
                name: 'google',
                title: 'Google',
                image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
                reactions: reactionsInfos,
                actions: triggersInfos,
            }
        } catch (err) {
            throw new RpcException(err);
        }
    }

    private async getReactionsInfos(): Promise<ReactionInfos[]> {
        try {
            const reactionsObservable: Observable<any> = this.natsClient.send('provider.google.reactions.infos', {});
            const reactionsInfos: ReactionInfos[] = await reactionsObservable.pipe(
                toArray()
            ).toPromise();
            this.logger.log(`Available google reactions: ${reactionsInfos}`);
            return reactionsInfos;
        } catch (err) {
            this.logger.error(err);
            return [];
        }
    }

    private async getTriggersInfos(): Promise<ActionInfos[]> {
        try {
            const actionsObservable: Observable<any> = this.natsClient.send('provider.google.actions.infos', {});
            const actionsInfos: ActionInfos[] = await actionsObservable.pipe(
                toArray()
            ).toPromise();
            this.logger.log(`Available google triggers: ${actionsInfos}`);
            return actionsInfos;
        } catch (err) {
            this.logger.error(err);
            return [];
        }
    }



}
