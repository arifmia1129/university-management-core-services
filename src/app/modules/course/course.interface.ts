export type ICreateCourse = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: {
    courseId: string;
    isDeleted?: boolean;
  }[];
};
