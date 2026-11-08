import {deduplicateRows,sortRowsByDate,areRowsSortedByDate,hasScheduleContent,mergeGeneratedRows} from '../../../../../components/CourseScheduleComponent/utilities/rowUtils';
import {row} from './testRows';
import {runTableTests} from '../../../../helpers/courseScheduleTestDriver';
const early=row('early','01/05/2026');
const late=row('late','03/05/2026');
runTableTests('areRowsSortedByDate',(rows:ReturnType<typeof row>[])=>areRowsSortedByDate(rows,2026),[
 {name:'empty',input:[],expected:true},
 {name:'sorted',input:[early,late],expected:true},
 {name:'unsorted',input:[late,early],expected:false},
]);
runTableTests('hasScheduleContent',hasScheduleContent,[
 {name:'no rows',input:[],expected:false},
 {name: "blank",input: [row("a", "", { day: "" })],expected: false},
 {name:'content in unit',input:[row('a','',{unit:'Chapter 1'})],expected:true},
]);
test('sortRowsByDate is stable and does not mutate input',()=>{
 const sameDate=row('same','01/05/2026');
 const original=[late,early,sameDate];
 expect(sortRowsByDate(original,2026).map(r=>r.id)).toEqual(['early','same','late']);
 expect(original.map(r=>r.id)).toEqual(['late','early','same']);
});
test('deduplicateRows ignores id and case for identical content',()=>{
 const duplicate=row('other','01/05/2026',{day:'m'});
 expect(deduplicateRows([early,duplicate,late]).map(r=>r.id)).toEqual(['early','late']);
});
test('mergeGeneratedRows deduplicates and sorts',()=>{
 const duplicate=row('other','01/05/2026');
 expect(mergeGeneratedRows([late,early],[duplicate],2026).map(r=>r.id)).toEqual(['early','late']);
});
