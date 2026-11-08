import {
 INVALID_DATE_TIMESTMP, parseStandaloneDateValue, parseSortableRowDateValue,
 formatDate, validateScheduleDateValue, withParsedDateMetadata
} from '../../../../../components/CourseScheduleComponent/utilities/dateUtils';
import {runMultiArgTableTests,runTableTests,runErrorTableTests} from '../../../../helpers/courseScheduleTestDriver';
const stamp = (year:number,month:number,day:number) => new Date(year,month-1,day).getTime();
runMultiArgTableTests('parseStandaloneDateValue',parseStandaloneDateValue,[
 {name:'MM/DD',args:['02/28',2026],expected:stamp(2026,2,28)},
 {name:'MM/DD/YYYY',args:['02/28/2026',2025],expected:stamp(2026,2,28)},
 {name:'two-digit year',args:['02/28/26',2025],expected:stamp(2026,2,28)},
 {name:'month name',args:['Feb 28, 2026',2025],expected:stamp(2026,2,28)},
 {name:'leap day',args:['02/29/2024',2026],expected:stamp(2024,2,29)},
 {name:'invalid leap day',args:['02/29/2026',2026],expected:INVALID_DATE_TIMESTMP},
 {name:'invalid month',args:['13/01/2026',2026],expected:INVALID_DATE_TIMESTMP},
 {name:'invalid date',args:['not a date',2026],expected:INVALID_DATE_TIMESTMP},
 {name:'blank',args:['',2026],expected:INVALID_DATE_TIMESTMP},
]);
runMultiArgTableTests('parseSortableRowDateValue',parseSortableRowDateValue,[
 {name:'leading date in description',args:['02/03/2026 - 02/05/2026',2026],expected:stamp(2026,2,3)},
 {name:'no date',args:['N/A',2026],expected:INVALID_DATE_TIMESTMP},
]);
runMultiArgTableTests('formatDate',formatDate,[
 {name:'full year',args:[stamp(2026,2,3),'mm/dd/yyyy'],expected:'02/03/2026'},
 {name:'short year',args:[stamp(2026,2,3),'mm/dd/yy'],expected:'02/03/26'},
 {name:'month day',args:[stamp(2026,2,3),'mm/dd'],expected:'02/03'},
 {name:'invalid',args:[INVALID_DATE_TIMESTMP,'mm/dd/yyyy'],expected:''},
]);
runTableTests('withParsedDateMetadata', (date:string)=> {
 const result=withParsedDateMetadata({id:'x',date,day:'M',unit:'',learningOutcomes:'',readingAssignments:''},2026);
 return [result.dateTimestamp,result.sortableDateTimestamp];
},[
 {name:'standalone',input:'02/03/2026',expected:[stamp(2026,2,3),stamp(2026,2,3)]},
 {name:'range metadata',input:'02/03/2026 - 02/05/2026',expected:[INVALID_DATE_TIMESTMP,stamp(2026,2,3)]},
]);
runErrorTableTests('validateScheduleDateValue rejects invalid dates', (date:string)=>validateScheduleDateValue(date,2026),[
 {name:'invalid day',input:'02/30/2026',error:/Invalid date/},
 {name:'invalid range end',input:'02/03/2026 - 02/30/2026',error:/Date ranges/},
]);
test.each(['','02/03/2026','02/03/2026 - 02/05/2026'])('validateScheduleDateValue accepts %s',(date)=>{
 expect(()=>validateScheduleDateValue(date,2026)).not.toThrow();
});
