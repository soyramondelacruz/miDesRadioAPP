export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type ScheduleItemType = "music" | "program" | "ads" | "live" | "other";

export interface ScheduleItem {
  id: string;
  title: string;
  type: ScheduleItemType;
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  description?: string;
  tags?: string[];
}

export interface ScheduleDay {
  day: Weekday;
  items: ScheduleItem[];
}

export interface SchedulePayload {
  timezone: string;
  week: ScheduleDay[];
}

export interface NowPlayingShow {
  id: string;
  title: string;
  host?: string;
  startTime?: string; // "HH:mm"
  endTime?: string;   // "HH:mm"
  description?: string;
  coverImage?: string;
}

export interface NowPlayingTrack {
  title?: string;
  artist?: string;
  album?: string;
  artwork?: string;
}

export interface NowPlayingPayload {
  isLive: boolean;
  station: string;
  show?: NowPlayingShow;
  track?: NowPlayingTrack;
  updatedAt: string; // ISO string
}