import initFacultyEvent from "../modules/faculty/faculty.event";
import initStudentEvent from "../modules/student/student.event";

const subscribeEvents = async () => {
  await initStudentEvent();
  initFacultyEvent();
};

export default subscribeEvents;
