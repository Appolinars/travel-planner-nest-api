import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { ItineraryMembersService } from '../services/itinerary-members.service';
import { EItineraryMemberRole } from '../types/itineraries.types';

@Injectable()
export class ItineraryOwnerGuard implements CanActivate {
  constructor(private itineraryMembersService: ItineraryMembersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming JWT guard sets the user in request

    const itineraryId = this.getItineraryIdFromRequest(request);

    if (!user || !itineraryId) {
      throw new ForbiddenException('Unauthorized access');
    }

    // Check if user is the owner of the itinerary
    const memberRole = await this.itineraryMembersService.getMemberRole({
      user_id: user.id,
      itinerary_id: itineraryId,
    });

    if (!memberRole || memberRole !== EItineraryMemberRole.OWNER) {
      throw new ForbiddenException(
        'Only itinerary owners can perform this action',
      );
    }

    return true;
  }

  private getItineraryIdFromRequest(request: any): number | null {
    if (request.body && request.body.itinerary_id) {
      return parseInt(request.body.itinerary_id, 10);
    }

    return null;
  }
}
