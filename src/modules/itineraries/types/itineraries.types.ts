import { Itinerary } from '../entities/itinerary.entity';
import { ItineraryMember } from '../entities/itinerary-member.entity';

export enum EItineraryMemberRole {
  OWNER = 1,
  MEMBER = 2,
}

export interface IItineraryResponse extends Itinerary {
  owner: ItineraryMember;
}

export interface IRawMember {
  id: number;
  user_id: number;
  role: string | number;
  user_username?: string;
  user_email?: string;
  user_avatar?: string | null;
}
