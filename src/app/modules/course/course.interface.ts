export type PreRequisiteCourse = {
  courseId: string;
  isDeleted?: boolean;
};

export type ICreateCourse = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: PreRequisiteCourse[];
};
