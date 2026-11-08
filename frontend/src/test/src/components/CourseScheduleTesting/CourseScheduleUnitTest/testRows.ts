import type {CourseScheduleRow} from '../../../../../components/CourseScheduleComponent/types/courseScheduleTypes';
import {withParsedDateMetadata} from '../../../../../components/CourseScheduleComponent/utilities/dateUtils';
/** Stable test data: avoid crypto.randomUUID and unrelated mocks. */
export const row = (id:string,date:string, overrides:Partial<CourseScheduleRow>={}) =>
 withParsedDateMetadata({id,date,day:'M',unit:'',learningOutcomes:'',readingAssignments:'',...overrides},2026);
