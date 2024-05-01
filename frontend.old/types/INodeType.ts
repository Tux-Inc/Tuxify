/*
File Name: INodeType.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Interface for the node type component

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

import { Raw } from "@vue/reactivity";

/**
 * The INodeType type represents a node with properties such as icon, name,
 * description, type, and component.
 * @property {string} icon - The `icon` property is a string that represents the
 * icon associated with the node type. It can be used to visually identify the
 * node type in a user interface or any other context where icons are used.
 * @property {string} name - The name property is a string that represents the
 * name of the node type.
 * @property {string} description - The `description` property is a string that
 * provides a brief explanation or summary of the node type. It can be used to
 * provide additional information about the purpose or functionality of the node
 * type.
 * @property {string} type - The `type` property in the `INodeType` type
 * represents the type of the node. It can be any string value that describes the
 * type of the node.
 * @property component - The `component` property is a reference to a React
 * component. It is of type `Raw<unknown>`, which means it can accept any type of
 * component as its value.
 */
export type INodeType = {
    icon: string;
    name: string;
    description: string;
    type: string;
    component: Raw<unknown>;
};
