/*
File Name: github.controller.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Controller for github provider
Copyright (c) 2023 Tux Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { GithubService } from './github.service';
import { ActionReaction } from './dtos/action-reaction.dto';
import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { ActionReactionService } from './dtos/action-reaction-service.dto';

/* The GithubController class is responsible for managing available actions and
reactions for the Github provider and sending heartbeat updates. */
@Controller()
export class GithubController {
  public readonly logger: Logger = new Logger(GithubController.name);
  public availableActions: ActionReaction[] = [];
  public availableReactions: ActionReaction[] = [];

  /**
   * The constructor function periodically emits a heartbeat message containing
   * information about the Github provider to a NATS client.
   * @param {GithubService} githubService - The `githubService` parameter is an
   * instance of the `GithubService` class. It is a dependency that is injected
   * into the constructor.
   * @param {ClientProxy} natsClient - The `natsClient` parameter is an instance
   * of the `ClientProxy` class, which is used to communicate with a NATS server.
   * It is injected into the constructor using the `@Inject` decorator.
   */
  constructor(
    private readonly githubService: GithubService,
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {
    setInterval(() => {
      const providerInfos: ActionReactionService = {
        name: 'github',
        image:
          'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg',
        title: 'Github',
        description:
          'Github is a place for developer to share and discover code',
        actions: this.availableActions,
        reactions: this.availableReactions,
      };
      this.natsClient.emit<ActionReactionService>(
        'heartbeat.providers.github',
        providerInfos,
      );
    }, 5000);
  }

  @EventPattern('heartbeat.providers.github.actions')
  setActionsInfos(@Payload() data: ActionReaction[]): void {
    this.availableActions = data;
  }

  @EventPattern('heartbeat.providers.github.reactions')
  setReactionsInfos(@Payload() data: ActionReaction[]): void {
    this.availableReactions = data;
  }
}
