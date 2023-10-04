import { RedisClient } from "../../../shared/redis";
import {
  EVENT_CREATE_FACULTY,
  EVENT_UPDATED_FACULTY,
} from "./faculty.constant";
import {
  createFacultyFromEventService,
  updateFacultyFromEvent,
} from "./faculty.service";

const initFacultyEvent = () => {
  RedisClient.subscribe(EVENT_CREATE_FACULTY, async (event: string) => {
    const data = JSON.parse(event);
    await createFacultyFromEventService(data);
  });
  RedisClient.subscribe(EVENT_UPDATED_FACULTY, async (event: string) => {
    const data = JSON.parse(event);
    await updateFacultyFromEvent(data);
  });
};

export default initFacultyEvent;
