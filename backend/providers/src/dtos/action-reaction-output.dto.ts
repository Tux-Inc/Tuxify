/*
File Name: action-reaction-output.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: The `ActionReactionOutput` class represents an output field with properties for name, title, and optional value property.
             It is used to represent the output of an action or reaction. The `T` type indicates that the output can be of any type.
             The `?` symbol after the `value` parameter name indicates that it is an optional parameter.
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
   * @param {string} name - The name parameter is a string that represents the
   * name of the object being created.
   * @param {string} title - The `title` parameter is a string that represents the
   * title of something. It is marked as `readonly`, which means that its value
   * cannot be changed once it is set in the constructor.
   * @param {T} [value] - The `value` parameter is an optional parameter of type
   * `T`. It is denoted by the `?` symbol after the parameter name, indicating
   * that it can be omitted when creating an instance of the class.
   */
  constructor(
    public readonly name: string,
    public readonly title: string,
    public readonly value?: T,
  ) {}
}
