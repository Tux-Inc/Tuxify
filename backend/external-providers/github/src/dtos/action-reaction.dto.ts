/*
File Name: added-provider.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: DTO for added provider
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

import { ActionReactionInput } from './action-reaction-input.dto';
import { ActionReactionOutput } from './action-reaction-output.dto';
import { ActionReactionService } from './action-reaction-service.dto';

/* The `ActionReaction` class represents an action or reaction with a name, type,
title, description, inputs, outputs, and an optional UUID. */
export class ActionReaction {
  constructor(
    public readonly name: string,
    public readonly type: 'action' | 'reaction',
    public readonly title: string,
    public readonly description: string,
    public readonly inputs: ActionReactionInput[] = [],
    public readonly outputs: ActionReactionOutput<unknown>[] = [],
    public readonly uuid?: string,
  ) {}
}
