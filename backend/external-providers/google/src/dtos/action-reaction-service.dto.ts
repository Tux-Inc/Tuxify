/*
File Name: action-reaction-service.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: ActionReactionService DTO for ActionReactionService DTO logic and routes definition
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

import { ActionReaction } from "./action-reaction.dto";

/* The `ActionReactionService` class represents a service that handles actions and
reactions, with a name, image, title, description, and arrays of actions and
reactions. */
export class ActionReactionService {
    /**
     * The constructor function creates an instance of a class with properties for
     * name, image, title, description, actions, reactions, and isConnected.
     * @param {string} name - The name of the constructor parameter is a string
     * that represents the name of the object being created.
     * @param {string} [image] - The `image` parameter is a string that represents
     * the image associated with the object. It is an optional parameter, which
     * means it has a default value of an empty string if not provided.
     * @param {string} title - The title parameter is a string that represents the
     * title of the object being constructed.
     * @param {string} description - The `description` parameter is a string that
     * represents a description or summary of the object being constructed. It
     * provides additional information about the object's purpose or
     * characteristics.
     * @param {ActionReaction[]} actions - The `actions` parameter is an array of
     * `ActionReaction` objects. Each `ActionReaction` object represents an action
     * that can be performed by the object being constructed. It contains
     * information such as the action's name, image, and description.
     * @param {ActionReaction[]} reactions - The `reactions` parameter is an array
     * of `ActionReaction` objects. Each `ActionReaction` object represents a
     * reaction that can be triggered by the user. It contains information such as
     * the action to be performed and the corresponding reaction to that action.
     * @param {boolean} [isConnected] - The `isConnected` parameter is an optional
     * boolean parameter. It indicates whether the object is connected or not. If
     * it is not provided, it will default to `undefined`.
     */
    constructor(
        public readonly name: string,
        public readonly image: string = "",
        public readonly title: string,
        public readonly description: string,
        public readonly actions: ActionReaction[],
        public readonly reactions: ActionReaction[],
        public readonly isConnected?: boolean,
    ) {}
}
