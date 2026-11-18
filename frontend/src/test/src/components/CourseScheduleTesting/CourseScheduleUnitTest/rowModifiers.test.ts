import {
 insertEmptyRowAtIndex,deleteRowAtIndex,clearScheduleRows,updateRowAtIndex,
 updateDateFieldAtIndex,normalizeDateFieldAtIndex,sortScheduleRowsByDate,
 formatScheduleRowsByDate,formatScheduleRowsByDayDisplay
} from '../../../../../components/CourseScheduleComponent/utilities/modifiers/rowModifiers';
import {INVALID_DATE_TIMESTMP} from '../../../../../components/CourseScheduleComponent/utilities/dateUtils';
import {row} from './testRows';
const a=row('a','01/02/2026',{day:'Monday'});
const b=row('b','02/03/2026',{day:'Thursday'});
test('insertEmptyRowAtIndex inserts after the requested index',()=>{
 const result=insertEmptyRowAtIndex([a,b],0);
 expect(result).toHaveLength(3);
 expect(result[0]).toBe(a);
 expect(result[1]).toMatchObject({date:'',day:'',unit:''});
 expect(result[2]).toBe(b);
});
test('deleteRowAtIndex preserves the last row',()=>{
 expect(deleteRowAtIndex([a],0)).toEqual([a]);
 expect(deleteRowAtIndex([a,b],0)).toEqual([b]);
});
test('clearScheduleRows keeps the same row count and blanks content',()=>{
 const result=clearScheduleRows([a,b]);
 expect(result).toHaveLength(2);
 result.forEach(r=>expect(r).toMatchObject({date:'',day:'',unit:''}));
 expect(clearScheduleRows([])).toHaveLength(1);
});
test('updateRowAtIndex updates only the target',()=>{
 const result=updateRowAtIndex([a,b],1,'unit','Unit 2');
 expect(result[0]).toBe(a);
 expect(result[1].unit).toBe('Unit 2');
 expect(b.unit).toBe('');
});
test('updateDateFieldAtIndex resets standalone metadata but sets sortable timestamp',()=>{
 const result=updateDateFieldAtIndex([a,b],0,'03/04/2026',2026);
 expect(result[0].date).toBe('03/04/2026');
 expect(result[0].dateTimestamp).toBe(INVALID_DATE_TIMESTMP);
 expect(Number.isFinite(result[0].sortableDateTimestamp)).toBe(true);
 expect(result[1]).toBe(b);
});
test('normalizeDateFieldAtIndex formats valid dates',()=>{
 const result=normalizeDateFieldAtIndex([a],0,'2/3/26',2026,'mm/dd/yyyy');
 expect(result[0].date).toBe('02/03/2026');
 expect(Number.isFinite(result[0].dateTimestamp)).toBe(true);
});
test('normalizeDateFieldAtIndex retains invalid dates',()=>{
 const result=normalizeDateFieldAtIndex([a],0,'invalid',2026,'mm/dd/yyyy');
 expect(result[0].date).toBe('invalid');
 expect(result[0].dateTimestamp).toBe(INVALID_DATE_TIMESTMP);
});
test('sortScheduleRowsByDate sorts ascending',()=>{
 expect(sortScheduleRowsByDate([b,a],2026).map(r=>r.id)).toEqual(['a','b']);
});
test('formatScheduleRowsByDate reformats valid dates',()=>{
 expect(formatScheduleRowsByDate([a],2026,'mm/dd')[0].date).toBe('01/02');
});
test('formatScheduleRowsByDayDisplay converts weekday names',()=>{
 expect(formatScheduleRowsByDayDisplay([a,b],{format:'codes',thursdayOption:'Th'}).map(r=>r.day)).toEqual(['M','Th']);
});
