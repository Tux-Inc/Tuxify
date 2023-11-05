/*
File Name: ITooltipProps.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Interface for the tooltip component

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
 * The ITooltipProps type defines the properties for a tooltip component,
 * including text, visibility, position, and custom class.
 * @property {string} text - A string that represents the text content of the
 * tooltip.
 * @property {boolean} isVisible - This property determines whether the tooltip is
 * visible or not. If set to true, the tooltip will be displayed. If set to false,
 * the tooltip will be hidden.
 * @property {"top" | "bottom" | "left" | "right"} position - The "position"
 * property is used to specify the position of the tooltip relative to its target
 * element. It can have one of the following values:
 * @property {string} customClass - A string that represents a custom CSS class to
 * be applied to the tooltip component. This allows for custom styling of the
 * tooltip.
 */
export type ITooltipProps = {
    text?: string;
    isVisible?: boolean;
    position?: "top" | "bottom" | "left" | "right";
    customClass?: string;
};
