export const offeredCourseClassScheduleSearchableField = ["dayOfWeek"];

export const offeredCourseClassScheduleFilterableField = [
  "dayOfWeek",
  "searchTerm",
];

export const offeredCourseClassScheduleRelationalField = [
  "offeredCourseSectionId",
  "semeterRegistrationId",
  "facultyId",
  "roomId",
];

export const offeredCourseClassScheduleRelationalFieldsMapper: {
  [key: string]: string;
} = {
  offeredCourseSectionId: "offeredCourseSection",
  semeterRegistrationId: "semeterRegistration",
  facultyId: "faculty",
  roomId: "room",
};
