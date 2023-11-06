/*
File Name: ISelectProps.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Interface for the select component

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

/**
 * The ISelectOptionsProps type defines the properties for a select option,
 * including name, label, value, icon, and click function.
 * @property {string} name - A string representing the name of the select option.
 * This is used to identify the option when it is selected or submitted.
 * @property {string} label - The label property is a string that represents the
 * text label for the select option.
 * @property {string} value - The `value` property is a string that represents the
 * selected value of the select options.
 * @property {string} icon - An optional property that represents the icon
 * associated with the select option. It is of type string.
 * @property click - The `click` property is an optional callback function that
 * will be called when the select option is clicked. It does not take any
 * arguments and does not return any value.
 */
export type ISelectOptionsProps = {
    name: string;
    label: string;
    value: string;
    icon?: string;
    click?: () => void;
};

/**
 * The above type represents the props required for a select component in
 * TypeScript, including label, name, id, options, and an additional option
 * attribute.
 * @property {string} label - A string that represents the label for the select
 * input field.
 * @property {string} name - The `name` property is a string that represents the
 * name of the select input field.
 * @property {string} id - A unique identifier for the select element.
 * @property options - An array of objects representing the options for the select
 * input. Each object should have the following properties:
 * @property {string}  - - `label`: A string representing the label for the select
 * input.
 */
export type ISelectProps = {
    label: string;
    name: string;
    id: string;
    options: Array<ISelectOptionsProps>;
    "option-attribute": string;
};
