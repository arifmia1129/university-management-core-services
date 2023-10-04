import { RedisClient } from "../../../shared/redis";
import { EVENT_CREATE_STUDENT } from "./student.constant";
import { createStudentFromEventService } from "./student.service";

const initStudentEvent = () => {
  RedisClient.subscribe(EVENT_CREATE_STUDENT, async (event: string) => {
    const data = JSON.parse(event);
    await createStudentFromEventService(data);
  });
};

export default initStudentEvent;
