import {createEmptyScheduleRow,createScheduleRowId} from '../../../../../components/CourseScheduleComponent/utilities/factories';
import {INVALID_DATE_TIMESTMP} from '../../../../../components/CourseScheduleComponent/utilities/dateUtils';
test('createScheduleRowId delegates to crypto.randomUUID',()=>{
 const original=globalThis.crypto.randomUUID;
 const spy=jest.spyOn(globalThis.crypto,'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000001');
 try {expect(createScheduleRowId()).toBe('00000000-0000-4000-8000-000000000001');}
 finally {spy.mockRestore();}
});
test('createEmptyScheduleRow returns a fully blank row with invalid date metadata',()=>{
 const result=createEmptyScheduleRow();
 expect(result).toEqual({id:undefined,date:'',day:'',unit:'',learningOutcomes:'',readingAssignments:'',dateTimestamp:INVALID_DATE_TIMESTMP,sortableDateTimestamp:INVALID_DATE_TIMESTMP});
});
