/*
File Name: action-reaction.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: DTO for action reaction field
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

import { ActionReactionInput } from "./action-reaction-input.dto";
import { ActionReactionOutput } from "./action-reaction-output.dto";
import { ActionReactionService } from "./action-reaction-service.dto";

/* The `ActionReaction` class represents an action or reaction with specified
properties such as name, type, title, description, inputs, outputs, service,
and uuid. */
export class ActionReaction {
    /**
     * The constructor function creates an instance of an action or reaction with
     * specified properties.
     * @param {string} name - The name of the action or reaction. It is a string
     * value.
     * @param {"action" | "reaction"} type - The `type` parameter is a string that
     * can have two possible values: "action" or "reaction". It determines whether
     * the instance of the class represents an action or a reaction.
     * @param {string} title - The title parameter is a string that represents the
     * title of the action or reaction.
     * @param {string} description - The `description` parameter is a string that
     * provides a brief explanation or summary of the action or reaction. It helps
     * users understand what the action or reaction does.
     * @param {ActionReactionInput[]} inputs - An array of ActionReactionInput
     * objects. Each object represents an input parameter for the action or
     * reaction.
     * @param {ActionReactionOutput<unknown>[]} outputs - The `outputs` parameter
     * is an array of `ActionReactionOutput` objects. Each `ActionReactionOutput`
     * object represents an output of the action or reaction. The `unknown` type
     * indicates that the output can be of any type.
     * @param [service] - The `service` parameter is an optional parameter of type
     * `Partial<ActionReactionService>`. It represents a partial implementation of
     * the `ActionReactionService` interface.
     * @param {string} [uuid] - The `uuid` parameter is an optional string that
     * represents the unique identifier for the action or reaction.
     */
    constructor(
        public readonly name: string,
        public readonly type: "action" | "reaction",
        public readonly title: string,
        public readonly description: string,
        public readonly inputs: ActionReactionInput[] = [],
        public readonly outputs: ActionReactionOutput<unknown>[] = [],
        public readonly service?: Partial<ActionReactionService>,
        public readonly uuid?: string,
    ) {}
}
