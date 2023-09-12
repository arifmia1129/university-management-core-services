/* eslint-disable @typescript-eslint/no-explicit-any */
const getAvailableCourses = (
  completedCourses: any,
  pendingCourses: any,
  offerCourses: any,
) => {
  const completedCourseIds = completedCourses.map(
    (course: any) => course.courseId,
  );

  const availableCourses = offerCourses
    .filter((course: any) => !completedCourseIds.includes(course.courseId))
    .filter((course: any) => {
      const preRequisites = course.course.preRequsite;

      if (!preRequisites) {
        return true;
      } else {
        const preRequisiteIds = preRequisites.map(
          (preRequisite: any) => preRequisite.preRequisiteId,
        );
        return preRequisiteIds.every((id: string) =>
          completedCourseIds.includes(id),
        );
      }
    })
    .map((course: any) => {
      const isAlreadyTaken = pendingCourses.find(
        (cr: any) => cr.offeredCourseId === course.id,
      );

      if (isAlreadyTaken) {
        course?.offerCourseSections?.map((section: any) => {
          if (section.id === isAlreadyTaken.offeredCourseId) {
            section.isTaken = true;
          } else {
            section.isTaken = false;
          }
        });
        return {
          ...course,
          isTaken: true,
        };
      } else {
        course?.offerCourseSections?.map((section: any) => {
          section.isTaken = false;
        });

        return {
          ...course,
          isTaken: false,
        };
      }
    });
  return availableCourses;
};

export const semesterRegistrationUtils = { getAvailableCourses };
