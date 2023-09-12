/* eslint-disable @typescript-eslint/no-explicit-any */
const groupByAcademicSemester = (courses: any) => {
  const groupData = courses.reduce((result: any, course: any) => {
    const academicSemester = course.academicSemester;

    const existingGroup = result.find(
      (groud: any) => groud.academicSemesterId === academicSemester.id,
    );

    if (existingGroup) {
      existingGroup.completedCourses.push(course);
    } else {
      result.push({
        academicSemester,
        completedCourses: [course],
      });
    }
    return result;
  }, []);

  return groupData;
};

export const studentUtils = { groupByAcademicSemester };
