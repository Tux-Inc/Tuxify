/*
File Name: action-reaction-output.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: DTO for action reaction output field
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

/* The `ActionReactionOutput` class is a TypeScript class that represents an
object with a name, title, and optional value property. */
export class ActionReactionOutput<T> {
    /**
     * The constructor function creates an object with a name, title, and optional
     * value property.
     * @param {string} name - A string representing the name of the object being
     * constructed. This parameter is marked as "readonly", meaning that it cannot
     * be modified after the object is created.
     * @param {string} title - The `title` parameter is a string that represents
     * the title of the object being constructed.
     * @param {T} [value] - The "value" parameter is an optional parameter of type
     * T. It is denoted by the "?" symbol after the parameter name, indicating
     * that it can be undefined or omitted when calling the constructor.
     */
    constructor(
        public readonly name: string,
        public readonly title: string,
        public readonly value?: T,
    ) {}
}
