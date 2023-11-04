/*
File Name: auth.module.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Module for auth

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

import { ActionsService } from './actions.service';
import { ClientProxy } from '@nestjs/microservices';
import { Controller, Inject } from '@nestjs/common';
import { ActionReaction } from '../dtos/action-reaction.dto';

/* The ActionsController class is responsible for periodically emitting available
actions to the NATS client. */
@Controller('actions')
export class ActionsController {
  constructor(
    public readonly actionsService: ActionsService,
    @Inject('NATS_CLIENT') private readonly natsClient: ClientProxy,
  ) {
    setInterval(() => {
      const availableActions: ActionReaction[] = [
        {
          name: 'provider.github.action.issue.create',
          type: 'action',
          title: 'Issue created',
          description: 'Trigger when a new issue is created',
          inputs: [
            {
              name: 'repository',
              title: 'Repository',
              placeholder: 'owner/repository',
              required: true,
            },
          ],
          outputs: [
            {
              name: 'issueNumber',
              title: 'Issue number',
            },
            {
              name: 'title',
              title: 'Title',
            },
            {
              name: 'body',
              title: 'Body',
            },
          ],
        },
      ];
      this.natsClient.emit<ActionReaction>(
        'heartbeat.providers.github.actions',
        availableActions,
      );
    }, 5000);
  }
}
