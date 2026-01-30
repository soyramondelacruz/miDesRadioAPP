import type { NowPlayingPayload, SchedulePayload } from "../types/content.types";

// Import estático: Metro soporta JSON.
// Esto permite “mock sin backend” y luego sustituimos por fetch remoto.
import nowPlayingJson from "../../now-playing.json";
import scheduleJson from "../../schedule.json";

class ContentService {
  async getNowPlaying(): Promise<NowPlayingPayload> {
    // En Fase 2: devolvemos mock.
    // En Fase 4/5 lo cambiamos por fetch a backend sin romper pantallas.
    return nowPlayingJson as NowPlayingPayload;
  }

  async getSchedule(): Promise<SchedulePayload> {
    return scheduleJson as SchedulePayload;
  }
}

export const contentService = new ContentService();