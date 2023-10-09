import {Inject, Injectable, Logger} from '@nestjs/common';
import {ProviderInfos} from "./dtos/provider-infos.dto";
import {ActionInfos} from "./dtos/action-infos.dto";
import {Observable, toArray} from "rxjs";
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {TriggerInfos} from "./dtos/trigger-infos.dto";

@Injectable()
export class GoogleService {
    private readonly logger = new Logger(GoogleService.name);
    constructor(
        @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
    ) {
    }

    public async getProviderInfos(): Promise<ProviderInfos> {
        try {
            const actionsInfos: ActionInfos[] = await this.getActionsInfos();
            const triggersInfos: TriggerInfos[] = await this.getTriggersInfos();
            return {
                name: 'google',
                title: 'Google',
                image: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
                actions: actionsInfos,
                triggers: triggersInfos,
            }
        } catch (err) {
            throw new RpcException(err);
        }
    }

    private async getActionsInfos(): Promise<ActionInfos[]> {
        try {
            const actionsObservable: Observable<any> = this.natsClient.send('provider.google.actions.infos', {});
            const actionsInfos: ActionInfos[] = await actionsObservable.pipe(
                toArray()
            ).toPromise();
            this.logger.log(`Available google actions: ${actionsInfos}`);
            return actionsInfos;
        } catch (err) {
            this.logger.error(err);
            return [];
        }
    }

    private async getTriggersInfos(): Promise<TriggerInfos[]> {
        try {
            const triggersObservable: Observable<any> = this.natsClient.send('provider.google.triggers.infos', {});
            const triggersInfos: TriggerInfos[] = await triggersObservable.pipe(
                toArray()
            ).toPromise();
            this.logger.log(`Available google triggers: ${triggersInfos}`);
            return triggersInfos;
        } catch (err) {
            this.logger.error(err);
            return [];
        }
    }



}
