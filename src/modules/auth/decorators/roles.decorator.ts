import { Reflector } from '@nestjs/core';
import { EUserRole } from 'src/shared/types/auth.types';

export const Roles = Reflector.createDecorator<EUserRole[]>();
