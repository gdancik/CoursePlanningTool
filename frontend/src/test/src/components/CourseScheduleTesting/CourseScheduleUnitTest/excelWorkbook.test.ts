import * as XLSX from 'xlsx-js-style';
import {validateScheduleCols,exportRowsToExcel,importExcelFile} from '../../../../../components/CourseScheduleComponent/XLSX/exportImportExcel';
import {downloadScheduleTemplate} from '../../../../../components/CourseScheduleComponent/XLSX/excelTemplate';
import {sizeOfWorksheet} from '../../../../../components/CourseScheduleComponent/XLSX/excelFormat';
import {Course_Schedule_Excel_Cols,Course_Schedule_Sheet_Identifier} from '../../../../../components/CourseScheduleComponent/XLSX/constants';
import {row} from '../CourseScheduleUnitTest/testRows';

// File.arrayBuffer is not implemented in every jsdom version: provide it explicitly.
const workbookFile=(rows:Record<string,unknown>[]):File=>{
 const sheet=XLSX.utils.json_to_sheet(rows,{header:[...Course_Schedule_Excel_Cols]});
 const workbook=XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(workbook,sheet,Course_Schedule_Sheet_Identifier);
 const data=XLSX.write(workbook,{type:'array',bookType:'xlsx'});
 const file=new File([data],'schedule.xlsx',{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
 Object.defineProperty(file,'arrayBuffer',{value:async()=>data});
 return file;
};
test('validateScheduleCols accepts complete columns',()=>{
 expect(()=>validateScheduleCols([...Course_Schedule_Excel_Cols])).not.toThrow();
});
test('validateScheduleCols lists missing columns',()=>{
 expect(()=>validateScheduleCols(['Date'])).toThrow(/Missing columns: Day/);
});
test('sizeOfWorksheet sets five column widths and text-formatted date column',()=>{
 const sheet=XLSX.utils.json_to_sheet([{Date:'02/03/2026'}]);
 sizeOfWorksheet(sheet,1);
 expect(sheet['!cols']).toHaveLength(5);
 expect(sheet['!ref']).toBeDefined();
 expect(sheet['A2'].t).toBe('s');
 expect(sheet['A2'].z).toBe('@');
});
test('exportRowsToExcel creates workbook with expected sheet and headers',()=>{
 const spy=jest.spyOn(XLSX,'writeFile').mockImplementation(()=>undefined);
 try {
   exportRowsToExcel([row('x','02/03/2026',{day:'T',unit:'Topic'})],'test.xlsx');
   expect(spy).toHaveBeenCalledWith(expect.objectContaining({SheetNames:[Course_Schedule_Sheet_Identifier]}),'test.xlsx');
 } finally {spy.mockRestore();}
});
test('downloadScheduleTemplate writes template workbook',()=>{
 const spy=jest.spyOn(XLSX,'writeFile').mockImplementation(()=>undefined);
 try {
   downloadScheduleTemplate([row('x','02/03/2026')],'template.xlsx');
   expect(spy).toHaveBeenCalledWith(expect.any(Object),'template.xlsx');
 } finally {spy.mockRestore();}
});
test('importExcelFile reads and maps a real workbook',async()=>{
 const file=workbookFile([{Date:'02/03/2026',Day:'Tuesday','Unit and Theme/Topic':'Intro',
 'Learning Outcomes Addressed':'LO1','Reading/Assignments Due':'Chapter 1'}]);
 const result=await importExcelFile(file,2026);
 expect(result).toHaveLength(1);
 expect(result[0]).toMatchObject({date:'02/03/2026',day:'Tuesday',unit:'Intro',learningOutcomes:'LO1',readingAssignments:'Chapter 1'});
});
test('importExcelFile rejects a workbook with missing columns',async()=>{
 const sheet=XLSX.utils.json_to_sheet([{Date:'02/03/2026',Day:'Tuesday'}]);
 const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,sheet,'Sheet1');
 const data=XLSX.write(wb,{type:'array',bookType:'xlsx'});
 const file=new File([data],'bad.xlsx');
 Object.defineProperty(file,'arrayBuffer',{value:async()=>data});
 await expect(importExcelFile(file,2026)).rejects.toThrow(/Missing columns/);
});
