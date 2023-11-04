/*
File Name: request.mock.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Mock for request

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

import { FastifyRequest } from "fastify";

/* The RequestMock class is a mock implementation of a request object that allows
setting and removing cookies, as well as verifying the validity of a signed
cookie. */
class RequestMock {
    /* The line `public cookies: Record<string, string> = {};` is declaring a public
  property named `cookies` in the `RequestMock` class. The property is of type
  `Record<string, string>`, which represents an object with string keys and
  string values. The property is initialized with an empty object `{}`. This
  property is used to store the cookies associated with the request. */
    public cookies: Record<string, string> = {};
    /* The line `public headers: Record<string, Record<string, string>> = {};` is
  declaring a public property named `headers` in the `RequestMock` class. The
  property is of type `Record<string, Record<string, string>>`, which
  represents an object with string keys and values that are themselves objects
  with string keys and string values. The property is initialized with an empty
  object `{}`. This property is used to store the headers associated with the
  request. */
    public headers: Record<string, Record<string, string>> = {};

    /**
     * The function sets a cookie with a given name and value.
     * @param {string} name - A string representing the name of the cookie.
     * @param {string} value - The value parameter is a string that represents the
     * value to be stored in the cookie.
     */
    public setCookie(name: string, value: string): void {
        this.cookies[name] = value;
    }

    /**
     * The removeCookie function deletes a cookie with the specified name from the
     * cookies object.
     * @param {string} name - The name parameter is a string that represents the
     * name of the cookie that you want to remove.
     */
    public removeCookie(name: string): void {
        delete this.cookies[name];
    }

    /**
     * The function `unsignCookie` takes a cookie string, searches for it in a
     * cookies object, and returns an object with the cookie value and a boolean
     * indicating its validity.
     * @param {string} cookie - The `cookie` parameter is a string that represents
     * the cookie value that needs to be validated.
     * @returns An object with two properties: "value" and "valid". The "value"
     * property contains the value of the cookie, and the "valid" property is set to
     * true.
     */
    public unsignCookie(cookie: string): { value: string; valid: boolean } {
        const value = Object.values(this.cookies).find((c) => c === cookie);
        return { value, valid: true };
    }
}

/* The `interface ExtendedRequestMock` is extending the `FastifyRequest` interface
from the Fastify framework. It adds two additional methods `setCookie` and
`removeCookie` to the `ExtendedRequestMock` interface. These methods allow
setting and removing cookies from the request object. By extending the
`FastifyRequest` interface, the `ExtendedRequestMock` interface inherits all
the properties and methods from `FastifyRequest` and adds the two additional
methods specific to the mock implementation. */
interface ExtendedRequestMock extends FastifyRequest {
    /* The line `setCookie: (name: string, value: string) => void;` is defining a
  method signature for the `setCookie` method in the `ExtendedRequestMock`
  interface. */
    setCookie: (name: string, value: string) => void;
    /* The line `removeCookie: (name: string) => void;` is defining a method
  signature for the `removeCookie` method in the `ExtendedRequestMock`
  interface. This method takes a `name` parameter of type `string` and does not
  return any value (`void`). It is used to remove a cookie with the specified
  name from the cookies object in the request object. */
    removeCookie: (name: string) => void;
}

/**
 * The function creates a mock request object.
 */
export const createRequestMock = (): ExtendedRequestMock =>
    new RequestMock() as unknown as ExtendedRequestMock;
