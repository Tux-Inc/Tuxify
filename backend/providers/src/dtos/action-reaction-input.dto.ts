/*
File Name: action-reaction-input.dto.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: The `ActionReactionInput` class represents an input field with properties for name, title, placeholder, required, and optional value.
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

/* The `ActionReactionInput` class represents an input field with properties for
name, title, placeholder, required, and optional value. */
export class ActionReactionInput {
  /**
   * The constructor function creates an instance of a class with properties for
   * name, title, placeholder, required, and optional value.
   * @param {string} name - The name parameter is a string that represents the
   * name of the input field. It is used to identify the input field when
   * submitting a form or accessing its value in JavaScript.
   * @param {string} title - The `title` parameter is a string that represents the
   * title or label of the input field. It is used to provide a description or
   * instruction to the user about the input that is expected in the field.
   * @param {string} placeholder - The `placeholder` parameter is a string that
   * represents the placeholder text that will be displayed in the input field
   * when it is empty.
   * @param {boolean} required - The `required` parameter is a boolean value that
   * indicates whether the input field is required or not. If `required` is set to
   * `true`, it means that the user must provide a value for the input field. If
   * `required` is set to `false`, it means that the input field
   * @param {string} [value] - The `value` parameter is an optional parameter of
   * type string. It represents the initial value of the input field. If provided,
   * the input field will be pre-filled with this value.
   */
  constructor(
    public readonly name: string,
    public readonly title: string,
    public readonly placeholder: string,
    public readonly required: boolean,
    public readonly value?: string,
  ) {}
}
