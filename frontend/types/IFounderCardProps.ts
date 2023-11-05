/*
File Name: IFounderCardProps.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Interface for the founder card component

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

/* The `export interface ISocialProps` is defining another interface in
TypeScript. This interface represents the structure of social media properties.
It has three properties: `icon`, `name`, and `link`, all of which are of type
string. This interface is used as a property in the `IFounderCardProps`
interface to define the structure of social media links for a founder card
component. */
export interface ISocialProps {
    icon: string;
    name: string;
    link: string;
}

/* The `export interface IFounderCardProps` is defining an interface in
TypeScript. An interface is a way to define the structure of an object. In this
case, the `IFounderCardProps` interface has the following properties: */
export interface IFounderCardProps {
    image: string;
    alt: string;
    name: string;
    job: string;
    description: string;
    socials: ISocialProps[];
}
