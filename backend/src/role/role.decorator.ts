import { SetMetadata } from '@nestjs/common';
import { Roles } from './role.enum';

export const RolesRequired = (...roles: Roles[]) => SetMetadata('roles', roles);
