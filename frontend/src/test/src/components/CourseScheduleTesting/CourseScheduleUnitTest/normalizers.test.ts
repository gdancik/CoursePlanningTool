
import {
  coerceToTrimmedString,
  normalizeTerm,
  normalizeYearString,
  normalizeCourseYear,
  normalizeDays,
  normalizeDaysToCodes,
  formatDayCodes,
  formatDayValue,
} from '../../../../../components/CourseScheduleComponent/utilities/normalizers';

import {
  runTableTests,
  runMultiArgTableTests,
} from '../../../../helpers/courseScheduleTestDriver';

import type {
  DayCode,
  DayDisplayOption,
} from '../../../../../components/CourseScheduleComponent/types/courseScheduleTypes';

/**
 * STRING NORMALIZATION
 */

runTableTests('coerceToTrimmedString', coerceToTrimmedString, [
  {
    name: 'null',
    input: null,
    expected: '',
  },
  {
    name: 'undefined',
    input: undefined,
    expected: '',
  },
  {
    name: 'trims whitespace',
    input: '  hi  ',
    expected: 'hi',
  },
  {
    name: 'numbers',
    input: 2026,
    expected: '2026',
  },
  {
    name: 'arrays concatenate',
    input: [' M ', 'W'],
    expected: 'M W',
  },
  {
    name: 'empty string',
    input: '',
    expected: '',
  },
  {
    name: 'whitespace only',
    input: '   ',
    expected: '',
  },
]);

/**
 * TERM NORMALIZATION
 */

runTableTests('normalizeTerm', normalizeTerm, [
  {
    name: 'canonical fall',
    input: ' fALL ',
    expected: 'Fall',
  },
  {
    name: 'canonical spring',
    input: 'SPRING',
    expected: 'Spring',
  },
  {
    name: 'unknown term retained',
    input: 'Special',
    expected: 'Special',
  },
  {
    name: 'empty',
    input: null,
    expected: '',
  },
]);

/**
 * YEAR NORMALIZATION
 */

runTableTests('normalizeYearString', normalizeYearString, [
  {
    name: 'extract year',
    input: 'Fall 2026',
    expected: '2026',
  },
  {
    name: 'year number',
    input: 2027,
    expected: '2027',
  },
  {
    name: 'missing year',
    input: 'Fall',
    expected: '',
  },
]);

runTableTests('normalizeCourseYear', normalizeCourseYear, [
  {
    name: 'valid year',
    input: '2026',
    expected: 2026,
  },
  {
    name: 'lower boundary',
    input: '1900',
    expected: 1900,
  },
  {
    name: 'upper boundary',
    input: '2200',
    expected: 2200,
  },
  {
    name: 'too early',
    input: '1800',
    expected: null,
  },
  {
    name: 'too late',
    input: '2300',
    expected: null,
  },
  {
    name: 'missing',
    input: '',
    expected: null,
  },
]);

/**
 * DAY NORMALIZATION
 */

runTableTests('normalizeDays', normalizeDays, [
  {
    name: 'compact MWF',
    input: 'MWF',
    expected: 'MWF',
  },
  {
    name: 'out of order deduplicated',
    input: ['Friday', 'Monday', 'Friday'],
    expected: 'MF',
  },
  {
    name: 'aliases',
    input: 'Mon, Wed, Fri',
    expected: 'MWF',
  },
  {
    name: 'thursday alias',
    input: 'Th',
    expected: 'R',
  },
  {
    name: 'JSON list',
    input: '["Mon","Wed"]',
    expected: 'MW',
  },
  {
    name: 'empty',
    input: null,
    expected: '',
  },
]);

runTableTests('normalizeDaysToCodes', normalizeDaysToCodes, [
  {
    name: 'compact',
    input: 'TR',
    expected: ['T', 'R'],
  },
  {
    name: 'aliases',
    input: ['thursday', 'monday', 'tuesday'],
    expected: ['M', 'T', 'R'],
  },
  {
    name: 'duplicates',
    input: ['M', 'M', 'F'],
    expected: ['M', 'F'],
  },
  {
    name: 'unknown',
    input: 'xyz',
    expected: [],
  },
]);

/**
 * DAY DISPLAY FORMATTING
 */

const codes = (
  items: DayCode[],
  option: DayDisplayOption
) => formatDayCodes(items, option);

runMultiArgTableTests('formatDayCodes', codes, [
  {
    name: 'single-letter R',
    args: [
      ['M', 'R'],
      { format: 'codes', thursdayOption: 'R' },
    ],
    expected: 'MR',
  },
  {
    name: 'Thursday displayed as Th',
    args: [
      ['T', 'R'],
      { format: 'codes', thursdayOption: 'Th' },
    ],
    expected: 'TTh',
  },
  {
    name: 'short names',
    args: [
      ['M', 'R'],
      { format: 'shortNames', thursdayOption: 'R' },
    ],
    expected: 'Mon, Thu',
  },
  {
    name: 'long names',
    args: [
      ['M', 'R'],
      { format: 'longNames', thursdayOption: 'R' },
    ],
    expected: 'Monday, Thursday',
  },
  {
    name: 'empty codes',
    args: [
      [],
      { format: 'codes', thursdayOption: 'R' },
    ],
    expected: '',
  },
  {
    name: 'all weekdays as codes',
    args: [
      ['M', 'T', 'W', 'R', 'F'],
      { format: 'codes', thursdayOption: 'R' },
    ],
    expected: 'MTWRF',
  },
  {
    name: 'all weekdays with Th',
    args: [
      ['M', 'T', 'W', 'R', 'F'],
      { format: 'codes', thursdayOption: 'Th' },
    ],
    expected: 'MTWThF',
  },
]);

/**
 * FORMAT DAY VALUE
 *
 * Tests all combinations of:
 * - codes
 * - shortNames
 * - longNames
 *
 * Thursday can be displayed as R or Th.
 */

runMultiArgTableTests('formatDayValue', formatDayValue, [
  {
    name: 'codes with R',
    args: [
      'Monday, Thursday',
      { format: 'codes', thursdayOption: 'R' },
    ],
    expected: 'MR',
  },
  {
    name: 'codes with Th',
    args: [
      'Monday, Thursday',
      { format: 'codes', thursdayOption: 'Th' },
    ],
    expected: 'MTh',
  },
  {
    name: 'short names with R',
    args: [
      'Monday, Thursday',
      { format: 'shortNames', thursdayOption: 'R' },
    ],
    expected: 'Mon, Thu',
  },
  {
    name: 'short names with Th',
    args: [
      'Monday, Thursday',
      { format: 'shortNames', thursdayOption: 'Th' },
    ],
    expected: 'Mon, Thu',
  },
  {
    name: 'long names with R',
    args: [
      'Monday, Thursday',
      { format: 'longNames', thursdayOption: 'R' },
    ],
    expected: 'Monday, Thursday',
  },
  {
    name: 'long names with Th',
    args: [
      'Monday, Thursday',
      { format: 'longNames', thursdayOption: 'Th' },
    ],
    expected: 'Monday, Thursday',
  },
  {
    name: 'preserve unrecognized',
    args: [
      ' Custom ',
      { format: 'codes', thursdayOption: 'R' },
    ],
    expected: 'Custom',
  },
  {
    name: 'empty input',
    args: [
      '',
      { format: 'codes', thursdayOption: 'R' },
    ],
    expected: '',
  },
]);
