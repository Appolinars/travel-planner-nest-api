import { Itinerary } from '../entities/itinerary.entity';
import { ItineraryMember } from '../entities/itinerary-member.entity';

export enum EItineraryUserRole {
  OWNER = 'owner',
  MEMBER = 'member',
}

export interface IItineraryResponse extends Itinerary {
  owner: ItineraryMember;
}
