import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { ProviderInfos } from "../dtos/provider-infos.dto";
import { ReactionInfos } from "../dtos/reaction-infos.dto";
import { ActionInfos } from "../dtos/action-infos.dto";
import { catchError, lastValueFrom, Observable, of, timeout, toArray } from "rxjs";

@Injectable()
export class GithubService {
    private readonly logger: Logger = new Logger(GithubService.name);

    constructor(
        @Inject("NATS_CLIENT") private readonly natsClient: ClientProxy,
    ) {
    }

    public async getProviderInfos(): Promise<ProviderInfos> {
        try {
            const reactionsInfos: ReactionInfos[] = await this.getReactionsInfos();
            const triggersInfos: ActionInfos[] = await this.getTriggersInfos();
            return {
                name: "github",
                title: "GitHub",
                image: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
                reactions: reactionsInfos,
                actions: triggersInfos,
            };
        } catch (err) {
            throw new RpcException(err);
        }
    }

    private async getReactionsInfos(): Promise<ReactionInfos[]> {
        const reactionsObservable: Observable<any> = this.natsClient.send('provider.github.reaction.infos', {});

        const reactionsInfos: ReactionInfos[] = await lastValueFrom(
            reactionsObservable.pipe(
                timeout(5000),  // Wait for 5 seconds, for example
                catchError(err => {
                    this.logger.error(`Error fetching github reactions: ${err.message}`);
                    return of([]);
                }),
                toArray()
            )
        );

        this.logger.log(`Available github reactions: ${reactionsInfos.map(reaction => reaction.name)}`);
        return reactionsInfos;
    }

    private async getTriggersInfos(): Promise<ActionInfos[]> {
        const actionsObservable: Observable<any> = this.natsClient.send('provider.github.action.infos', {});

        const actionsInfos: ActionInfos[] = await lastValueFrom(
            actionsObservable.pipe(
                timeout(5000),  // Wait for 5 seconds, for example
                catchError(err => {
                    this.logger.error(`Error fetching github triggers: ${err.message}`);
                    return of([]);
                }),
                toArray()
            )
        );

        this.logger.log(`Available github triggers: ${actionsInfos.map(action => action.name)}`);
        return actionsInfos;
    }
}
