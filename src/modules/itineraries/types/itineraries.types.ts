export enum EItineraryMemberRole {
  OWNER = 1,
  MEMBER = 2,
}

export interface IItineraryResponseOwner {
  id: number;
  user_id: number;
  role: EItineraryMemberRole;
  user: {
    username: string;
    email: string;
    avatar: string | null;
  };
}

export interface IItineraryResponse {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  description: string;
  destinations: string[];
  owner: IItineraryResponseOwner;
}

export interface IRawMember {
  id: number;
  user_id: number;
  role: string | number;
  user_username?: string;
  user_email?: string;
  user_avatar?: string | null;
}
