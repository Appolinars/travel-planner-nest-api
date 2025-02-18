import { Itinerary } from '../entities/itinerary.entity';
import { ItineraryMember } from '../entities/itinerary-member.entity';

export enum EItineraryMemberRole {
  OWNER = 1,
  MEMBER = 2,
}

export interface IItineraryResponse extends Itinerary {
  owner: ItineraryMember;
}
