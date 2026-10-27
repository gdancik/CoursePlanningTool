import {
 normalizeExcelCells, ExcelRowHasData, schedRowsToExcelRows, excelRowsToSchedRows,
 normalizeExcelDateCell, type ExcelSchedRow
} from '../../../../../components/CourseScheduleComponent/XLSX/mappers';
import {runTableTests,runErrorTableTests} from '../../../../helpers/courseScheduleTestDriver';
import {row} from '../CourseScheduleUnitTest/testRows';
const excelRow=(overrides:Partial<ExcelSchedRow>={}):ExcelSchedRow=>({
 Date:'',Day:'','Unit and Theme/Topic':'','Learning Outcomes Addressed':'','Reading/Assignments Due':'',...overrides
});
runTableTests('normalizeExcelCells',normalizeExcelCells,[
 {name:'null',input:null,expected:''},
 {name:'undefined',input:undefined,expected:''},
 {name:'numeric',input:42,expected:'42'},
 {name:'trimmed',input:'  Text  ',expected:'Text'},
]);
runTableTests('ExcelRowHasData',ExcelRowHasData,[
 {name:'blank row',input:excelRow(),expected:false},
 {name:'whitespace only',input:excelRow({Day:'  '}),expected:false},
 {name:'date populated',input:excelRow({Date:'01/02/2026'}),expected:true},
 {name:'unit populated',input:excelRow({'Unit and Theme/Topic':'Topic'}),expected:true},
]);
runTableTests('normalizeExcelDateCell',normalizeExcelDateCell,[
 {name:'null',input:null,expected:''},
 {name:'empty',input:'  ',expected:''},
 {name:'normalizes leading zeroes',input:'2/3/2026',expected:'02/03/2026'},
 {name:'two-digit year',input:'2/3/26',expected:'02/03/2026'},
 {name:'hyphen separator',input:'2-3-2026',expected:'02/03/2026'},
 {name:'range',input:'2/3/2026 - 2/5/2026',expected:'02/03/2026 - 02/05/2026'},
 {name:'Excel serial date',input:46054,expected:'02/01/2026'},
 {name:'leap day',input:'2/29/2024',expected:'02/29/2024'},
]);
runErrorTableTests('normalizeExcelDateCell invalid dates',normalizeExcelDateCell,[
 {name:'invalid month',input:'13/01/2026',error:/Month must be between 1 and 12/},
 {name:'invalid leap day',input:'2/29/2026',error:/only has 28 days/},
 {name:'invalid format',input:'February 3 2026',error:/Dates must use a valid date format/},
 {name:'invalid range end',input:'02/03/2026 - 02/30/2026',error:/only has 28 days/},
]);
test('schedRowsToExcelRows maps five columns, omitting metadata',()=>{
 expect(schedRowsToExcelRows([row('x','01/02/2026',{day:'M',unit:'Unit',learningOutcomes:'Outcome',readingAssignments:'Read'})])).toEqual([
 {Date:'01/02/2026',Day:'M','Unit and Theme/Topic':'Unit','Learning Outcomes Addressed':'Outcome','Reading/Assignments Due':'Read'}
 ]);
});
test('excelRowsToSchedRows drops empty rows, trims cells, and adds date metadata',()=>{
 const result=excelRowsToSchedRows([
 excelRow(),
 excelRow({Date:'2/3/2026',Day:' M ','Unit and Theme/Topic':'  Topic  '})
 ],2026);
 expect(result).toHaveLength(1);
 expect(result[0]).toMatchObject({date:'02/03/2026',day:'M',unit:'Topic'});
 expect(Number.isFinite(result[0].dateTimestamp)).toBe(true);
});
test('excelRowsToSchedRows returns a single empty row when no content',()=>{
 expect(excelRowsToSchedRows([excelRow()],2026)).toEqual([
 expect.objectContaining({date:'',day:'',unit:''})
 ]);
});
test('Excel round-trip preserves visible fields',()=>{
 const original=[row('one','01/02/2026',{day:'M',unit:'One',learningOutcomes:'LO',readingAssignments:'Read'})];
 const imported=excelRowsToSchedRows(schedRowsToExcelRows(original),2026);
 expect(schedRowsToExcelRows(imported)).toEqual(schedRowsToExcelRows(original));
});
