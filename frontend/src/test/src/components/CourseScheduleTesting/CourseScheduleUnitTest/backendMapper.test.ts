import {
 backendArrayRowToScheduleRow,backendScheduleToRows,generatedScheduleItemsToRows
} from '../../../../../components/CourseScheduleComponent/utilities/mapper';
import {runTableTests} from '../../../../helpers/courseScheduleTestDriver';
const headers=['Date','Day','Unit','Outcomes','Reading'];
runTableTests('backendScheduleToRows',(data:unknown)=>backendScheduleToRows(data,2026).map(r=>[r.date,r.day,r.unit]),[
 {name:'undefined fallback',input:undefined,expected:[['','','']]},
 {name:'malformed JSON fallback',input:'not-json',expected:[['','','']]},
 {name:'object fallback',input:{hello:'world'},expected:[['','','']]},
 {name:'header only fallback',input:[headers],expected:[['','','']]},
 {name:'JSON body',input:JSON.stringify([headers,['02/03/2026','T','Topic']]),expected:[['02/03/2026','T','Topic']]},
 {name:'skip non-array body',input:[headers,'junk',['02/03/2026','T','Topic']],expected:[['02/03/2026','T','Topic']]},
]);
test('backendArrayRowToScheduleRow coerces null and numeric cells',()=>{
 const r=backendArrayRowToScheduleRow(['02/03/2026','T',123,null,undefined],2026);
 expect(r).toMatchObject({date:'02/03/2026',day:'T',unit:'123',learningOutcomes:'',readingAssignments:''});
 expect(Number.isFinite(r.dateTimestamp)).toBe(true);
});
test('generatedScheduleItemsToRows maps API fields',()=>{
 const result=generatedScheduleItemsToRows([{Date:'02/03/2026',Day:'Tuesday',Description:'Opening'}],2026);
 expect(result).toHaveLength(1);
 expect(result[0]).toMatchObject({date:'02/03/2026',day:'Tuesday',unit:'Opening',learningOutcomes:'',readingAssignments:''});
});
