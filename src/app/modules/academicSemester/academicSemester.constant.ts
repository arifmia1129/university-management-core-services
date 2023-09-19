export const academicSemesterSearchableField = [
  "title",
  "code",
  "startMonth",
  "endMonth",
];

export const academicSemesterFilterableField = [
  "year",
  "title",
  "searchTerm",
  "code",
];

export const academicSemesterTitleWithCode: { [key: string]: string } = {
  Autumn: "01",
  Summer: "02",
  Fall: "03",
};

export const EVENT_CREATED_ACADEMIC_SEMESTER = "createdAcademicSemester";
export const EVENT_UPDATED_ACADEMIC_SEMESTER = "updatedAcademicSemester";
export const EVENT_DELETED_ACADEMIC_SEMESTER = "deletedAcademicSemester";
