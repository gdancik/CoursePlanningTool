import {act,renderHook} from '@testing-library/react';
import {useCourseSchedule,missingScheduleInfo} from '../../../../../components/CourseScheduleComponent/CourseSchedule/useCourseSchedule';
import {useGenerateScheduleMutation} from "../../../../../components/CourseScheduleComponent/hooks/useGenerateScheduleMutation";
import {triggerInput} from '../../../../../services/triggerInput';
import {importExcelFile,exportRowsToExcel} from '../../../../../components/CourseScheduleComponent/XLSX/ExcelShorteners';

jest.mock('../../../../../components/CourseScheduleComponent/hooks/useGenerateScheduleMutation',()=>({useGenerateScheduleMutation:jest.fn()}));
jest.mock('../../../../../services/triggerInput',()=>({triggerInput:jest.fn()}));
jest.mock('../../../../../components/CourseScheduleComponent/XLSX/ExcelShorteners',()=>({
 importExcelFile:jest.fn(),exportRowsToExcel:jest.fn(),downloadScheduleTemplate:jest.fn()
}));
const mockedMutation=useGenerateScheduleMutation as jest.Mock;
const mockedImport=importExcelFile as jest.Mock;
beforeEach(()=>{
 jest.clearAllMocks();
 mockedMutation.mockReturnValue({mutateAsync:jest.fn().mockResolvedValue({schedule:[]}),isPending:false});
});
test.each([
 ['Fall','2026','MWF',false],['','2026','MWF',true],['Fall','', 'MWF',true],['Fall','2026','',true]
])('missingScheduleInfo handles %s/%s/%s',(term,year,days,expected)=>{
 expect(missingScheduleInfo(term,year,days)).toBe(expected);
});
test('normalizes inputs and initializes blank row',()=>{
 const {result}=renderHook(()=>useCourseSchedule({term:' fall ',year:'2026',days:['Friday','Monday'],data:undefined}));
 expect(result.current.normalizedTerm).toBe('Fall');
 expect(result.current.normalizedDays).toBe('MF');
 expect(result.current.scheduleRows).toHaveLength(1);
 expect(result.current.scheduleRows[0].date).toBe('');
});
test('add, edit, and delete schedule rows',()=>{
 const {result}=renderHook(()=>useCourseSchedule({term:'Fall',year:'2026',days:'MWF',data:undefined}));
 act(()=>result.current.addRow(0));
 expect(result.current.scheduleRows).toHaveLength(2);
 act(()=>result.current.updateRowField(1,'unit','Test Unit'));
 expect(result.current.scheduleRows[1].unit).toBe('Test Unit');
 act(()=>result.current.deleteRow(1));
 expect(result.current.scheduleRows).toHaveLength(1);
});
test('changes date format and day display options',()=>{
 const {result}=renderHook(()=>useCourseSchedule({term:'Fall',year:'2026',days:'MWF',data:undefined}));
 act(()=>result.current.changeDateFormat('mm/dd'));
 expect(result.current.dateFormat).toBe('mm/dd');
 act(()=>result.current.changeUseOneLetterDays(true));
 expect(result.current.useOneLetterDays).toBe(true);
 expect(triggerInput).toHaveBeenCalled();
});
test('exports current rows',()=>{
 const {result}=renderHook(()=>useCourseSchedule({term:'Fall',year:'2026',days:'MWF',data:undefined}));
 act(()=>result.current.exportScheduleToExcel());
 expect(exportRowsToExcel).toHaveBeenCalledWith(result.current.scheduleRows);
});
test('confirmed Excel import replaces rows',async()=>{
 mockedImport.mockResolvedValue([{id:'imported',date:'02/03/2026',day:'T',unit:'Imported',learningOutcomes:'',readingAssignments:'',dateTimestamp:0,sortableDateTimestamp:0}]);
 const confirmSpy=jest.spyOn(window,'confirm').mockReturnValue(true);
 try {
   const {result}=renderHook(()=>useCourseSchedule({term:'Fall',year:'2026',days:'MWF',data:undefined}));
   await act(async()=>{await result.current.importScheduleFromExcel(new File(['x'],'schedule.xlsx'));});
   expect(result.current.scheduleRows[0].unit).toBe('Imported');
   expect(triggerInput).toHaveBeenCalled();
 } finally {confirmSpy.mockRestore();}
});
test('cancelled Excel import preserves rows',async()=>{
 mockedImport.mockResolvedValue([{id:'imported',date:'02/03/2026',day:'T',unit:'Imported',learningOutcomes:'',readingAssignments:'',dateTimestamp:0,sortableDateTimestamp:0}]);
 const confirmSpy=jest.spyOn(window,'confirm').mockReturnValue(false);
 try {
   const {result}=renderHook(()=>useCourseSchedule({term:'Fall',year:'2026',days:'MWF',data:undefined}));
   await act(async()=>{await result.current.importScheduleFromExcel(new File(['x'],'schedule.xlsx'));});
   expect(result.current.scheduleRows[0].unit).toBe('');
 } finally {confirmSpy.mockRestore();}
});
