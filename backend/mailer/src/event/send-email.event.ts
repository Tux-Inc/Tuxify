/*
File Name: send-email.event.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Event for send email file
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

/* The `SendEmailEvent` class represents an email object with properties such as
recipient, subject, text content, HTML content, template, and context. */
export class SendEmailEvent {
    /**
     * The constructor function creates an instance of an email object with
     * specified properties.
     * @param {string} to - The email address of the recipient.
     * @param {string} subject - The subject of the email. It is a string that
     * represents the subject line of the email.
     * @param {string} text - The `text` parameter is a string that represents the
     * plain text content of the email. It is typically used as a fallback option
     * for email clients that do not support HTML content.
     * @param {string} [html] - This parameter is optional and represents the HTML
     * content of the email. If provided, the email will be sent as an HTML email.
     * @param {string} [template] - The `template` parameter is an optional string
     * that represents the template to be used for the email. It can be used to
     * provide a pre-defined email template that includes placeholders for dynamic
     * content.
     * @param {any} [context] - The `context` parameter is an optional parameter
     * that allows you to pass additional data or variables to be used in the
     * email template. It can be of any type, as indicated by the `any` type
     * annotation.
     */
    constructor(
        public readonly to: string,
        public readonly subject: string,
        public readonly text: string,
        public readonly html?: string,
        public readonly template?: string,
        public readonly context?: any,
    ) {}
}
