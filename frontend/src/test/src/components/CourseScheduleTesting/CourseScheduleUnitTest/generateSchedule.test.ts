import {generateScheduleRows} from '../../../../../components/CourseScheduleComponent/CourseSchedule/generateSchedule';
type Mutation=Parameters<typeof generateScheduleRows>[0]['mutation'];
const mutation=(impl:jest.Mock):Mutation=>({mutateAsync:impl} as unknown as Mutation);
const base={term:'Fall',year:'2026',days:'MWF',dateParsingYear:2026,missingScheduleInformation:false};
test('rejects incomplete input without calling the server',async()=>{
 const call=jest.fn();
 const result=await generateScheduleRows({...base,missingScheduleInformation:true,mutation:mutation(call)});
 expect(result).toEqual({ok:false,error:expect.stringContaining('valid term')});
 expect(call).not.toHaveBeenCalled();
});
test('maps successful response and forwards request',async()=>{
 const call=jest.fn().mockResolvedValue({schedule:[{Date:'02/03/2026',Day:'Tuesday',Description:'Unit 1'}]});
 const result=await generateScheduleRows({...base,mutation:mutation(call)});
 expect(call).toHaveBeenCalledWith({term:'Fall',year:'2026',days:'MWF'});
 expect(result.ok).toBe(true);
 if(result.ok) expect(result.generatedRows[0]).toMatchObject({date:'02/03/2026',day:'Tuesday',unit:'Unit 1'});
});
test('reports API error response',async()=>{
 const call=jest.fn().mockResolvedValue({error:'unavailable'});
 const result=await generateScheduleRows({...base,mutation:mutation(call)});
 expect(result).toEqual({ok:false,error:expect.stringContaining('unavailable')});
});
test('rejects malformed schedule response',async()=>{
 const call=jest.fn().mockResolvedValue({schedule:'not-array'});
 const result=await generateScheduleRows({...base,mutation:mutation(call)});
 expect(result).toEqual({ok:false,error:expect.stringContaining('invalid response')});
});
test('extracts error body from rejected HTTP response',async()=>{
 const error={response:{json:async()=>({error:'Server message'})}};
 const call=jest.fn().mockRejectedValue(error);
 const spy=jest.spyOn(console,'error').mockImplementation(()=>undefined);
 try {
   const result=await generateScheduleRows({...base,mutation:mutation(call)});
   expect(result).toEqual({ok:false,error:expect.stringContaining('Server message')});
 } finally {spy.mockRestore();}
});
test('uses generic message when rejected error has no response',async()=>{
 const call=jest.fn().mockRejectedValue(new Error('network'));
 const spy=jest.spyOn(console,'error').mockImplementation(()=>undefined);
 try {
   const result=await generateScheduleRows({...base,mutation:mutation(call)});
   expect(result).toEqual({ok:false,error:expect.stringContaining('Please check your term')});
 } finally {spy.mockRestore();}
});
