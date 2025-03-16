export enum EItineraryMemberRole {
  OWNER = 1,
  MEMBER = 2,
}

export interface IRawOwner {
  member_id: number;
  role: string | number;
  user_id: number;
  username: string;
  email: string;
  avatar: string | null;
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

export interface IRawItineraryResult {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  destinations: string[];
}

export interface IRawFullItineraryResult extends IRawItineraryResult {
  member_id: number;
  role: string | number;
  user_id: number;
  username: string;
  email: string;
  avatar: string | null;
}
