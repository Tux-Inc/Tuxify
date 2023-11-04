/*
File Name: action-reaction-service.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: DTO for action reaction service field
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

/* The `ActionReactionService` class represents an object with a name, image,
title, description, actions, reactions, and an optional isConnected property. */
export class ActionReactionService {
    /**
     * The constructor function creates an instance of a class with specified
     * properties and optional default values.
     * @param {string} name - The name of the constructor parameter is "name". It
     * is of type string and is marked as readonly, meaning its value cannot be
     * changed once it is set.
     * @param {string} [image] - The `image` parameter is a string that represents
     * the image associated with the object being constructed. It is an optional
     * parameter and can be left empty if no image is available.
     * @param {string} title - The title parameter is a string that represents the
     * title of the object.
     * @param {string} description - The `description` parameter is a string that
     * represents a description or summary of the object being created. It
     * provides additional information about the object's purpose or
     * characteristics.
     * @param {ActionReaction[]} actions - The `actions` parameter is an array of
     * `ActionReaction` objects. Each `ActionReaction` object represents an action
     * that can be performed on the object. It contains information such as the
     * action name and the reaction that should occur when the action is
     * performed.
     * @param {ActionReaction[]} reactions - The `reactions` parameter is an array
     * of `ActionReaction` objects. Each `ActionReaction` object represents a
     * reaction that can be triggered in response to an action.
     * @param {boolean} [isConnected] - The `isConnected` parameter is an optional
     * boolean parameter that indicates whether the object is connected or not. It
     * is not required to provide a value for this parameter when creating an
     * instance of the object.
     */
    constructor(
        public readonly name: string,
        public readonly image: string = "",
        public readonly title: string,
        public readonly description: string,
        public readonly actions: ActionReaction[] = [],
        public readonly reactions: ActionReaction[] = [],
        public readonly isConnected?: boolean,
    ) {}
}
