
import { ITokenBase } from './token-base.interface';

export interface IAccessPayload {
  id: number;
}

export interface IAccessToken extends IAccessPayload, ITokenBase {}
