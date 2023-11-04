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

import { ActionInfos } from './action-infos.dto';
import { ReactionInfos } from './reaction-infos.dto';

/* The ProviderInfos class represents information about a provider, including its
name, title, image, reactions, and actions. */
export class ProviderInfos {
  /**
   * The constructor function creates an instance of a class with specified
   * properties.
   * @param {string} name - The name parameter is a string that represents the
   * name of the object being constructed.
   * @param {string} title - The `title` parameter is a string that represents the
   * title of the object being constructed.
   * @param {string} [image] - The `image` parameter is a string that represents
   * the image associated with the object being constructed. It is an optional
   * parameter, as indicated by the `= ''` syntax, which means that if no value is
   * provided for `image` when creating an instance of this object, it will
   * default to an
   * @param {ReactionInfos[]} reactions - The `reactions` parameter is an array of
   * `ReactionInfos` objects. Each `ReactionInfos` object represents a reaction
   * that can be associated with the item.
   * @param {ActionInfos[]} actions - The `actions` parameter is an array of
   * `ActionInfos` objects. Each `ActionInfos` object represents an action that
   * can be performed on the object being constructed.
   */
  constructor(
    public readonly name: string,
    public readonly title: string,
    public readonly image: string = '',
    public readonly reactions: ReactionInfos[],
    public readonly actions: ActionInfos[],
  ) {}
}
