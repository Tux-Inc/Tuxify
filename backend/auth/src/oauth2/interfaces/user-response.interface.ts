/*
File Name: user-response.interface.ts
Author: Gwenaël Hubler, Stephane Fievez, Roman Lopes, Alexandre Kévin De Freitas Martins, Bouna Diallo
Creation Date: 2023
Description: Interface for user response

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

import { IAuthResponseTokensInterface } from "./auth-response-tokens.interface";

/* The `IMicrosoftUser` interface is defining the structure of an object
representing a Microsoft user. It includes properties such as `businessPhones`,
`displayName`, `givenName`, `jobTitle`, `mail`, `mobilePhone`,
`officeLocation`, `preferredLanguage`, `surname`, `userPrincipalName`, `id`,
and `tokens`. These properties describe various details about the Microsoft
user, such as their contact information, name, job title, and unique
identifier. The `tokens` property is of type `IAuthResponseTokensInterface`,
which likely represents authentication tokens associated with the user. The
`readonly` keyword indicates that these properties cannot be modified once they
are assigned a value. */
export interface IMicrosoftUser {
    readonly businessPhones: string[];
    readonly displayName: string;
    readonly givenName: string;
    readonly jobTitle: string;
    readonly mail: string;
    readonly mobilePhone: string;
    readonly officeLocation: string;
    readonly preferredLanguage: string;
    readonly surname: string;
    readonly userPrincipalName: string;
    readonly id: string;
    readonly tokens: IAuthResponseTokensInterface;
}

/* The `export interface IGoogleUser` is defining the structure of an object
representing a Google user. It includes properties such as `sub`, `name`,
`given_name`, `family_name`, `picture`, `email`, `email_verified`, `locale`,
`hd`, and `tokens`. These properties describe various details about the Google
user, such as their name, email, profile picture, and authentication tokens.
The `readonly` keyword indicates that these properties cannot be modified once
they are assigned a value. */
export interface IGoogleUser {
    readonly sub: string;
    readonly name: string;
    readonly given_name: string;
    readonly family_name: string;
    readonly picture: string;
    readonly email: string;
    readonly email_verified: boolean;
    readonly locale: string;
    readonly hd: string;
    readonly tokens: IAuthResponseTokensInterface;
}

/* The `export interface IFacebookUser` is defining the structure of an object
representing a Facebook user. It includes properties such as `id`, `name`,
`email`, and `tokens`. These properties describe various details about the
Facebook user, such as their unique identifier, name, email, and authentication
tokens. The `readonly` keyword indicates that these properties cannot be
modified once they are assigned a value. */
export interface IFacebookUser {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly tokens: IAuthResponseTokensInterface;
}

/* The `IGitHubPlan` interface is defining the structure of an object representing
a GitHub plan. It includes properties such as `name`, `space`, `private_repos`,
and `collaborators`. These properties describe various details about the GitHub
plan, such as the plan name, available space, number of private repositories,
and number of collaborators. The `readonly` keyword indicates that these
properties cannot be modified once they are assigned a value. */
interface IGitHubPlan {
    readonly name: string;
    readonly space: number;
    readonly private_repos: number;
    readonly collaborators: number;
}

/* The `export interface IGitHubUser` is defining the structure of an object
representing a GitHub user. It includes properties such as `login`, `id`,
`node_id`, `avatar_url`, `gravatar_id`, `url`, `html_url`, `followers_url`,
`following_url`, `gists_url`, `starred_url`, `subscriptions_url`,
`organizations_url`, `repos_url`, `events_url`, `received_events_url`, `type`,
`site_admin`, `name`, `company`, `blog`, `location`, `email`, `hireable`,
`bio`, `twitter_username`, `public_repos`, `public_gists`, `followers`,
`following`, `created_at`, `updated_at`, `private_gists`,
`total_private_repos`, `owned_private_repos`, `disk_usage`, `collaborators`,
`two_factor_authentication`, `plan`, and `tokens`. */
export interface IGitHubUser {
    readonly login: string;
    readonly id: number;
    readonly node_id: string;
    readonly avatar_url: string;
    readonly gravatar_id: string;
    readonly url: string;
    readonly html_url: string;
    readonly followers_url: string;
    readonly following_url: string;
    readonly gists_url: string;
    readonly starred_url: string;
    readonly subscriptions_url: string;
    readonly organizations_url: string;
    readonly repos_url: string;
    readonly events_url: string;
    readonly received_events_url: string;
    readonly type: string;
    readonly site_admin: boolean;
    readonly name: string;
    readonly company: string;
    readonly blog: string;
    readonly location: string;
    readonly email: string;
    readonly hireable: boolean;
    readonly bio: string;
    readonly twitter_username: string;
    readonly public_repos: number;
    readonly public_gists: number;
    readonly followers: number;
    readonly following: number;
    readonly created_at: string;
    readonly updated_at: string;
    readonly private_gists: number;
    readonly total_private_repos: number;
    readonly owned_private_repos: number;
    readonly disk_usage: number;
    readonly collaborators: number;
    readonly two_factor_authentication: boolean;
    readonly plan: IGitHubPlan;
    readonly tokens: IAuthResponseTokensInterface;
}
