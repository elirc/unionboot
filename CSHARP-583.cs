// UNIONBOOT C# — 583 exercises (53 topic families × 11 scenario variants)
// Standalone .NET10 file-based app, no NuGet dependencies.
// dotnet run --file CSHARP-583.cs -- --verify
// dotnet run --file CSHARP-583.cs -- --list
// dotnet run --file CSHARP-583.cs -- --show 1
// dotnet run --file CSHARP-583.cs -- --verify 1
// dotnet run --file CSHARP-583.cs -- --practice 1
// Edit E001.Practice etc. References live in the same class as Solve.
// Variants revisit C# topics with different policies/limits, not583 unrelated topics.
// --verify grades references; --practice runs SAME checks on your blank method.
// Tests validate documented examples and edges, not every possible input.
#:property TargetFramework=net10.0
#:property Nullable=enable
#:property ImplicitUsings=enable
#:property LangVersion=14
#:property PublishAot=false
#:property JsonSerializerIsReflectionEnabledByDefault=true
using System;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Globalization;
using System.Numerics;
using System.Buffers.Binary;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Threading.Channels;
using System.Runtime.CompilerServices;

CultureInfo.CurrentCulture=CultureInfo.InvariantCulture;
CultureInfo.CurrentUICulture=CultureInfo.InvariantCulture;
var exercises=new Exercise[] {
    new(1, "Checked integer accumulation / scenario 1", "Sum only values >= 1. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.", "Accumulate into long before adding; a LINQ int Sum can overflow.", E001.Verify),
    new(2, "Checked integer accumulation / scenario 2", "Sum only values >= 2. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.", "Accumulate into long before adding; a LINQ int Sum can overflow.", E002.Verify),
    new(3, "Checked integer accumulation / scenario 3", "Sum only values >= 3. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.", "Accumulate into long before adding; a LINQ int Sum can overflow.", E003.Verify),
    new(4, "Checked integer accumulation / scenario 4", "Sum only values >= 4. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.", "Accumulate into long before adding; a LINQ int Sum can overflow.", E004.Verify),
    new(5, "Checked integer accumulation / scenario 5", "Sum only values >= 5. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.", "Accumulate into long before adding; a LINQ int Sum can overflow.", E005.Verify),
    new(6, "Checked integer accumulation / scenario 6", "Sum only values >= 6. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.", "Accumulate into long before adding; a LINQ int Sum can overflow.", E006.Verify),
    new(7, "Checked integer accumulation / scenario 7", "Sum only values >= 7. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.", "Accumulate into long before adding; a LINQ int Sum can overflow.", E007.Verify),
    new(8, "Checked integer accumulation / scenario 8", "Sum only values >= 8. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.", "Accumulate into long before adding; a LINQ int Sum can overflow.", E008.Verify),
    new(9, "Checked integer accumulation / scenario 9", "Sum only values >= 9. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.", "Accumulate into long before adding; a LINQ int Sum can overflow.", E009.Verify),
    new(10, "Checked integer accumulation / scenario 10", "Sum only values >= 10. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.", "Accumulate into long before adding; a LINQ int Sum can overflow.", E010.Verify),
    new(11, "Checked integer accumulation / scenario 11", "Sum only values >= 11. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.", "Accumulate into long before adding; a LINQ int Sum can overflow.", E011.Verify),
    new(12, "Stable LINQ filtering and projection / scenario 1", "Select integers divisible by 2, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.", "Filtering is lazy until ToArray materializes it.", E012.Verify),
    new(13, "Stable LINQ filtering and projection / scenario 2", "Select integers divisible by 3, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.", "Filtering is lazy until ToArray materializes it.", E013.Verify),
    new(14, "Stable LINQ filtering and projection / scenario 3", "Select integers divisible by 4, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.", "Filtering is lazy until ToArray materializes it.", E014.Verify),
    new(15, "Stable LINQ filtering and projection / scenario 4", "Select integers divisible by 5, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.", "Filtering is lazy until ToArray materializes it.", E015.Verify),
    new(16, "Stable LINQ filtering and projection / scenario 5", "Select integers divisible by 6, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.", "Filtering is lazy until ToArray materializes it.", E016.Verify),
    new(17, "Stable LINQ filtering and projection / scenario 6", "Select integers divisible by 7, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.", "Filtering is lazy until ToArray materializes it.", E017.Verify),
    new(18, "Stable LINQ filtering and projection / scenario 7", "Select integers divisible by 8, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.", "Filtering is lazy until ToArray materializes it.", E018.Verify),
    new(19, "Stable LINQ filtering and projection / scenario 8", "Select integers divisible by 9, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.", "Filtering is lazy until ToArray materializes it.", E019.Verify),
    new(20, "Stable LINQ filtering and projection / scenario 9", "Select integers divisible by 10, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.", "Filtering is lazy until ToArray materializes it.", E020.Verify),
    new(21, "Stable LINQ filtering and projection / scenario 10", "Select integers divisible by 11, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.", "Filtering is lazy until ToArray materializes it.", E021.Verify),
    new(22, "Stable LINQ filtering and projection / scenario 11", "Select integers divisible by 12, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.", "Filtering is lazy until ToArray materializes it.", E022.Verify),
    new(23, "Dictionary frequency counting / scenario 1", "Count words with ordinal case-sensitive comparison. Retain counts >=1; sort output keys ordinally. Empty input returns an empty dictionary.", "Dictionary comparison and output normalization are separate choices.", E023.Verify),
    new(24, "Dictionary frequency counting / scenario 2", "Count words with ordinal case-insensitive comparison and lowercase output keys. Retain counts >=2; sort output keys ordinally. Empty input returns an empty dictionary.", "Dictionary comparison and output normalization are separate choices.", E024.Verify),
    new(25, "Dictionary frequency counting / scenario 3", "Count words with ordinal case-sensitive comparison. Retain counts >=3; sort output keys ordinally. Empty input returns an empty dictionary.", "Dictionary comparison and output normalization are separate choices.", E025.Verify),
    new(26, "Dictionary frequency counting / scenario 4", "Count words with ordinal case-insensitive comparison and lowercase output keys. Retain counts >=4; sort output keys ordinally. Empty input returns an empty dictionary.", "Dictionary comparison and output normalization are separate choices.", E026.Verify),
    new(27, "Dictionary frequency counting / scenario 5", "Count words with ordinal case-sensitive comparison. Retain counts >=5; sort output keys ordinally. Empty input returns an empty dictionary.", "Dictionary comparison and output normalization are separate choices.", E027.Verify),
    new(28, "Dictionary frequency counting / scenario 6", "Count words with ordinal case-insensitive comparison and lowercase output keys. Retain counts >=6; sort output keys ordinally. Empty input returns an empty dictionary.", "Dictionary comparison and output normalization are separate choices.", E028.Verify),
    new(29, "Dictionary frequency counting / scenario 7", "Count words with ordinal case-sensitive comparison. Retain counts >=7; sort output keys ordinally. Empty input returns an empty dictionary.", "Dictionary comparison and output normalization are separate choices.", E029.Verify),
    new(30, "Dictionary frequency counting / scenario 8", "Count words with ordinal case-insensitive comparison and lowercase output keys. Retain counts >=8; sort output keys ordinally. Empty input returns an empty dictionary.", "Dictionary comparison and output normalization are separate choices.", E030.Verify),
    new(31, "Dictionary frequency counting / scenario 9", "Count words with ordinal case-sensitive comparison. Retain counts >=9; sort output keys ordinally. Empty input returns an empty dictionary.", "Dictionary comparison and output normalization are separate choices.", E031.Verify),
    new(32, "Dictionary frequency counting / scenario 10", "Count words with ordinal case-insensitive comparison and lowercase output keys. Retain counts >=10; sort output keys ordinally. Empty input returns an empty dictionary.", "Dictionary comparison and output normalization are separate choices.", E032.Verify),
    new(33, "Dictionary frequency counting / scenario 11", "Count words with ordinal case-sensitive comparison. Retain counts >=11; sort output keys ordinally. Empty input returns an empty dictionary.", "Dictionary comparison and output normalization are separate choices.", E033.Verify),
    new(34, "Numeric sorting with tie rules / scenario 1", "Return at most 1 values sorted ascending. Retain duplicates; never sort the caller's array in place.", "OrderBy returns a new sequence; List.Sort would mutate a list.", E034.Verify),
    new(35, "Numeric sorting with tie rules / scenario 2", "Return at most 2 values sorted descending. Retain duplicates; never sort the caller's array in place.", "OrderBy returns a new sequence; List.Sort would mutate a list.", E035.Verify),
    new(36, "Numeric sorting with tie rules / scenario 3", "Return at most 3 values sorted ascending. Retain duplicates; never sort the caller's array in place.", "OrderBy returns a new sequence; List.Sort would mutate a list.", E036.Verify),
    new(37, "Numeric sorting with tie rules / scenario 4", "Return at most 4 values sorted descending. Retain duplicates; never sort the caller's array in place.", "OrderBy returns a new sequence; List.Sort would mutate a list.", E037.Verify),
    new(38, "Numeric sorting with tie rules / scenario 5", "Return at most 5 values sorted ascending. Retain duplicates; never sort the caller's array in place.", "OrderBy returns a new sequence; List.Sort would mutate a list.", E038.Verify),
    new(39, "Numeric sorting with tie rules / scenario 6", "Return at most 6 values sorted descending. Retain duplicates; never sort the caller's array in place.", "OrderBy returns a new sequence; List.Sort would mutate a list.", E039.Verify),
    new(40, "Numeric sorting with tie rules / scenario 7", "Return at most 7 values sorted ascending. Retain duplicates; never sort the caller's array in place.", "OrderBy returns a new sequence; List.Sort would mutate a list.", E040.Verify),
    new(41, "Numeric sorting with tie rules / scenario 8", "Return at most 8 values sorted descending. Retain duplicates; never sort the caller's array in place.", "OrderBy returns a new sequence; List.Sort would mutate a list.", E041.Verify),
    new(42, "Numeric sorting with tie rules / scenario 9", "Return at most 9 values sorted ascending. Retain duplicates; never sort the caller's array in place.", "OrderBy returns a new sequence; List.Sort would mutate a list.", E042.Verify),
    new(43, "Numeric sorting with tie rules / scenario 10", "Return at most 10 values sorted descending. Retain duplicates; never sort the caller's array in place.", "OrderBy returns a new sequence; List.Sort would mutate a list.", E043.Verify),
    new(44, "Numeric sorting with tie rules / scenario 11", "Return at most 11 values sorted ascending. Retain duplicates; never sort the caller's array in place.", "OrderBy returns a new sequence; List.Sort would mutate a list.", E044.Verify),
    new(45, "Sliding window sums / scenario 1", "Return sums for all contiguous windows of width1. Fewer than width values yields[]. O(n) time; long sums.", "Add the entering element and subtract the departing one.", E045.Verify),
    new(46, "Sliding window sums / scenario 2", "Return sums for all contiguous windows of width2. Fewer than width values yields[]. O(n) time; long sums.", "Add the entering element and subtract the departing one.", E046.Verify),
    new(47, "Sliding window sums / scenario 3", "Return sums for all contiguous windows of width3. Fewer than width values yields[]. O(n) time; long sums.", "Add the entering element and subtract the departing one.", E047.Verify),
    new(48, "Sliding window sums / scenario 4", "Return sums for all contiguous windows of width4. Fewer than width values yields[]. O(n) time; long sums.", "Add the entering element and subtract the departing one.", E048.Verify),
    new(49, "Sliding window sums / scenario 5", "Return sums for all contiguous windows of width5. Fewer than width values yields[]. O(n) time; long sums.", "Add the entering element and subtract the departing one.", E049.Verify),
    new(50, "Sliding window sums / scenario 6", "Return sums for all contiguous windows of width6. Fewer than width values yields[]. O(n) time; long sums.", "Add the entering element and subtract the departing one.", E050.Verify),
    new(51, "Sliding window sums / scenario 7", "Return sums for all contiguous windows of width7. Fewer than width values yields[]. O(n) time; long sums.", "Add the entering element and subtract the departing one.", E051.Verify),
    new(52, "Sliding window sums / scenario 8", "Return sums for all contiguous windows of width8. Fewer than width values yields[]. O(n) time; long sums.", "Add the entering element and subtract the departing one.", E052.Verify),
    new(53, "Sliding window sums / scenario 9", "Return sums for all contiguous windows of width9. Fewer than width values yields[]. O(n) time; long sums.", "Add the entering element and subtract the departing one.", E053.Verify),
    new(54, "Sliding window sums / scenario 10", "Return sums for all contiguous windows of width10. Fewer than width values yields[]. O(n) time; long sums.", "Add the entering element and subtract the departing one.", E054.Verify),
    new(55, "Sliding window sums / scenario 11", "Return sums for all contiguous windows of width11. Fewer than width values yields[]. O(n) time; long sums.", "Add the entering element and subtract the departing one.", E055.Verify),
    new(56, "Validated pagination records / scenario 1", "Page size1. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).", "Validate, compute total pages, clamp, then slice.", E056.Verify),
    new(57, "Validated pagination records / scenario 2", "Page size2. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).", "Validate, compute total pages, clamp, then slice.", E057.Verify),
    new(58, "Validated pagination records / scenario 3", "Page size3. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).", "Validate, compute total pages, clamp, then slice.", E058.Verify),
    new(59, "Validated pagination records / scenario 4", "Page size4. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).", "Validate, compute total pages, clamp, then slice.", E059.Verify),
    new(60, "Validated pagination records / scenario 5", "Page size5. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).", "Validate, compute total pages, clamp, then slice.", E060.Verify),
    new(61, "Validated pagination records / scenario 6", "Page size6. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).", "Validate, compute total pages, clamp, then slice.", E061.Verify),
    new(62, "Validated pagination records / scenario 7", "Page size7. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).", "Validate, compute total pages, clamp, then slice.", E062.Verify),
    new(63, "Validated pagination records / scenario 8", "Page size8. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).", "Validate, compute total pages, clamp, then slice.", E063.Verify),
    new(64, "Validated pagination records / scenario 9", "Page size9. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).", "Validate, compute total pages, clamp, then slice.", E064.Verify),
    new(65, "Validated pagination records / scenario 10", "Page size10. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).", "Validate, compute total pages, clamp, then slice.", E065.Verify),
    new(66, "Validated pagination records / scenario 11", "Page size11. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).", "Validate, compute total pages, clamp, then slice.", E066.Verify),
    new(67, "Ordinal text normalization / scenario 1", "Apply upper normalization, then limit to3 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.", "Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.", E067.Verify),
    new(68, "Ordinal text normalization / scenario 2", "Apply lower normalization, then limit to4 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.", "Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.", E068.Verify),
    new(69, "Ordinal text normalization / scenario 3", "Apply trim normalization, then limit to5 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.", "Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.", E069.Verify),
    new(70, "Ordinal text normalization / scenario 4", "Apply collapse normalization, then limit to6 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.", "Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.", E070.Verify),
    new(71, "Ordinal text normalization / scenario 5", "Apply upper normalization, then limit to7 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.", "Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.", E071.Verify),
    new(72, "Ordinal text normalization / scenario 6", "Apply lower normalization, then limit to8 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.", "Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.", E072.Verify),
    new(73, "Ordinal text normalization / scenario 7", "Apply trim normalization, then limit to9 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.", "Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.", E073.Verify),
    new(74, "Ordinal text normalization / scenario 8", "Apply collapse normalization, then limit to10 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.", "Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.", E074.Verify),
    new(75, "Ordinal text normalization / scenario 9", "Apply upper normalization, then limit to11 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.", "Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.", E075.Verify),
    new(76, "Ordinal text normalization / scenario 10", "Apply lower normalization, then limit to12 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.", "Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.", E076.Verify),
    new(77, "Ordinal text normalization / scenario 11", "Apply trim normalization, then limit to13 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.", "Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.", E077.Verify),
    new(78, "Safe integer parsing with TryParse / scenario 1", "Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below-5. Preserve order.", "TryParse communicates failure without exceptions.", E078.Verify),
    new(79, "Safe integer parsing with TryParse / scenario 2", "Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below-4. Preserve order.", "TryParse communicates failure without exceptions.", E079.Verify),
    new(80, "Safe integer parsing with TryParse / scenario 3", "Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below-3. Preserve order.", "TryParse communicates failure without exceptions.", E080.Verify),
    new(81, "Safe integer parsing with TryParse / scenario 4", "Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below-2. Preserve order.", "TryParse communicates failure without exceptions.", E081.Verify),
    new(82, "Safe integer parsing with TryParse / scenario 5", "Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below-1. Preserve order.", "TryParse communicates failure without exceptions.", E082.Verify),
    new(83, "Safe integer parsing with TryParse / scenario 6", "Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below0. Preserve order.", "TryParse communicates failure without exceptions.", E083.Verify),
    new(84, "Safe integer parsing with TryParse / scenario 7", "Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below1. Preserve order.", "TryParse communicates failure without exceptions.", E084.Verify),
    new(85, "Safe integer parsing with TryParse / scenario 8", "Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below2. Preserve order.", "TryParse communicates failure without exceptions.", E085.Verify),
    new(86, "Safe integer parsing with TryParse / scenario 9", "Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below3. Preserve order.", "TryParse communicates failure without exceptions.", E086.Verify),
    new(87, "Safe integer parsing with TryParse / scenario 10", "Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below4. Preserve order.", "TryParse communicates failure without exceptions.", E087.Verify),
    new(88, "Safe integer parsing with TryParse / scenario 11", "Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below5. Preserve order.", "TryParse communicates failure without exceptions.", E088.Verify),
    new(89, "Decimal pricing and midpoint rounding / scenario 1", "Apply1% tax to a nonnegative decimal subtotal, then round to0 places using ToEven. Reject negative subtotal. No binary floating-point conversion.", "Use decimal literals with the m suffix throughout.", E089.Verify),
    new(90, "Decimal pricing and midpoint rounding / scenario 2", "Apply2% tax to a nonnegative decimal subtotal, then round to1 places using AwayFromZero. Reject negative subtotal. No binary floating-point conversion.", "Use decimal literals with the m suffix throughout.", E090.Verify),
    new(91, "Decimal pricing and midpoint rounding / scenario 3", "Apply3% tax to a nonnegative decimal subtotal, then round to2 places using ToEven. Reject negative subtotal. No binary floating-point conversion.", "Use decimal literals with the m suffix throughout.", E091.Verify),
    new(92, "Decimal pricing and midpoint rounding / scenario 4", "Apply4% tax to a nonnegative decimal subtotal, then round to0 places using AwayFromZero. Reject negative subtotal. No binary floating-point conversion.", "Use decimal literals with the m suffix throughout.", E092.Verify),
    new(93, "Decimal pricing and midpoint rounding / scenario 5", "Apply5% tax to a nonnegative decimal subtotal, then round to1 places using ToEven. Reject negative subtotal. No binary floating-point conversion.", "Use decimal literals with the m suffix throughout.", E093.Verify),
    new(94, "Decimal pricing and midpoint rounding / scenario 6", "Apply6% tax to a nonnegative decimal subtotal, then round to2 places using AwayFromZero. Reject negative subtotal. No binary floating-point conversion.", "Use decimal literals with the m suffix throughout.", E094.Verify),
    new(95, "Decimal pricing and midpoint rounding / scenario 7", "Apply7% tax to a nonnegative decimal subtotal, then round to0 places using ToEven. Reject negative subtotal. No binary floating-point conversion.", "Use decimal literals with the m suffix throughout.", E095.Verify),
    new(96, "Decimal pricing and midpoint rounding / scenario 8", "Apply8% tax to a nonnegative decimal subtotal, then round to1 places using AwayFromZero. Reject negative subtotal. No binary floating-point conversion.", "Use decimal literals with the m suffix throughout.", E096.Verify),
    new(97, "Decimal pricing and midpoint rounding / scenario 9", "Apply9% tax to a nonnegative decimal subtotal, then round to2 places using ToEven. Reject negative subtotal. No binary floating-point conversion.", "Use decimal literals with the m suffix throughout.", E097.Verify),
    new(98, "Decimal pricing and midpoint rounding / scenario 10", "Apply10% tax to a nonnegative decimal subtotal, then round to0 places using AwayFromZero. Reject negative subtotal. No binary floating-point conversion.", "Use decimal literals with the m suffix throughout.", E098.Verify),
    new(99, "Decimal pricing and midpoint rounding / scenario 11", "Apply11% tax to a nonnegative decimal subtotal, then round to1 places using ToEven. Reject negative subtotal. No binary floating-point conversion.", "Use decimal literals with the m suffix throughout.", E099.Verify),
    new(100, "Flags enum permissions / scenario 1", "Return true iff granted includes every bit of mask1. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.", "Checking any bit is not the same as checking every required bit.", E100.Verify),
    new(101, "Flags enum permissions / scenario 2", "Return true iff granted includes every bit of mask2. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.", "Checking any bit is not the same as checking every required bit.", E101.Verify),
    new(102, "Flags enum permissions / scenario 3", "Return true iff granted includes every bit of mask3. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.", "Checking any bit is not the same as checking every required bit.", E102.Verify),
    new(103, "Flags enum permissions / scenario 4", "Return true iff granted includes every bit of mask4. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.", "Checking any bit is not the same as checking every required bit.", E103.Verify),
    new(104, "Flags enum permissions / scenario 5", "Return true iff granted includes every bit of mask5. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.", "Checking any bit is not the same as checking every required bit.", E104.Verify),
    new(105, "Flags enum permissions / scenario 6", "Return true iff granted includes every bit of mask6. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.", "Checking any bit is not the same as checking every required bit.", E105.Verify),
    new(106, "Flags enum permissions / scenario 7", "Return true iff granted includes every bit of mask7. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.", "Checking any bit is not the same as checking every required bit.", E106.Verify),
    new(107, "Flags enum permissions / scenario 8", "Return true iff granted includes every bit of mask1. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.", "Checking any bit is not the same as checking every required bit.", E107.Verify),
    new(108, "Flags enum permissions / scenario 9", "Return true iff granted includes every bit of mask2. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.", "Checking any bit is not the same as checking every required bit.", E108.Verify),
    new(109, "Flags enum permissions / scenario 10", "Return true iff granted includes every bit of mask3. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.", "Checking any bit is not the same as checking every required bit.", E109.Verify),
    new(110, "Flags enum permissions / scenario 11", "Return true iff granted includes every bit of mask4. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.", "Checking any bit is not the same as checking every required bit.", E110.Verify),
    new(111, "Pattern matching result types / scenario 1", "Match Success(int Value) and Failure(string Message). Success formats ok:(Value+1); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.", "Record inheritance supplies data variants; a switch expression handles each case.", E111.Verify),
    new(112, "Pattern matching result types / scenario 2", "Match Success(int Value) and Failure(string Message). Success formats ok:(Value+2); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.", "Record inheritance supplies data variants; a switch expression handles each case.", E112.Verify),
    new(113, "Pattern matching result types / scenario 3", "Match Success(int Value) and Failure(string Message). Success formats ok:(Value+3); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.", "Record inheritance supplies data variants; a switch expression handles each case.", E113.Verify),
    new(114, "Pattern matching result types / scenario 4", "Match Success(int Value) and Failure(string Message). Success formats ok:(Value+4); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.", "Record inheritance supplies data variants; a switch expression handles each case.", E114.Verify),
    new(115, "Pattern matching result types / scenario 5", "Match Success(int Value) and Failure(string Message). Success formats ok:(Value+5); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.", "Record inheritance supplies data variants; a switch expression handles each case.", E115.Verify),
    new(116, "Pattern matching result types / scenario 6", "Match Success(int Value) and Failure(string Message). Success formats ok:(Value+6); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.", "Record inheritance supplies data variants; a switch expression handles each case.", E116.Verify),
    new(117, "Pattern matching result types / scenario 7", "Match Success(int Value) and Failure(string Message). Success formats ok:(Value+7); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.", "Record inheritance supplies data variants; a switch expression handles each case.", E117.Verify),
    new(118, "Pattern matching result types / scenario 8", "Match Success(int Value) and Failure(string Message). Success formats ok:(Value+8); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.", "Record inheritance supplies data variants; a switch expression handles each case.", E118.Verify),
    new(119, "Pattern matching result types / scenario 9", "Match Success(int Value) and Failure(string Message). Success formats ok:(Value+9); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.", "Record inheritance supplies data variants; a switch expression handles each case.", E119.Verify),
    new(120, "Pattern matching result types / scenario 10", "Match Success(int Value) and Failure(string Message). Success formats ok:(Value+10); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.", "Record inheritance supplies data variants; a switch expression handles each case.", E120.Verify),
    new(121, "Pattern matching result types / scenario 11", "Match Success(int Value) and Failure(string Message). Success formats ok:(Value+11); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.", "Record inheritance supplies data variants; a switch expression handles each case.", E121.Verify),
    new(122, "Immutable record updates / scenario 1", "Return a new Account with Balance increased by1, Name unchanged. Preserve original. Throw OverflowException on int overflow.", "The with expression copies a record without mutating its source.", E122.Verify),
    new(123, "Immutable record updates / scenario 2", "Return a new Account with Balance increased by2, Name unchanged. Preserve original. Throw OverflowException on int overflow.", "The with expression copies a record without mutating its source.", E123.Verify),
    new(124, "Immutable record updates / scenario 3", "Return a new Account with Balance increased by3, Name unchanged. Preserve original. Throw OverflowException on int overflow.", "The with expression copies a record without mutating its source.", E124.Verify),
    new(125, "Immutable record updates / scenario 4", "Return a new Account with Balance increased by4, Name unchanged. Preserve original. Throw OverflowException on int overflow.", "The with expression copies a record without mutating its source.", E125.Verify),
    new(126, "Immutable record updates / scenario 5", "Return a new Account with Balance increased by5, Name unchanged. Preserve original. Throw OverflowException on int overflow.", "The with expression copies a record without mutating its source.", E126.Verify),
    new(127, "Immutable record updates / scenario 6", "Return a new Account with Balance increased by6, Name unchanged. Preserve original. Throw OverflowException on int overflow.", "The with expression copies a record without mutating its source.", E127.Verify),
    new(128, "Immutable record updates / scenario 7", "Return a new Account with Balance increased by7, Name unchanged. Preserve original. Throw OverflowException on int overflow.", "The with expression copies a record without mutating its source.", E128.Verify),
    new(129, "Immutable record updates / scenario 8", "Return a new Account with Balance increased by8, Name unchanged. Preserve original. Throw OverflowException on int overflow.", "The with expression copies a record without mutating its source.", E129.Verify),
    new(130, "Immutable record updates / scenario 9", "Return a new Account with Balance increased by9, Name unchanged. Preserve original. Throw OverflowException on int overflow.", "The with expression copies a record without mutating its source.", E130.Verify),
    new(131, "Immutable record updates / scenario 10", "Return a new Account with Balance increased by10, Name unchanged. Preserve original. Throw OverflowException on int overflow.", "The with expression copies a record without mutating its source.", E131.Verify),
    new(132, "Immutable record updates / scenario 11", "Return a new Account with Balance increased by11, Name unchanged. Preserve original. Throw OverflowException on int overflow.", "The with expression copies a record without mutating its source.", E132.Verify),
    new(133, "Nullable fallback rules / scenario 1", "Return supplied nullable integer or fallback-5 when null. Preserve0 and negative values; do not use truthiness-style rules.", "Null-coalescing examines null, not the numeric value.", E133.Verify),
    new(134, "Nullable fallback rules / scenario 2", "Return supplied nullable integer or fallback-4 when null. Preserve0 and negative values; do not use truthiness-style rules.", "Null-coalescing examines null, not the numeric value.", E134.Verify),
    new(135, "Nullable fallback rules / scenario 3", "Return supplied nullable integer or fallback-3 when null. Preserve0 and negative values; do not use truthiness-style rules.", "Null-coalescing examines null, not the numeric value.", E135.Verify),
    new(136, "Nullable fallback rules / scenario 4", "Return supplied nullable integer or fallback-2 when null. Preserve0 and negative values; do not use truthiness-style rules.", "Null-coalescing examines null, not the numeric value.", E136.Verify),
    new(137, "Nullable fallback rules / scenario 5", "Return supplied nullable integer or fallback-1 when null. Preserve0 and negative values; do not use truthiness-style rules.", "Null-coalescing examines null, not the numeric value.", E137.Verify),
    new(138, "Nullable fallback rules / scenario 6", "Return supplied nullable integer or fallback0 when null. Preserve0 and negative values; do not use truthiness-style rules.", "Null-coalescing examines null, not the numeric value.", E138.Verify),
    new(139, "Nullable fallback rules / scenario 7", "Return supplied nullable integer or fallback1 when null. Preserve0 and negative values; do not use truthiness-style rules.", "Null-coalescing examines null, not the numeric value.", E139.Verify),
    new(140, "Nullable fallback rules / scenario 8", "Return supplied nullable integer or fallback2 when null. Preserve0 and negative values; do not use truthiness-style rules.", "Null-coalescing examines null, not the numeric value.", E140.Verify),
    new(141, "Nullable fallback rules / scenario 9", "Return supplied nullable integer or fallback3 when null. Preserve0 and negative values; do not use truthiness-style rules.", "Null-coalescing examines null, not the numeric value.", E141.Verify),
    new(142, "Nullable fallback rules / scenario 10", "Return supplied nullable integer or fallback4 when null. Preserve0 and negative values; do not use truthiness-style rules.", "Null-coalescing examines null, not the numeric value.", E142.Verify),
    new(143, "Nullable fallback rules / scenario 11", "Return supplied nullable integer or fallback5 when null. Preserve0 and negative values; do not use truthiness-style rules.", "Null-coalescing examines null, not the numeric value.", E143.Verify),
    new(144, "Generic stable deduplication / scenario 1", "Return up to1 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.", "A HashSet detects duplicates while a List retains order.", E144.Verify),
    new(145, "Generic stable deduplication / scenario 2", "Return up to2 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.", "A HashSet detects duplicates while a List retains order.", E145.Verify),
    new(146, "Generic stable deduplication / scenario 3", "Return up to3 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.", "A HashSet detects duplicates while a List retains order.", E146.Verify),
    new(147, "Generic stable deduplication / scenario 4", "Return up to4 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.", "A HashSet detects duplicates while a List retains order.", E147.Verify),
    new(148, "Generic stable deduplication / scenario 5", "Return up to5 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.", "A HashSet detects duplicates while a List retains order.", E148.Verify),
    new(149, "Generic stable deduplication / scenario 6", "Return up to6 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.", "A HashSet detects duplicates while a List retains order.", E149.Verify),
    new(150, "Generic stable deduplication / scenario 7", "Return up to7 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.", "A HashSet detects duplicates while a List retains order.", E150.Verify),
    new(151, "Generic stable deduplication / scenario 8", "Return up to8 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.", "A HashSet detects duplicates while a List retains order.", E151.Verify),
    new(152, "Generic stable deduplication / scenario 9", "Return up to9 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.", "A HashSet detects duplicates while a List retains order.", E152.Verify),
    new(153, "Generic stable deduplication / scenario 10", "Return up to10 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.", "A HashSet detects duplicates while a List retains order.", E153.Verify),
    new(154, "Generic stable deduplication / scenario 11", "Return up to11 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.", "A HashSet detects duplicates while a List retains order.", E154.Verify),
    new(155, "Custom equality comparers / scenario 1", "Count distinct strings using Ordinal comparison. Culture-independent; do not trim whitespace. Scenario1.", "Passing the comparer avoids allocating normalized strings.", E155.Verify),
    new(156, "Custom equality comparers / scenario 2", "Count distinct strings using OrdinalIgnoreCase comparison. Culture-independent; do not trim whitespace. Scenario2.", "Passing the comparer avoids allocating normalized strings.", E156.Verify),
    new(157, "Custom equality comparers / scenario 3", "Count distinct strings using Ordinal comparison. Culture-independent; do not trim whitespace. Scenario3.", "Passing the comparer avoids allocating normalized strings.", E157.Verify),
    new(158, "Custom equality comparers / scenario 4", "Count distinct strings using OrdinalIgnoreCase comparison. Culture-independent; do not trim whitespace. Scenario4.", "Passing the comparer avoids allocating normalized strings.", E158.Verify),
    new(159, "Custom equality comparers / scenario 5", "Count distinct strings using Ordinal comparison. Culture-independent; do not trim whitespace. Scenario5.", "Passing the comparer avoids allocating normalized strings.", E159.Verify),
    new(160, "Custom equality comparers / scenario 6", "Count distinct strings using OrdinalIgnoreCase comparison. Culture-independent; do not trim whitespace. Scenario6.", "Passing the comparer avoids allocating normalized strings.", E160.Verify),
    new(161, "Custom equality comparers / scenario 7", "Count distinct strings using Ordinal comparison. Culture-independent; do not trim whitespace. Scenario7.", "Passing the comparer avoids allocating normalized strings.", E161.Verify),
    new(162, "Custom equality comparers / scenario 8", "Count distinct strings using OrdinalIgnoreCase comparison. Culture-independent; do not trim whitespace. Scenario8.", "Passing the comparer avoids allocating normalized strings.", E162.Verify),
    new(163, "Custom equality comparers / scenario 9", "Count distinct strings using Ordinal comparison. Culture-independent; do not trim whitespace. Scenario9.", "Passing the comparer avoids allocating normalized strings.", E163.Verify),
    new(164, "Custom equality comparers / scenario 10", "Count distinct strings using OrdinalIgnoreCase comparison. Culture-independent; do not trim whitespace. Scenario10.", "Passing the comparer avoids allocating normalized strings.", E164.Verify),
    new(165, "Custom equality comparers / scenario 11", "Count distinct strings using Ordinal comparison. Culture-independent; do not trim whitespace. Scenario11.", "Passing the comparer avoids allocating normalized strings.", E165.Verify),
    new(166, "Lazy iterator sampling / scenario 1", "Lazily yield elements at zero-based indices divisible by1. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.", "yield return builds a state machine; it should not call ToArray internally.", E166.Verify),
    new(167, "Lazy iterator sampling / scenario 2", "Lazily yield elements at zero-based indices divisible by2. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.", "yield return builds a state machine; it should not call ToArray internally.", E167.Verify),
    new(168, "Lazy iterator sampling / scenario 3", "Lazily yield elements at zero-based indices divisible by3. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.", "yield return builds a state machine; it should not call ToArray internally.", E168.Verify),
    new(169, "Lazy iterator sampling / scenario 4", "Lazily yield elements at zero-based indices divisible by4. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.", "yield return builds a state machine; it should not call ToArray internally.", E169.Verify),
    new(170, "Lazy iterator sampling / scenario 5", "Lazily yield elements at zero-based indices divisible by5. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.", "yield return builds a state machine; it should not call ToArray internally.", E170.Verify),
    new(171, "Lazy iterator sampling / scenario 6", "Lazily yield elements at zero-based indices divisible by6. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.", "yield return builds a state machine; it should not call ToArray internally.", E171.Verify),
    new(172, "Lazy iterator sampling / scenario 7", "Lazily yield elements at zero-based indices divisible by7. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.", "yield return builds a state machine; it should not call ToArray internally.", E172.Verify),
    new(173, "Lazy iterator sampling / scenario 8", "Lazily yield elements at zero-based indices divisible by8. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.", "yield return builds a state machine; it should not call ToArray internally.", E173.Verify),
    new(174, "Lazy iterator sampling / scenario 9", "Lazily yield elements at zero-based indices divisible by9. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.", "yield return builds a state machine; it should not call ToArray internally.", E174.Verify),
    new(175, "Lazy iterator sampling / scenario 10", "Lazily yield elements at zero-based indices divisible by10. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.", "yield return builds a state machine; it should not call ToArray internally.", E175.Verify),
    new(176, "Lazy iterator sampling / scenario 11", "Lazily yield elements at zero-based indices divisible by11. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.", "yield return builds a state machine; it should not call ToArray internally.", E176.Verify),
    new(177, "Span-based parsing / scenario 1", "Read first signed int32 before ':' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.", "Span slicing avoids allocating a substring.", E177.Verify),
    new(178, "Span-based parsing / scenario 2", "Read first signed int32 before ',' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.", "Span slicing avoids allocating a substring.", E178.Verify),
    new(179, "Span-based parsing / scenario 3", "Read first signed int32 before ';' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.", "Span slicing avoids allocating a substring.", E179.Verify),
    new(180, "Span-based parsing / scenario 4", "Read first signed int32 before '|' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.", "Span slicing avoids allocating a substring.", E180.Verify),
    new(181, "Span-based parsing / scenario 5", "Read first signed int32 before ':' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.", "Span slicing avoids allocating a substring.", E181.Verify),
    new(182, "Span-based parsing / scenario 6", "Read first signed int32 before ',' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.", "Span slicing avoids allocating a substring.", E182.Verify),
    new(183, "Span-based parsing / scenario 7", "Read first signed int32 before ';' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.", "Span slicing avoids allocating a substring.", E183.Verify),
    new(184, "Span-based parsing / scenario 8", "Read first signed int32 before '|' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.", "Span slicing avoids allocating a substring.", E184.Verify),
    new(185, "Span-based parsing / scenario 9", "Read first signed int32 before ':' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.", "Span slicing avoids allocating a substring.", E185.Verify),
    new(186, "Span-based parsing / scenario 10", "Read first signed int32 before ',' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.", "Span slicing avoids allocating a substring.", E186.Verify),
    new(187, "Span-based parsing / scenario 11", "Read first signed int32 before ';' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.", "Span slicing avoids allocating a substring.", E187.Verify),
    new(188, "Unicode Rune counting / scenario 1", "Count Unicode scalar values with code point >=65. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.", "String.Length counts code units; Rune enumeration counts scalar values.", E188.Verify),
    new(189, "Unicode Rune counting / scenario 2", "Count Unicode scalar values with code point >=66. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.", "String.Length counts code units; Rune enumeration counts scalar values.", E189.Verify),
    new(190, "Unicode Rune counting / scenario 3", "Count Unicode scalar values with code point >=67. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.", "String.Length counts code units; Rune enumeration counts scalar values.", E190.Verify),
    new(191, "Unicode Rune counting / scenario 4", "Count Unicode scalar values with code point >=68. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.", "String.Length counts code units; Rune enumeration counts scalar values.", E191.Verify),
    new(192, "Unicode Rune counting / scenario 5", "Count Unicode scalar values with code point >=69. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.", "String.Length counts code units; Rune enumeration counts scalar values.", E192.Verify),
    new(193, "Unicode Rune counting / scenario 6", "Count Unicode scalar values with code point >=70. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.", "String.Length counts code units; Rune enumeration counts scalar values.", E193.Verify),
    new(194, "Unicode Rune counting / scenario 7", "Count Unicode scalar values with code point >=71. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.", "String.Length counts code units; Rune enumeration counts scalar values.", E194.Verify),
    new(195, "Unicode Rune counting / scenario 8", "Count Unicode scalar values with code point >=72. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.", "String.Length counts code units; Rune enumeration counts scalar values.", E195.Verify),
    new(196, "Unicode Rune counting / scenario 9", "Count Unicode scalar values with code point >=73. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.", "String.Length counts code units; Rune enumeration counts scalar values.", E196.Verify),
    new(197, "Unicode Rune counting / scenario 10", "Count Unicode scalar values with code point >=74. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.", "String.Length counts code units; Rune enumeration counts scalar values.", E197.Verify),
    new(198, "Unicode Rune counting / scenario 11", "Count Unicode scalar values with code point >=75. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.", "String.Length counts code units; Rune enumeration counts scalar values.", E198.Verify),
    new(199, "Regular expression capture extraction / scenario 1", "Extract maximal ASCII-letter runs, retaining words of length >=1. Preserve case/order. Digits/punctuation split runs.", "Regex.Matches supplies Match objects; project Value explicitly.", E199.Verify),
    new(200, "Regular expression capture extraction / scenario 2", "Extract maximal ASCII-letter runs, retaining words of length >=2. Preserve case/order. Digits/punctuation split runs.", "Regex.Matches supplies Match objects; project Value explicitly.", E200.Verify),
    new(201, "Regular expression capture extraction / scenario 3", "Extract maximal ASCII-letter runs, retaining words of length >=3. Preserve case/order. Digits/punctuation split runs.", "Regex.Matches supplies Match objects; project Value explicitly.", E201.Verify),
    new(202, "Regular expression capture extraction / scenario 4", "Extract maximal ASCII-letter runs, retaining words of length >=4. Preserve case/order. Digits/punctuation split runs.", "Regex.Matches supplies Match objects; project Value explicitly.", E202.Verify),
    new(203, "Regular expression capture extraction / scenario 5", "Extract maximal ASCII-letter runs, retaining words of length >=5. Preserve case/order. Digits/punctuation split runs.", "Regex.Matches supplies Match objects; project Value explicitly.", E203.Verify),
    new(204, "Regular expression capture extraction / scenario 6", "Extract maximal ASCII-letter runs, retaining words of length >=6. Preserve case/order. Digits/punctuation split runs.", "Regex.Matches supplies Match objects; project Value explicitly.", E204.Verify),
    new(205, "Regular expression capture extraction / scenario 7", "Extract maximal ASCII-letter runs, retaining words of length >=7. Preserve case/order. Digits/punctuation split runs.", "Regex.Matches supplies Match objects; project Value explicitly.", E205.Verify),
    new(206, "Regular expression capture extraction / scenario 8", "Extract maximal ASCII-letter runs, retaining words of length >=8. Preserve case/order. Digits/punctuation split runs.", "Regex.Matches supplies Match objects; project Value explicitly.", E206.Verify),
    new(207, "Regular expression capture extraction / scenario 9", "Extract maximal ASCII-letter runs, retaining words of length >=9. Preserve case/order. Digits/punctuation split runs.", "Regex.Matches supplies Match objects; project Value explicitly.", E207.Verify),
    new(208, "Regular expression capture extraction / scenario 10", "Extract maximal ASCII-letter runs, retaining words of length >=10. Preserve case/order. Digits/punctuation split runs.", "Regex.Matches supplies Match objects; project Value explicitly.", E208.Verify),
    new(209, "Regular expression capture extraction / scenario 11", "Extract maximal ASCII-letter runs, retaining words of length >=11. Preserve case/order. Digits/punctuation split runs.", "Regex.Matches supplies Match objects; project Value explicitly.", E209.Verify),
    new(210, "JSON property selection / scenario 1", "Parse JSON; return int32 property 'field0' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.", "JsonElement values depend on document lifetime; return a copied int, not the element.", E210.Verify),
    new(211, "JSON property selection / scenario 2", "Parse JSON; return int32 property 'field1' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.", "JsonElement values depend on document lifetime; return a copied int, not the element.", E211.Verify),
    new(212, "JSON property selection / scenario 3", "Parse JSON; return int32 property 'field2' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.", "JsonElement values depend on document lifetime; return a copied int, not the element.", E212.Verify),
    new(213, "JSON property selection / scenario 4", "Parse JSON; return int32 property 'field3' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.", "JsonElement values depend on document lifetime; return a copied int, not the element.", E213.Verify),
    new(214, "JSON property selection / scenario 5", "Parse JSON; return int32 property 'field4' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.", "JsonElement values depend on document lifetime; return a copied int, not the element.", E214.Verify),
    new(215, "JSON property selection / scenario 6", "Parse JSON; return int32 property 'field5' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.", "JsonElement values depend on document lifetime; return a copied int, not the element.", E215.Verify),
    new(216, "JSON property selection / scenario 7", "Parse JSON; return int32 property 'field6' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.", "JsonElement values depend on document lifetime; return a copied int, not the element.", E216.Verify),
    new(217, "JSON property selection / scenario 8", "Parse JSON; return int32 property 'field7' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.", "JsonElement values depend on document lifetime; return a copied int, not the element.", E217.Verify),
    new(218, "JSON property selection / scenario 9", "Parse JSON; return int32 property 'field8' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.", "JsonElement values depend on document lifetime; return a copied int, not the element.", E218.Verify),
    new(219, "JSON property selection / scenario 10", "Parse JSON; return int32 property 'field9' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.", "JsonElement values depend on document lifetime; return a copied int, not the element.", E219.Verify),
    new(220, "JSON property selection / scenario 11", "Parse JSON; return int32 property 'field10' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.", "JsonElement values depend on document lifetime; return a copied int, not the element.", E220.Verify),
    new(221, "DateOnly calendar arithmetic / scenario 1", "Add1 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.", "DateOnly.AddDays handles calendar transitions.", E221.Verify),
    new(222, "DateOnly calendar arithmetic / scenario 2", "Add2 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.", "DateOnly.AddDays handles calendar transitions.", E222.Verify),
    new(223, "DateOnly calendar arithmetic / scenario 3", "Add3 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.", "DateOnly.AddDays handles calendar transitions.", E223.Verify),
    new(224, "DateOnly calendar arithmetic / scenario 4", "Add4 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.", "DateOnly.AddDays handles calendar transitions.", E224.Verify),
    new(225, "DateOnly calendar arithmetic / scenario 5", "Add5 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.", "DateOnly.AddDays handles calendar transitions.", E225.Verify),
    new(226, "DateOnly calendar arithmetic / scenario 6", "Add6 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.", "DateOnly.AddDays handles calendar transitions.", E226.Verify),
    new(227, "DateOnly calendar arithmetic / scenario 7", "Add7 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.", "DateOnly.AddDays handles calendar transitions.", E227.Verify),
    new(228, "DateOnly calendar arithmetic / scenario 8", "Add8 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.", "DateOnly.AddDays handles calendar transitions.", E228.Verify),
    new(229, "DateOnly calendar arithmetic / scenario 9", "Add9 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.", "DateOnly.AddDays handles calendar transitions.", E229.Verify),
    new(230, "DateOnly calendar arithmetic / scenario 10", "Add10 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.", "DateOnly.AddDays handles calendar transitions.", E230.Verify),
    new(231, "DateOnly calendar arithmetic / scenario 11", "Add11 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.", "DateOnly.AddDays handles calendar transitions.", E231.Verify),
    new(232, "TimeOnly wraparound / scenario 1", "Add15 minutes and wrap at midnight. Return TimeOnly, ignoring date.", "TimeOnly handles the24-hour wrap automatically.", E232.Verify),
    new(233, "TimeOnly wraparound / scenario 2", "Add30 minutes and wrap at midnight. Return TimeOnly, ignoring date.", "TimeOnly handles the24-hour wrap automatically.", E233.Verify),
    new(234, "TimeOnly wraparound / scenario 3", "Add45 minutes and wrap at midnight. Return TimeOnly, ignoring date.", "TimeOnly handles the24-hour wrap automatically.", E234.Verify),
    new(235, "TimeOnly wraparound / scenario 4", "Add60 minutes and wrap at midnight. Return TimeOnly, ignoring date.", "TimeOnly handles the24-hour wrap automatically.", E235.Verify),
    new(236, "TimeOnly wraparound / scenario 5", "Add75 minutes and wrap at midnight. Return TimeOnly, ignoring date.", "TimeOnly handles the24-hour wrap automatically.", E236.Verify),
    new(237, "TimeOnly wraparound / scenario 6", "Add90 minutes and wrap at midnight. Return TimeOnly, ignoring date.", "TimeOnly handles the24-hour wrap automatically.", E237.Verify),
    new(238, "TimeOnly wraparound / scenario 7", "Add105 minutes and wrap at midnight. Return TimeOnly, ignoring date.", "TimeOnly handles the24-hour wrap automatically.", E238.Verify),
    new(239, "TimeOnly wraparound / scenario 8", "Add120 minutes and wrap at midnight. Return TimeOnly, ignoring date.", "TimeOnly handles the24-hour wrap automatically.", E239.Verify),
    new(240, "TimeOnly wraparound / scenario 9", "Add135 minutes and wrap at midnight. Return TimeOnly, ignoring date.", "TimeOnly handles the24-hour wrap automatically.", E240.Verify),
    new(241, "TimeOnly wraparound / scenario 10", "Add150 minutes and wrap at midnight. Return TimeOnly, ignoring date.", "TimeOnly handles the24-hour wrap automatically.", E241.Verify),
    new(242, "TimeOnly wraparound / scenario 11", "Add165 minutes and wrap at midnight. Return TimeOnly, ignoring date.", "TimeOnly handles the24-hour wrap automatically.", E242.Verify),
    new(243, "DateTimeOffset instant comparison / scenario 1", "Return true when elapsed real time from start to end is at least1 minutes. Offsets may differ; compare instants, not clock-face hours.", "DateTimeOffset subtraction normalizes offsets.", E243.Verify),
    new(244, "DateTimeOffset instant comparison / scenario 2", "Return true when elapsed real time from start to end is at least2 minutes. Offsets may differ; compare instants, not clock-face hours.", "DateTimeOffset subtraction normalizes offsets.", E244.Verify),
    new(245, "DateTimeOffset instant comparison / scenario 3", "Return true when elapsed real time from start to end is at least3 minutes. Offsets may differ; compare instants, not clock-face hours.", "DateTimeOffset subtraction normalizes offsets.", E245.Verify),
    new(246, "DateTimeOffset instant comparison / scenario 4", "Return true when elapsed real time from start to end is at least4 minutes. Offsets may differ; compare instants, not clock-face hours.", "DateTimeOffset subtraction normalizes offsets.", E246.Verify),
    new(247, "DateTimeOffset instant comparison / scenario 5", "Return true when elapsed real time from start to end is at least5 minutes. Offsets may differ; compare instants, not clock-face hours.", "DateTimeOffset subtraction normalizes offsets.", E247.Verify),
    new(248, "DateTimeOffset instant comparison / scenario 6", "Return true when elapsed real time from start to end is at least6 minutes. Offsets may differ; compare instants, not clock-face hours.", "DateTimeOffset subtraction normalizes offsets.", E248.Verify),
    new(249, "DateTimeOffset instant comparison / scenario 7", "Return true when elapsed real time from start to end is at least7 minutes. Offsets may differ; compare instants, not clock-face hours.", "DateTimeOffset subtraction normalizes offsets.", E249.Verify),
    new(250, "DateTimeOffset instant comparison / scenario 8", "Return true when elapsed real time from start to end is at least8 minutes. Offsets may differ; compare instants, not clock-face hours.", "DateTimeOffset subtraction normalizes offsets.", E250.Verify),
    new(251, "DateTimeOffset instant comparison / scenario 9", "Return true when elapsed real time from start to end is at least9 minutes. Offsets may differ; compare instants, not clock-face hours.", "DateTimeOffset subtraction normalizes offsets.", E251.Verify),
    new(252, "DateTimeOffset instant comparison / scenario 10", "Return true when elapsed real time from start to end is at least10 minutes. Offsets may differ; compare instants, not clock-face hours.", "DateTimeOffset subtraction normalizes offsets.", E252.Verify),
    new(253, "DateTimeOffset instant comparison / scenario 11", "Return true when elapsed real time from start to end is at least11 minutes. Offsets may differ; compare instants, not clock-face hours.", "DateTimeOffset subtraction normalizes offsets.", E253.Verify),
    new(254, "BigInteger factorials / scenario 1", "Return n! using BigInteger for 0<=n<=10; reject other inputs. 0!=1.", "An int or long factorial overflows quickly.", E254.Verify),
    new(255, "BigInteger factorials / scenario 2", "Return n! using BigInteger for 0<=n<=11; reject other inputs. 0!=1.", "An int or long factorial overflows quickly.", E255.Verify),
    new(256, "BigInteger factorials / scenario 3", "Return n! using BigInteger for 0<=n<=12; reject other inputs. 0!=1.", "An int or long factorial overflows quickly.", E256.Verify),
    new(257, "BigInteger factorials / scenario 4", "Return n! using BigInteger for 0<=n<=13; reject other inputs. 0!=1.", "An int or long factorial overflows quickly.", E257.Verify),
    new(258, "BigInteger factorials / scenario 5", "Return n! using BigInteger for 0<=n<=14; reject other inputs. 0!=1.", "An int or long factorial overflows quickly.", E258.Verify),
    new(259, "BigInteger factorials / scenario 6", "Return n! using BigInteger for 0<=n<=15; reject other inputs. 0!=1.", "An int or long factorial overflows quickly.", E259.Verify),
    new(260, "BigInteger factorials / scenario 7", "Return n! using BigInteger for 0<=n<=16; reject other inputs. 0!=1.", "An int or long factorial overflows quickly.", E260.Verify),
    new(261, "BigInteger factorials / scenario 8", "Return n! using BigInteger for 0<=n<=17; reject other inputs. 0!=1.", "An int or long factorial overflows quickly.", E261.Verify),
    new(262, "BigInteger factorials / scenario 9", "Return n! using BigInteger for 0<=n<=18; reject other inputs. 0!=1.", "An int or long factorial overflows quickly.", E262.Verify),
    new(263, "BigInteger factorials / scenario 10", "Return n! using BigInteger for 0<=n<=19; reject other inputs. 0!=1.", "An int or long factorial overflows quickly.", E263.Verify),
    new(264, "BigInteger factorials / scenario 11", "Return n! using BigInteger for 0<=n<=20; reject other inputs. 0!=1.", "An int or long factorial overflows quickly.", E264.Verify),
    new(265, "Checked integer multiplication / scenario 1", "Multiply int32 by2; throw OverflowException rather than wrap when out of range.", "checked changes integral arithmetic overflow behavior.", E265.Verify),
    new(266, "Checked integer multiplication / scenario 2", "Multiply int32 by3; throw OverflowException rather than wrap when out of range.", "checked changes integral arithmetic overflow behavior.", E266.Verify),
    new(267, "Checked integer multiplication / scenario 3", "Multiply int32 by4; throw OverflowException rather than wrap when out of range.", "checked changes integral arithmetic overflow behavior.", E267.Verify),
    new(268, "Checked integer multiplication / scenario 4", "Multiply int32 by5; throw OverflowException rather than wrap when out of range.", "checked changes integral arithmetic overflow behavior.", E268.Verify),
    new(269, "Checked integer multiplication / scenario 5", "Multiply int32 by6; throw OverflowException rather than wrap when out of range.", "checked changes integral arithmetic overflow behavior.", E269.Verify),
    new(270, "Checked integer multiplication / scenario 6", "Multiply int32 by7; throw OverflowException rather than wrap when out of range.", "checked changes integral arithmetic overflow behavior.", E270.Verify),
    new(271, "Checked integer multiplication / scenario 7", "Multiply int32 by8; throw OverflowException rather than wrap when out of range.", "checked changes integral arithmetic overflow behavior.", E271.Verify),
    new(272, "Checked integer multiplication / scenario 8", "Multiply int32 by9; throw OverflowException rather than wrap when out of range.", "checked changes integral arithmetic overflow behavior.", E272.Verify),
    new(273, "Checked integer multiplication / scenario 9", "Multiply int32 by10; throw OverflowException rather than wrap when out of range.", "checked changes integral arithmetic overflow behavior.", E273.Verify),
    new(274, "Checked integer multiplication / scenario 10", "Multiply int32 by11; throw OverflowException rather than wrap when out of range.", "checked changes integral arithmetic overflow behavior.", E274.Verify),
    new(275, "Checked integer multiplication / scenario 11", "Multiply int32 by12; throw OverflowException rather than wrap when out of range.", "checked changes integral arithmetic overflow behavior.", E275.Verify),
    new(276, "Binary bit masks / scenario 1", "Set or clear bit0 of a uint according to enabled, preserving every other bit.", "Set with OR, clear with AND of the complemented mask.", E276.Verify),
    new(277, "Binary bit masks / scenario 2", "Set or clear bit1 of a uint according to enabled, preserving every other bit.", "Set with OR, clear with AND of the complemented mask.", E277.Verify),
    new(278, "Binary bit masks / scenario 3", "Set or clear bit2 of a uint according to enabled, preserving every other bit.", "Set with OR, clear with AND of the complemented mask.", E278.Verify),
    new(279, "Binary bit masks / scenario 4", "Set or clear bit3 of a uint according to enabled, preserving every other bit.", "Set with OR, clear with AND of the complemented mask.", E279.Verify),
    new(280, "Binary bit masks / scenario 5", "Set or clear bit4 of a uint according to enabled, preserving every other bit.", "Set with OR, clear with AND of the complemented mask.", E280.Verify),
    new(281, "Binary bit masks / scenario 6", "Set or clear bit5 of a uint according to enabled, preserving every other bit.", "Set with OR, clear with AND of the complemented mask.", E281.Verify),
    new(282, "Binary bit masks / scenario 7", "Set or clear bit6 of a uint according to enabled, preserving every other bit.", "Set with OR, clear with AND of the complemented mask.", E282.Verify),
    new(283, "Binary bit masks / scenario 8", "Set or clear bit7 of a uint according to enabled, preserving every other bit.", "Set with OR, clear with AND of the complemented mask.", E283.Verify),
    new(284, "Binary bit masks / scenario 9", "Set or clear bit8 of a uint according to enabled, preserving every other bit.", "Set with OR, clear with AND of the complemented mask.", E284.Verify),
    new(285, "Binary bit masks / scenario 10", "Set or clear bit9 of a uint according to enabled, preserving every other bit.", "Set with OR, clear with AND of the complemented mask.", E285.Verify),
    new(286, "Binary bit masks / scenario 11", "Set or clear bit10 of a uint according to enabled, preserving every other bit.", "Set with OR, clear with AND of the complemented mask.", E286.Verify),
    new(287, "Little-endian binary encoding / scenario 1", "Read a signed little-endian int32 beginning at offset0. Reject buffers shorter than4. Do not mutate input.", "BinaryPrimitives makes endianness explicit and independent of hardware.", E287.Verify),
    new(288, "Little-endian binary encoding / scenario 2", "Read a signed little-endian int32 beginning at offset1. Reject buffers shorter than5. Do not mutate input.", "BinaryPrimitives makes endianness explicit and independent of hardware.", E288.Verify),
    new(289, "Little-endian binary encoding / scenario 3", "Read a signed little-endian int32 beginning at offset2. Reject buffers shorter than6. Do not mutate input.", "BinaryPrimitives makes endianness explicit and independent of hardware.", E289.Verify),
    new(290, "Little-endian binary encoding / scenario 4", "Read a signed little-endian int32 beginning at offset3. Reject buffers shorter than7. Do not mutate input.", "BinaryPrimitives makes endianness explicit and independent of hardware.", E290.Verify),
    new(291, "Little-endian binary encoding / scenario 5", "Read a signed little-endian int32 beginning at offset4. Reject buffers shorter than8. Do not mutate input.", "BinaryPrimitives makes endianness explicit and independent of hardware.", E291.Verify),
    new(292, "Little-endian binary encoding / scenario 6", "Read a signed little-endian int32 beginning at offset5. Reject buffers shorter than9. Do not mutate input.", "BinaryPrimitives makes endianness explicit and independent of hardware.", E292.Verify),
    new(293, "Little-endian binary encoding / scenario 7", "Read a signed little-endian int32 beginning at offset6. Reject buffers shorter than10. Do not mutate input.", "BinaryPrimitives makes endianness explicit and independent of hardware.", E293.Verify),
    new(294, "Little-endian binary encoding / scenario 8", "Read a signed little-endian int32 beginning at offset7. Reject buffers shorter than11. Do not mutate input.", "BinaryPrimitives makes endianness explicit and independent of hardware.", E294.Verify),
    new(295, "Little-endian binary encoding / scenario 9", "Read a signed little-endian int32 beginning at offset8. Reject buffers shorter than12. Do not mutate input.", "BinaryPrimitives makes endianness explicit and independent of hardware.", E295.Verify),
    new(296, "Little-endian binary encoding / scenario 10", "Read a signed little-endian int32 beginning at offset9. Reject buffers shorter than13. Do not mutate input.", "BinaryPrimitives makes endianness explicit and independent of hardware.", E296.Verify),
    new(297, "Little-endian binary encoding / scenario 11", "Read a signed little-endian int32 beginning at offset10. Reject buffers shorter than14. Do not mutate input.", "BinaryPrimitives makes endianness explicit and independent of hardware.", E297.Verify),
    new(298, "Queue bounded-buffer policies / scenario 1", "Keep only the newest1 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.", "Evict before enqueueing when at capacity.", E298.Verify),
    new(299, "Queue bounded-buffer policies / scenario 2", "Keep only the newest2 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.", "Evict before enqueueing when at capacity.", E299.Verify),
    new(300, "Queue bounded-buffer policies / scenario 3", "Keep only the newest3 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.", "Evict before enqueueing when at capacity.", E300.Verify),
    new(301, "Queue bounded-buffer policies / scenario 4", "Keep only the newest4 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.", "Evict before enqueueing when at capacity.", E301.Verify),
    new(302, "Queue bounded-buffer policies / scenario 5", "Keep only the newest5 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.", "Evict before enqueueing when at capacity.", E302.Verify),
    new(303, "Queue bounded-buffer policies / scenario 6", "Keep only the newest6 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.", "Evict before enqueueing when at capacity.", E303.Verify),
    new(304, "Queue bounded-buffer policies / scenario 7", "Keep only the newest7 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.", "Evict before enqueueing when at capacity.", E304.Verify),
    new(305, "Queue bounded-buffer policies / scenario 8", "Keep only the newest8 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.", "Evict before enqueueing when at capacity.", E305.Verify),
    new(306, "Queue bounded-buffer policies / scenario 9", "Keep only the newest9 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.", "Evict before enqueueing when at capacity.", E306.Verify),
    new(307, "Queue bounded-buffer policies / scenario 10", "Keep only the newest10 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.", "Evict before enqueueing when at capacity.", E307.Verify),
    new(308, "Queue bounded-buffer policies / scenario 11", "Keep only the newest11 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.", "Evict before enqueueing when at capacity.", E308.Verify),
    new(309, "Stack-based delimiter validation / scenario 1", "Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds1, even if balanced.", "Compare each closer to the most recent opener, and check leftovers.", E309.Verify),
    new(310, "Stack-based delimiter validation / scenario 2", "Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds2, even if balanced.", "Compare each closer to the most recent opener, and check leftovers.", E310.Verify),
    new(311, "Stack-based delimiter validation / scenario 3", "Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds3, even if balanced.", "Compare each closer to the most recent opener, and check leftovers.", E311.Verify),
    new(312, "Stack-based delimiter validation / scenario 4", "Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds4, even if balanced.", "Compare each closer to the most recent opener, and check leftovers.", E312.Verify),
    new(313, "Stack-based delimiter validation / scenario 5", "Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds5, even if balanced.", "Compare each closer to the most recent opener, and check leftovers.", E313.Verify),
    new(314, "Stack-based delimiter validation / scenario 6", "Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds6, even if balanced.", "Compare each closer to the most recent opener, and check leftovers.", E314.Verify),
    new(315, "Stack-based delimiter validation / scenario 7", "Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds7, even if balanced.", "Compare each closer to the most recent opener, and check leftovers.", E315.Verify),
    new(316, "Stack-based delimiter validation / scenario 8", "Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds8, even if balanced.", "Compare each closer to the most recent opener, and check leftovers.", E316.Verify),
    new(317, "Stack-based delimiter validation / scenario 9", "Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds9, even if balanced.", "Compare each closer to the most recent opener, and check leftovers.", E317.Verify),
    new(318, "Stack-based delimiter validation / scenario 10", "Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds10, even if balanced.", "Compare each closer to the most recent opener, and check leftovers.", E318.Verify),
    new(319, "Stack-based delimiter validation / scenario 11", "Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds11, even if balanced.", "Compare each closer to the most recent opener, and check leftovers.", E319.Verify),
    new(320, "PriorityQueue stable scheduling / scenario 1", "Return names of up to1 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.", "PriorityQueue does not promise stable equal-priority ordering.", E320.Verify),
    new(321, "PriorityQueue stable scheduling / scenario 2", "Return names of up to2 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.", "PriorityQueue does not promise stable equal-priority ordering.", E321.Verify),
    new(322, "PriorityQueue stable scheduling / scenario 3", "Return names of up to3 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.", "PriorityQueue does not promise stable equal-priority ordering.", E322.Verify),
    new(323, "PriorityQueue stable scheduling / scenario 4", "Return names of up to4 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.", "PriorityQueue does not promise stable equal-priority ordering.", E323.Verify),
    new(324, "PriorityQueue stable scheduling / scenario 5", "Return names of up to5 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.", "PriorityQueue does not promise stable equal-priority ordering.", E324.Verify),
    new(325, "PriorityQueue stable scheduling / scenario 6", "Return names of up to6 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.", "PriorityQueue does not promise stable equal-priority ordering.", E325.Verify),
    new(326, "PriorityQueue stable scheduling / scenario 7", "Return names of up to7 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.", "PriorityQueue does not promise stable equal-priority ordering.", E326.Verify),
    new(327, "PriorityQueue stable scheduling / scenario 8", "Return names of up to8 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.", "PriorityQueue does not promise stable equal-priority ordering.", E327.Verify),
    new(328, "PriorityQueue stable scheduling / scenario 9", "Return names of up to9 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.", "PriorityQueue does not promise stable equal-priority ordering.", E328.Verify),
    new(329, "PriorityQueue stable scheduling / scenario 10", "Return names of up to10 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.", "PriorityQueue does not promise stable equal-priority ordering.", E329.Verify),
    new(330, "PriorityQueue stable scheduling / scenario 11", "Return names of up to11 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.", "PriorityQueue does not promise stable equal-priority ordering.", E330.Verify),
    new(331, "Set algebra with comparer / scenario 1", "Perform intersection with ordinal case-sensitive comparison.  Return ordinal-sorted distinct values.", "HashSet mutates itself, so construct a new set from caller data.", E331.Verify),
    new(332, "Set algebra with comparer / scenario 2", "Perform union with ordinal case-insensitive comparison. Lowercase output. Return ordinal-sorted distinct values.", "HashSet mutates itself, so construct a new set from caller data.", E332.Verify),
    new(333, "Set algebra with comparer / scenario 3", "Perform left difference with ordinal case-sensitive comparison.  Return ordinal-sorted distinct values.", "HashSet mutates itself, so construct a new set from caller data.", E333.Verify),
    new(334, "Set algebra with comparer / scenario 4", "Perform symmetric difference with ordinal case-insensitive comparison. Lowercase output. Return ordinal-sorted distinct values.", "HashSet mutates itself, so construct a new set from caller data.", E334.Verify),
    new(335, "Set algebra with comparer / scenario 5", "Perform intersection with ordinal case-sensitive comparison.  Return ordinal-sorted distinct values.", "HashSet mutates itself, so construct a new set from caller data.", E335.Verify),
    new(336, "Set algebra with comparer / scenario 6", "Perform union with ordinal case-insensitive comparison. Lowercase output. Return ordinal-sorted distinct values.", "HashSet mutates itself, so construct a new set from caller data.", E336.Verify),
    new(337, "Set algebra with comparer / scenario 7", "Perform left difference with ordinal case-sensitive comparison.  Return ordinal-sorted distinct values.", "HashSet mutates itself, so construct a new set from caller data.", E337.Verify),
    new(338, "Set algebra with comparer / scenario 8", "Perform symmetric difference with ordinal case-insensitive comparison. Lowercase output. Return ordinal-sorted distinct values.", "HashSet mutates itself, so construct a new set from caller data.", E338.Verify),
    new(339, "Set algebra with comparer / scenario 9", "Perform intersection with ordinal case-sensitive comparison.  Return ordinal-sorted distinct values.", "HashSet mutates itself, so construct a new set from caller data.", E339.Verify),
    new(340, "Set algebra with comparer / scenario 10", "Perform union with ordinal case-insensitive comparison. Lowercase output. Return ordinal-sorted distinct values.", "HashSet mutates itself, so construct a new set from caller data.", E340.Verify),
    new(341, "Set algebra with comparer / scenario 11", "Perform left difference with ordinal case-sensitive comparison.  Return ordinal-sorted distinct values.", "HashSet mutates itself, so construct a new set from caller data.", E341.Verify),
    new(342, "GroupBy record summaries / scenario 1", "Group Row(Team,Points), retain groups of at least1 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.", "A group key and an aggregate are separate projection fields.", E342.Verify),
    new(343, "GroupBy record summaries / scenario 2", "Group Row(Team,Points), retain groups of at least2 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.", "A group key and an aggregate are separate projection fields.", E343.Verify),
    new(344, "GroupBy record summaries / scenario 3", "Group Row(Team,Points), retain groups of at least3 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.", "A group key and an aggregate are separate projection fields.", E344.Verify),
    new(345, "GroupBy record summaries / scenario 4", "Group Row(Team,Points), retain groups of at least4 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.", "A group key and an aggregate are separate projection fields.", E345.Verify),
    new(346, "GroupBy record summaries / scenario 5", "Group Row(Team,Points), retain groups of at least5 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.", "A group key and an aggregate are separate projection fields.", E346.Verify),
    new(347, "GroupBy record summaries / scenario 6", "Group Row(Team,Points), retain groups of at least6 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.", "A group key and an aggregate are separate projection fields.", E347.Verify),
    new(348, "GroupBy record summaries / scenario 7", "Group Row(Team,Points), retain groups of at least7 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.", "A group key and an aggregate are separate projection fields.", E348.Verify),
    new(349, "GroupBy record summaries / scenario 8", "Group Row(Team,Points), retain groups of at least8 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.", "A group key and an aggregate are separate projection fields.", E349.Verify),
    new(350, "GroupBy record summaries / scenario 9", "Group Row(Team,Points), retain groups of at least9 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.", "A group key and an aggregate are separate projection fields.", E350.Verify),
    new(351, "GroupBy record summaries / scenario 10", "Group Row(Team,Points), retain groups of at least10 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.", "A group key and an aggregate are separate projection fields.", E351.Verify),
    new(352, "GroupBy record summaries / scenario 11", "Group Row(Team,Points), retain groups of at least11 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.", "A group key and an aggregate are separate projection fields.", E352.Verify),
    new(353, "Dictionary joins / scenario 1", "Inner join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched are omitted. Scenario1.", "TryGetValue distinguishes a missing team without exceptions.", E353.Verify),
    new(354, "Dictionary joins / scenario 2", "Left join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched get null team. Scenario2.", "TryGetValue distinguishes a missing team without exceptions.", E354.Verify),
    new(355, "Dictionary joins / scenario 3", "Inner join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched are omitted. Scenario3.", "TryGetValue distinguishes a missing team without exceptions.", E355.Verify),
    new(356, "Dictionary joins / scenario 4", "Left join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched get null team. Scenario4.", "TryGetValue distinguishes a missing team without exceptions.", E356.Verify),
    new(357, "Dictionary joins / scenario 5", "Inner join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched are omitted. Scenario5.", "TryGetValue distinguishes a missing team without exceptions.", E357.Verify),
    new(358, "Dictionary joins / scenario 6", "Left join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched get null team. Scenario6.", "TryGetValue distinguishes a missing team without exceptions.", E358.Verify),
    new(359, "Dictionary joins / scenario 7", "Inner join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched are omitted. Scenario7.", "TryGetValue distinguishes a missing team without exceptions.", E359.Verify),
    new(360, "Dictionary joins / scenario 8", "Left join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched get null team. Scenario8.", "TryGetValue distinguishes a missing team without exceptions.", E360.Verify),
    new(361, "Dictionary joins / scenario 9", "Inner join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched are omitted. Scenario9.", "TryGetValue distinguishes a missing team without exceptions.", E361.Verify),
    new(362, "Dictionary joins / scenario 10", "Left join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched get null team. Scenario10.", "TryGetValue distinguishes a missing team without exceptions.", E362.Verify),
    new(363, "Dictionary joins / scenario 11", "Inner join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched are omitted. Scenario11.", "TryGetValue distinguishes a missing team without exceptions.", E363.Verify),
    new(364, "Tuple interval merging / scenario 1", "Merge overlapping valid intervals, including merely touching endpoints. Return sorted named tuples without mutating input. Scenario1.", "ValueTuple is a value type; replace the last tuple rather than mutating a copy.", E364.Verify),
    new(365, "Tuple interval merging / scenario 2", "Merge overlapping valid intervals, excluding merely touching endpoints. Return sorted named tuples without mutating input. Scenario2.", "ValueTuple is a value type; replace the last tuple rather than mutating a copy.", E365.Verify),
    new(366, "Tuple interval merging / scenario 3", "Merge overlapping valid intervals, including merely touching endpoints. Return sorted named tuples without mutating input. Scenario3.", "ValueTuple is a value type; replace the last tuple rather than mutating a copy.", E366.Verify),
    new(367, "Tuple interval merging / scenario 4", "Merge overlapping valid intervals, excluding merely touching endpoints. Return sorted named tuples without mutating input. Scenario4.", "ValueTuple is a value type; replace the last tuple rather than mutating a copy.", E367.Verify),
    new(368, "Tuple interval merging / scenario 5", "Merge overlapping valid intervals, including merely touching endpoints. Return sorted named tuples without mutating input. Scenario5.", "ValueTuple is a value type; replace the last tuple rather than mutating a copy.", E368.Verify),
    new(369, "Tuple interval merging / scenario 6", "Merge overlapping valid intervals, excluding merely touching endpoints. Return sorted named tuples without mutating input. Scenario6.", "ValueTuple is a value type; replace the last tuple rather than mutating a copy.", E369.Verify),
    new(370, "Tuple interval merging / scenario 7", "Merge overlapping valid intervals, including merely touching endpoints. Return sorted named tuples without mutating input. Scenario7.", "ValueTuple is a value type; replace the last tuple rather than mutating a copy.", E370.Verify),
    new(371, "Tuple interval merging / scenario 8", "Merge overlapping valid intervals, excluding merely touching endpoints. Return sorted named tuples without mutating input. Scenario8.", "ValueTuple is a value type; replace the last tuple rather than mutating a copy.", E371.Verify),
    new(372, "Tuple interval merging / scenario 9", "Merge overlapping valid intervals, including merely touching endpoints. Return sorted named tuples without mutating input. Scenario9.", "ValueTuple is a value type; replace the last tuple rather than mutating a copy.", E372.Verify),
    new(373, "Tuple interval merging / scenario 10", "Merge overlapping valid intervals, excluding merely touching endpoints. Return sorted named tuples without mutating input. Scenario10.", "ValueTuple is a value type; replace the last tuple rather than mutating a copy.", E373.Verify),
    new(374, "Tuple interval merging / scenario 11", "Merge overlapping valid intervals, including merely touching endpoints. Return sorted named tuples without mutating input. Scenario11.", "ValueTuple is a value type; replace the last tuple rather than mutating a copy.", E374.Verify),
    new(375, "Binary search lower bound / scenario 1", "Find first index with value >=-5 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.", "Use half-open [lo,hi) search bounds.", E375.Verify),
    new(376, "Binary search lower bound / scenario 2", "Find first index with value >=-4 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.", "Use half-open [lo,hi) search bounds.", E376.Verify),
    new(377, "Binary search lower bound / scenario 3", "Find first index with value >=-3 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.", "Use half-open [lo,hi) search bounds.", E377.Verify),
    new(378, "Binary search lower bound / scenario 4", "Find first index with value >=-2 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.", "Use half-open [lo,hi) search bounds.", E378.Verify),
    new(379, "Binary search lower bound / scenario 5", "Find first index with value >=-1 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.", "Use half-open [lo,hi) search bounds.", E379.Verify),
    new(380, "Binary search lower bound / scenario 6", "Find first index with value >=0 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.", "Use half-open [lo,hi) search bounds.", E380.Verify),
    new(381, "Binary search lower bound / scenario 7", "Find first index with value >=1 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.", "Use half-open [lo,hi) search bounds.", E381.Verify),
    new(382, "Binary search lower bound / scenario 8", "Find first index with value >=2 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.", "Use half-open [lo,hi) search bounds.", E382.Verify),
    new(383, "Binary search lower bound / scenario 9", "Find first index with value >=3 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.", "Use half-open [lo,hi) search bounds.", E383.Verify),
    new(384, "Binary search lower bound / scenario 10", "Find first index with value >=4 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.", "Use half-open [lo,hi) search bounds.", E384.Verify),
    new(385, "Binary search lower bound / scenario 11", "Find first index with value >=5 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.", "Use half-open [lo,hi) search bounds.", E385.Verify),
    new(386, "Tree traversal with explicit stack / scenario 1", "Depth-first preorder traversal; return values >=-5, preserving child order. Null root returns[]. Use stack instead of recursion.", "Push children in reverse order because the stack is LIFO.", E386.Verify),
    new(387, "Tree traversal with explicit stack / scenario 2", "Depth-first preorder traversal; return values >=-4, preserving child order. Null root returns[]. Use stack instead of recursion.", "Push children in reverse order because the stack is LIFO.", E387.Verify),
    new(388, "Tree traversal with explicit stack / scenario 3", "Depth-first preorder traversal; return values >=-3, preserving child order. Null root returns[]. Use stack instead of recursion.", "Push children in reverse order because the stack is LIFO.", E388.Verify),
    new(389, "Tree traversal with explicit stack / scenario 4", "Depth-first preorder traversal; return values >=-2, preserving child order. Null root returns[]. Use stack instead of recursion.", "Push children in reverse order because the stack is LIFO.", E389.Verify),
    new(390, "Tree traversal with explicit stack / scenario 5", "Depth-first preorder traversal; return values >=-1, preserving child order. Null root returns[]. Use stack instead of recursion.", "Push children in reverse order because the stack is LIFO.", E390.Verify),
    new(391, "Tree traversal with explicit stack / scenario 6", "Depth-first preorder traversal; return values >=0, preserving child order. Null root returns[]. Use stack instead of recursion.", "Push children in reverse order because the stack is LIFO.", E391.Verify),
    new(392, "Tree traversal with explicit stack / scenario 7", "Depth-first preorder traversal; return values >=1, preserving child order. Null root returns[]. Use stack instead of recursion.", "Push children in reverse order because the stack is LIFO.", E392.Verify),
    new(393, "Tree traversal with explicit stack / scenario 8", "Depth-first preorder traversal; return values >=2, preserving child order. Null root returns[]. Use stack instead of recursion.", "Push children in reverse order because the stack is LIFO.", E393.Verify),
    new(394, "Tree traversal with explicit stack / scenario 9", "Depth-first preorder traversal; return values >=3, preserving child order. Null root returns[]. Use stack instead of recursion.", "Push children in reverse order because the stack is LIFO.", E394.Verify),
    new(395, "Tree traversal with explicit stack / scenario 10", "Depth-first preorder traversal; return values >=4, preserving child order. Null root returns[]. Use stack instead of recursion.", "Push children in reverse order because the stack is LIFO.", E395.Verify),
    new(396, "Tree traversal with explicit stack / scenario 11", "Depth-first preorder traversal; return values >=5, preserving child order. Null root returns[]. Use stack instead of recursion.", "Push children in reverse order because the stack is LIFO.", E396.Verify),
    new(397, "Graph breadth-first distances / scenario 1", "Find shortest directed edge counts from start, including only nodes within1 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.", "Mark visited when enqueueing, not when dequeueing.", E397.Verify),
    new(398, "Graph breadth-first distances / scenario 2", "Find shortest directed edge counts from start, including only nodes within2 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.", "Mark visited when enqueueing, not when dequeueing.", E398.Verify),
    new(399, "Graph breadth-first distances / scenario 3", "Find shortest directed edge counts from start, including only nodes within3 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.", "Mark visited when enqueueing, not when dequeueing.", E399.Verify),
    new(400, "Graph breadth-first distances / scenario 4", "Find shortest directed edge counts from start, including only nodes within4 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.", "Mark visited when enqueueing, not when dequeueing.", E400.Verify),
    new(401, "Graph breadth-first distances / scenario 5", "Find shortest directed edge counts from start, including only nodes within5 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.", "Mark visited when enqueueing, not when dequeueing.", E401.Verify),
    new(402, "Graph breadth-first distances / scenario 6", "Find shortest directed edge counts from start, including only nodes within6 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.", "Mark visited when enqueueing, not when dequeueing.", E402.Verify),
    new(403, "Graph breadth-first distances / scenario 7", "Find shortest directed edge counts from start, including only nodes within7 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.", "Mark visited when enqueueing, not when dequeueing.", E403.Verify),
    new(404, "Graph breadth-first distances / scenario 8", "Find shortest directed edge counts from start, including only nodes within8 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.", "Mark visited when enqueueing, not when dequeueing.", E404.Verify),
    new(405, "Graph breadth-first distances / scenario 9", "Find shortest directed edge counts from start, including only nodes within9 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.", "Mark visited when enqueueing, not when dequeueing.", E405.Verify),
    new(406, "Graph breadth-first distances / scenario 10", "Find shortest directed edge counts from start, including only nodes within10 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.", "Mark visited when enqueueing, not when dequeueing.", E406.Verify),
    new(407, "Graph breadth-first distances / scenario 11", "Find shortest directed edge counts from start, including only nodes within11 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.", "Mark visited when enqueueing, not when dequeueing.", E407.Verify),
    new(408, "Delegate composition / scenario 1", "Return a new delegate applying transform then adding1 with checked arithmetic. Do not invoke transform during construction; reject null.", "A closure captures the transform for later calls.", E408.Verify),
    new(409, "Delegate composition / scenario 2", "Return a new delegate applying transform then adding2 with checked arithmetic. Do not invoke transform during construction; reject null.", "A closure captures the transform for later calls.", E409.Verify),
    new(410, "Delegate composition / scenario 3", "Return a new delegate applying transform then adding3 with checked arithmetic. Do not invoke transform during construction; reject null.", "A closure captures the transform for later calls.", E410.Verify),
    new(411, "Delegate composition / scenario 4", "Return a new delegate applying transform then adding4 with checked arithmetic. Do not invoke transform during construction; reject null.", "A closure captures the transform for later calls.", E411.Verify),
    new(412, "Delegate composition / scenario 5", "Return a new delegate applying transform then adding5 with checked arithmetic. Do not invoke transform during construction; reject null.", "A closure captures the transform for later calls.", E412.Verify),
    new(413, "Delegate composition / scenario 6", "Return a new delegate applying transform then adding6 with checked arithmetic. Do not invoke transform during construction; reject null.", "A closure captures the transform for later calls.", E413.Verify),
    new(414, "Delegate composition / scenario 7", "Return a new delegate applying transform then adding7 with checked arithmetic. Do not invoke transform during construction; reject null.", "A closure captures the transform for later calls.", E414.Verify),
    new(415, "Delegate composition / scenario 8", "Return a new delegate applying transform then adding8 with checked arithmetic. Do not invoke transform during construction; reject null.", "A closure captures the transform for later calls.", E415.Verify),
    new(416, "Delegate composition / scenario 9", "Return a new delegate applying transform then adding9 with checked arithmetic. Do not invoke transform during construction; reject null.", "A closure captures the transform for later calls.", E416.Verify),
    new(417, "Delegate composition / scenario 10", "Return a new delegate applying transform then adding10 with checked arithmetic. Do not invoke transform during construction; reject null.", "A closure captures the transform for later calls.", E417.Verify),
    new(418, "Delegate composition / scenario 11", "Return a new delegate applying transform then adding11 with checked arithmetic. Do not invoke transform during construction; reject null.", "A closure captures the transform for later calls.", E418.Verify),
    new(419, "Events and subscription cleanup / scenario 1", "Subscribe to Source.Changed, raise1 through1, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.", "Removing a named handler requires the same delegate identity.", E419.Verify),
    new(420, "Events and subscription cleanup / scenario 2", "Subscribe to Source.Changed, raise1 through2, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.", "Removing a named handler requires the same delegate identity.", E420.Verify),
    new(421, "Events and subscription cleanup / scenario 3", "Subscribe to Source.Changed, raise1 through3, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.", "Removing a named handler requires the same delegate identity.", E421.Verify),
    new(422, "Events and subscription cleanup / scenario 4", "Subscribe to Source.Changed, raise1 through4, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.", "Removing a named handler requires the same delegate identity.", E422.Verify),
    new(423, "Events and subscription cleanup / scenario 5", "Subscribe to Source.Changed, raise1 through5, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.", "Removing a named handler requires the same delegate identity.", E423.Verify),
    new(424, "Events and subscription cleanup / scenario 6", "Subscribe to Source.Changed, raise1 through6, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.", "Removing a named handler requires the same delegate identity.", E424.Verify),
    new(425, "Events and subscription cleanup / scenario 7", "Subscribe to Source.Changed, raise1 through7, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.", "Removing a named handler requires the same delegate identity.", E425.Verify),
    new(426, "Events and subscription cleanup / scenario 8", "Subscribe to Source.Changed, raise1 through8, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.", "Removing a named handler requires the same delegate identity.", E426.Verify),
    new(427, "Events and subscription cleanup / scenario 9", "Subscribe to Source.Changed, raise1 through9, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.", "Removing a named handler requires the same delegate identity.", E427.Verify),
    new(428, "Events and subscription cleanup / scenario 10", "Subscribe to Source.Changed, raise1 through10, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.", "Removing a named handler requires the same delegate identity.", E428.Verify),
    new(429, "Events and subscription cleanup / scenario 11", "Subscribe to Source.Changed, raise1 through11, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.", "Removing a named handler requires the same delegate identity.", E429.Verify),
    new(430, "IDisposable and exception safety / scenario 1", "Acquire1 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.", "using executes cleanup even when its body throws.", E430.Verify),
    new(431, "IDisposable and exception safety / scenario 2", "Acquire2 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.", "using executes cleanup even when its body throws.", E431.Verify),
    new(432, "IDisposable and exception safety / scenario 3", "Acquire3 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.", "using executes cleanup even when its body throws.", E432.Verify),
    new(433, "IDisposable and exception safety / scenario 4", "Acquire4 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.", "using executes cleanup even when its body throws.", E433.Verify),
    new(434, "IDisposable and exception safety / scenario 5", "Acquire5 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.", "using executes cleanup even when its body throws.", E434.Verify),
    new(435, "IDisposable and exception safety / scenario 6", "Acquire6 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.", "using executes cleanup even when its body throws.", E435.Verify),
    new(436, "IDisposable and exception safety / scenario 7", "Acquire7 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.", "using executes cleanup even when its body throws.", E436.Verify),
    new(437, "IDisposable and exception safety / scenario 8", "Acquire8 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.", "using executes cleanup even when its body throws.", E437.Verify),
    new(438, "IDisposable and exception safety / scenario 9", "Acquire9 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.", "using executes cleanup even when its body throws.", E438.Verify),
    new(439, "IDisposable and exception safety / scenario 10", "Acquire10 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.", "using executes cleanup even when its body throws.", E439.Verify),
    new(440, "IDisposable and exception safety / scenario 11", "Acquire11 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.", "using executes cleanup even when its body throws.", E440.Verify),
    new(441, "Interface-based strategy injection / scenario 1", "Call injected ITransform for each value and add1 using checked arithmetic. Return array in order; reject null strategy.", "An interface lets tests inject behavior without inheritance from a concrete service.", E441.Verify),
    new(442, "Interface-based strategy injection / scenario 2", "Call injected ITransform for each value and add2 using checked arithmetic. Return array in order; reject null strategy.", "An interface lets tests inject behavior without inheritance from a concrete service.", E442.Verify),
    new(443, "Interface-based strategy injection / scenario 3", "Call injected ITransform for each value and add3 using checked arithmetic. Return array in order; reject null strategy.", "An interface lets tests inject behavior without inheritance from a concrete service.", E443.Verify),
    new(444, "Interface-based strategy injection / scenario 4", "Call injected ITransform for each value and add4 using checked arithmetic. Return array in order; reject null strategy.", "An interface lets tests inject behavior without inheritance from a concrete service.", E444.Verify),
    new(445, "Interface-based strategy injection / scenario 5", "Call injected ITransform for each value and add5 using checked arithmetic. Return array in order; reject null strategy.", "An interface lets tests inject behavior without inheritance from a concrete service.", E445.Verify),
    new(446, "Interface-based strategy injection / scenario 6", "Call injected ITransform for each value and add6 using checked arithmetic. Return array in order; reject null strategy.", "An interface lets tests inject behavior without inheritance from a concrete service.", E446.Verify),
    new(447, "Interface-based strategy injection / scenario 7", "Call injected ITransform for each value and add7 using checked arithmetic. Return array in order; reject null strategy.", "An interface lets tests inject behavior without inheritance from a concrete service.", E447.Verify),
    new(448, "Interface-based strategy injection / scenario 8", "Call injected ITransform for each value and add8 using checked arithmetic. Return array in order; reject null strategy.", "An interface lets tests inject behavior without inheritance from a concrete service.", E448.Verify),
    new(449, "Interface-based strategy injection / scenario 9", "Call injected ITransform for each value and add9 using checked arithmetic. Return array in order; reject null strategy.", "An interface lets tests inject behavior without inheritance from a concrete service.", E449.Verify),
    new(450, "Interface-based strategy injection / scenario 10", "Call injected ITransform for each value and add10 using checked arithmetic. Return array in order; reject null strategy.", "An interface lets tests inject behavior without inheritance from a concrete service.", E450.Verify),
    new(451, "Interface-based strategy injection / scenario 11", "Call injected ITransform for each value and add11 using checked arithmetic. Return array in order; reject null strategy.", "An interface lets tests inject behavior without inheritance from a concrete service.", E451.Verify),
    new(452, "Virtual dispatch and inheritance / scenario 1", "Call virtual Describe through an Animal reference, then append /1. Dog must override description. Null throws ArgumentNullException.", "Virtual dispatch chooses implementation from runtime type.", E452.Verify),
    new(453, "Virtual dispatch and inheritance / scenario 2", "Call virtual Describe through an Animal reference, then append /2. Dog must override description. Null throws ArgumentNullException.", "Virtual dispatch chooses implementation from runtime type.", E453.Verify),
    new(454, "Virtual dispatch and inheritance / scenario 3", "Call virtual Describe through an Animal reference, then append /3. Dog must override description. Null throws ArgumentNullException.", "Virtual dispatch chooses implementation from runtime type.", E454.Verify),
    new(455, "Virtual dispatch and inheritance / scenario 4", "Call virtual Describe through an Animal reference, then append /4. Dog must override description. Null throws ArgumentNullException.", "Virtual dispatch chooses implementation from runtime type.", E455.Verify),
    new(456, "Virtual dispatch and inheritance / scenario 5", "Call virtual Describe through an Animal reference, then append /5. Dog must override description. Null throws ArgumentNullException.", "Virtual dispatch chooses implementation from runtime type.", E456.Verify),
    new(457, "Virtual dispatch and inheritance / scenario 6", "Call virtual Describe through an Animal reference, then append /6. Dog must override description. Null throws ArgumentNullException.", "Virtual dispatch chooses implementation from runtime type.", E457.Verify),
    new(458, "Virtual dispatch and inheritance / scenario 7", "Call virtual Describe through an Animal reference, then append /7. Dog must override description. Null throws ArgumentNullException.", "Virtual dispatch chooses implementation from runtime type.", E458.Verify),
    new(459, "Virtual dispatch and inheritance / scenario 8", "Call virtual Describe through an Animal reference, then append /8. Dog must override description. Null throws ArgumentNullException.", "Virtual dispatch chooses implementation from runtime type.", E459.Verify),
    new(460, "Virtual dispatch and inheritance / scenario 9", "Call virtual Describe through an Animal reference, then append /9. Dog must override description. Null throws ArgumentNullException.", "Virtual dispatch chooses implementation from runtime type.", E460.Verify),
    new(461, "Virtual dispatch and inheritance / scenario 10", "Call virtual Describe through an Animal reference, then append /10. Dog must override description. Null throws ArgumentNullException.", "Virtual dispatch chooses implementation from runtime type.", E461.Verify),
    new(462, "Virtual dispatch and inheritance / scenario 11", "Call virtual Describe through an Animal reference, then append /11. Dog must override description. Null throws ArgumentNullException.", "Virtual dispatch chooses implementation from runtime type.", E462.Verify),
    new(463, "Async Task result composition / scenario 1", "Await operation then add1. Propagate operation exceptions; reject null. Never use Result or Wait.", "await unwraps the result and preserves exception types.", E463.Verify),
    new(464, "Async Task result composition / scenario 2", "Await operation then add2. Propagate operation exceptions; reject null. Never use Result or Wait.", "await unwraps the result and preserves exception types.", E464.Verify),
    new(465, "Async Task result composition / scenario 3", "Await operation then add3. Propagate operation exceptions; reject null. Never use Result or Wait.", "await unwraps the result and preserves exception types.", E465.Verify),
    new(466, "Async Task result composition / scenario 4", "Await operation then add4. Propagate operation exceptions; reject null. Never use Result or Wait.", "await unwraps the result and preserves exception types.", E466.Verify),
    new(467, "Async Task result composition / scenario 5", "Await operation then add5. Propagate operation exceptions; reject null. Never use Result or Wait.", "await unwraps the result and preserves exception types.", E467.Verify),
    new(468, "Async Task result composition / scenario 6", "Await operation then add6. Propagate operation exceptions; reject null. Never use Result or Wait.", "await unwraps the result and preserves exception types.", E468.Verify),
    new(469, "Async Task result composition / scenario 7", "Await operation then add7. Propagate operation exceptions; reject null. Never use Result or Wait.", "await unwraps the result and preserves exception types.", E469.Verify),
    new(470, "Async Task result composition / scenario 8", "Await operation then add8. Propagate operation exceptions; reject null. Never use Result or Wait.", "await unwraps the result and preserves exception types.", E470.Verify),
    new(471, "Async Task result composition / scenario 9", "Await operation then add9. Propagate operation exceptions; reject null. Never use Result or Wait.", "await unwraps the result and preserves exception types.", E471.Verify),
    new(472, "Async Task result composition / scenario 10", "Await operation then add10. Propagate operation exceptions; reject null. Never use Result or Wait.", "await unwraps the result and preserves exception types.", E472.Verify),
    new(473, "Async Task result composition / scenario 11", "Await operation then add11. Propagate operation exceptions; reject null. Never use Result or Wait.", "await unwraps the result and preserves exception types.", E473.Verify),
    new(474, "Task.WhenAll ordering / scenario 1", "Await all operations and return results in input order multiplied by1. Preserve failure propagation. Empty sequence returns[].", "WhenAll result order follows input order, not completion order.", E474.Verify),
    new(475, "Task.WhenAll ordering / scenario 2", "Await all operations and return results in input order multiplied by2. Preserve failure propagation. Empty sequence returns[].", "WhenAll result order follows input order, not completion order.", E475.Verify),
    new(476, "Task.WhenAll ordering / scenario 3", "Await all operations and return results in input order multiplied by3. Preserve failure propagation. Empty sequence returns[].", "WhenAll result order follows input order, not completion order.", E476.Verify),
    new(477, "Task.WhenAll ordering / scenario 4", "Await all operations and return results in input order multiplied by4. Preserve failure propagation. Empty sequence returns[].", "WhenAll result order follows input order, not completion order.", E477.Verify),
    new(478, "Task.WhenAll ordering / scenario 5", "Await all operations and return results in input order multiplied by5. Preserve failure propagation. Empty sequence returns[].", "WhenAll result order follows input order, not completion order.", E478.Verify),
    new(479, "Task.WhenAll ordering / scenario 6", "Await all operations and return results in input order multiplied by6. Preserve failure propagation. Empty sequence returns[].", "WhenAll result order follows input order, not completion order.", E479.Verify),
    new(480, "Task.WhenAll ordering / scenario 7", "Await all operations and return results in input order multiplied by7. Preserve failure propagation. Empty sequence returns[].", "WhenAll result order follows input order, not completion order.", E480.Verify),
    new(481, "Task.WhenAll ordering / scenario 8", "Await all operations and return results in input order multiplied by8. Preserve failure propagation. Empty sequence returns[].", "WhenAll result order follows input order, not completion order.", E481.Verify),
    new(482, "Task.WhenAll ordering / scenario 9", "Await all operations and return results in input order multiplied by9. Preserve failure propagation. Empty sequence returns[].", "WhenAll result order follows input order, not completion order.", E482.Verify),
    new(483, "Task.WhenAll ordering / scenario 10", "Await all operations and return results in input order multiplied by10. Preserve failure propagation. Empty sequence returns[].", "WhenAll result order follows input order, not completion order.", E483.Verify),
    new(484, "Task.WhenAll ordering / scenario 11", "Await all operations and return results in input order multiplied by11. Preserve failure propagation. Empty sequence returns[].", "WhenAll result order follows input order, not completion order.", E484.Verify),
    new(485, "CancellationToken cooperative checks / scenario 1", "Check cancellation before and after one asynchronous yield, then add1. Cancellation must throw OperationCanceledException instead of returning a sentinel.", "Cancellation is cooperative, not automatic termination of arbitrary code.", E485.Verify),
    new(486, "CancellationToken cooperative checks / scenario 2", "Check cancellation before and after one asynchronous yield, then add2. Cancellation must throw OperationCanceledException instead of returning a sentinel.", "Cancellation is cooperative, not automatic termination of arbitrary code.", E486.Verify),
    new(487, "CancellationToken cooperative checks / scenario 3", "Check cancellation before and after one asynchronous yield, then add3. Cancellation must throw OperationCanceledException instead of returning a sentinel.", "Cancellation is cooperative, not automatic termination of arbitrary code.", E487.Verify),
    new(488, "CancellationToken cooperative checks / scenario 4", "Check cancellation before and after one asynchronous yield, then add4. Cancellation must throw OperationCanceledException instead of returning a sentinel.", "Cancellation is cooperative, not automatic termination of arbitrary code.", E488.Verify),
    new(489, "CancellationToken cooperative checks / scenario 5", "Check cancellation before and after one asynchronous yield, then add5. Cancellation must throw OperationCanceledException instead of returning a sentinel.", "Cancellation is cooperative, not automatic termination of arbitrary code.", E489.Verify),
    new(490, "CancellationToken cooperative checks / scenario 6", "Check cancellation before and after one asynchronous yield, then add6. Cancellation must throw OperationCanceledException instead of returning a sentinel.", "Cancellation is cooperative, not automatic termination of arbitrary code.", E490.Verify),
    new(491, "CancellationToken cooperative checks / scenario 7", "Check cancellation before and after one asynchronous yield, then add7. Cancellation must throw OperationCanceledException instead of returning a sentinel.", "Cancellation is cooperative, not automatic termination of arbitrary code.", E491.Verify),
    new(492, "CancellationToken cooperative checks / scenario 8", "Check cancellation before and after one asynchronous yield, then add8. Cancellation must throw OperationCanceledException instead of returning a sentinel.", "Cancellation is cooperative, not automatic termination of arbitrary code.", E492.Verify),
    new(493, "CancellationToken cooperative checks / scenario 9", "Check cancellation before and after one asynchronous yield, then add9. Cancellation must throw OperationCanceledException instead of returning a sentinel.", "Cancellation is cooperative, not automatic termination of arbitrary code.", E493.Verify),
    new(494, "CancellationToken cooperative checks / scenario 10", "Check cancellation before and after one asynchronous yield, then add10. Cancellation must throw OperationCanceledException instead of returning a sentinel.", "Cancellation is cooperative, not automatic termination of arbitrary code.", E494.Verify),
    new(495, "CancellationToken cooperative checks / scenario 11", "Check cancellation before and after one asynchronous yield, then add11. Cancellation must throw OperationCanceledException instead of returning a sentinel.", "Cancellation is cooperative, not automatic termination of arbitrary code.", E495.Verify),
    new(496, "IAsyncEnumerable streaming / scenario 1", "Asynchronously yield0 through0; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.", "An async iterator combines yield return with await; EnumeratorCancellation wires the token.", E496.Verify),
    new(497, "IAsyncEnumerable streaming / scenario 2", "Asynchronously yield0 through1; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.", "An async iterator combines yield return with await; EnumeratorCancellation wires the token.", E497.Verify),
    new(498, "IAsyncEnumerable streaming / scenario 3", "Asynchronously yield0 through2; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.", "An async iterator combines yield return with await; EnumeratorCancellation wires the token.", E498.Verify),
    new(499, "IAsyncEnumerable streaming / scenario 4", "Asynchronously yield0 through3; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.", "An async iterator combines yield return with await; EnumeratorCancellation wires the token.", E499.Verify),
    new(500, "IAsyncEnumerable streaming / scenario 5", "Asynchronously yield0 through4; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.", "An async iterator combines yield return with await; EnumeratorCancellation wires the token.", E500.Verify),
    new(501, "IAsyncEnumerable streaming / scenario 6", "Asynchronously yield0 through5; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.", "An async iterator combines yield return with await; EnumeratorCancellation wires the token.", E501.Verify),
    new(502, "IAsyncEnumerable streaming / scenario 7", "Asynchronously yield0 through6; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.", "An async iterator combines yield return with await; EnumeratorCancellation wires the token.", E502.Verify),
    new(503, "IAsyncEnumerable streaming / scenario 8", "Asynchronously yield0 through7; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.", "An async iterator combines yield return with await; EnumeratorCancellation wires the token.", E503.Verify),
    new(504, "IAsyncEnumerable streaming / scenario 9", "Asynchronously yield0 through8; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.", "An async iterator combines yield return with await; EnumeratorCancellation wires the token.", E504.Verify),
    new(505, "IAsyncEnumerable streaming / scenario 10", "Asynchronously yield0 through9; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.", "An async iterator combines yield return with await; EnumeratorCancellation wires the token.", E505.Verify),
    new(506, "IAsyncEnumerable streaming / scenario 11", "Asynchronously yield0 through10; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.", "An async iterator combines yield return with await; EnumeratorCancellation wires the token.", E506.Verify),
    new(507, "Retry with explicit attempt limits / scenario 1", "Try operation at most1 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.", "An exception filter encodes which failures are retryable.", E507.Verify),
    new(508, "Retry with explicit attempt limits / scenario 2", "Try operation at most2 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.", "An exception filter encodes which failures are retryable.", E508.Verify),
    new(509, "Retry with explicit attempt limits / scenario 3", "Try operation at most3 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.", "An exception filter encodes which failures are retryable.", E509.Verify),
    new(510, "Retry with explicit attempt limits / scenario 4", "Try operation at most4 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.", "An exception filter encodes which failures are retryable.", E510.Verify),
    new(511, "Retry with explicit attempt limits / scenario 5", "Try operation at most5 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.", "An exception filter encodes which failures are retryable.", E511.Verify),
    new(512, "Retry with explicit attempt limits / scenario 6", "Try operation at most6 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.", "An exception filter encodes which failures are retryable.", E512.Verify),
    new(513, "Retry with explicit attempt limits / scenario 7", "Try operation at most7 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.", "An exception filter encodes which failures are retryable.", E513.Verify),
    new(514, "Retry with explicit attempt limits / scenario 8", "Try operation at most8 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.", "An exception filter encodes which failures are retryable.", E514.Verify),
    new(515, "Retry with explicit attempt limits / scenario 9", "Try operation at most9 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.", "An exception filter encodes which failures are retryable.", E515.Verify),
    new(516, "Retry with explicit attempt limits / scenario 10", "Try operation at most10 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.", "An exception filter encodes which failures are retryable.", E516.Verify),
    new(517, "Retry with explicit attempt limits / scenario 11", "Try operation at most11 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.", "An exception filter encodes which failures are retryable.", E517.Verify),
    new(518, "SemaphoreSlim bounded concurrency / scenario 1", "Map values asynchronously with at most1 active workers; preserve result order. Release permits in finally even on failure. Scenario1.", "Acquire before invoking worker, not merely before awaiting its already-started task.", E518.Verify),
    new(519, "SemaphoreSlim bounded concurrency / scenario 2", "Map values asynchronously with at most2 active workers; preserve result order. Release permits in finally even on failure. Scenario2.", "Acquire before invoking worker, not merely before awaiting its already-started task.", E519.Verify),
    new(520, "SemaphoreSlim bounded concurrency / scenario 3", "Map values asynchronously with at most3 active workers; preserve result order. Release permits in finally even on failure. Scenario3.", "Acquire before invoking worker, not merely before awaiting its already-started task.", E520.Verify),
    new(521, "SemaphoreSlim bounded concurrency / scenario 4", "Map values asynchronously with at most4 active workers; preserve result order. Release permits in finally even on failure. Scenario4.", "Acquire before invoking worker, not merely before awaiting its already-started task.", E521.Verify),
    new(522, "SemaphoreSlim bounded concurrency / scenario 5", "Map values asynchronously with at most1 active workers; preserve result order. Release permits in finally even on failure. Scenario5.", "Acquire before invoking worker, not merely before awaiting its already-started task.", E522.Verify),
    new(523, "SemaphoreSlim bounded concurrency / scenario 6", "Map values asynchronously with at most2 active workers; preserve result order. Release permits in finally even on failure. Scenario6.", "Acquire before invoking worker, not merely before awaiting its already-started task.", E523.Verify),
    new(524, "SemaphoreSlim bounded concurrency / scenario 7", "Map values asynchronously with at most3 active workers; preserve result order. Release permits in finally even on failure. Scenario7.", "Acquire before invoking worker, not merely before awaiting its already-started task.", E524.Verify),
    new(525, "SemaphoreSlim bounded concurrency / scenario 8", "Map values asynchronously with at most4 active workers; preserve result order. Release permits in finally even on failure. Scenario8.", "Acquire before invoking worker, not merely before awaiting its already-started task.", E525.Verify),
    new(526, "SemaphoreSlim bounded concurrency / scenario 9", "Map values asynchronously with at most1 active workers; preserve result order. Release permits in finally even on failure. Scenario9.", "Acquire before invoking worker, not merely before awaiting its already-started task.", E526.Verify),
    new(527, "SemaphoreSlim bounded concurrency / scenario 10", "Map values asynchronously with at most2 active workers; preserve result order. Release permits in finally even on failure. Scenario10.", "Acquire before invoking worker, not merely before awaiting its already-started task.", E527.Verify),
    new(528, "SemaphoreSlim bounded concurrency / scenario 11", "Map values asynchronously with at most3 active workers; preserve result order. Release permits in finally even on failure. Scenario11.", "Acquire before invoking worker, not merely before awaiting its already-started task.", E528.Verify),
    new(529, "ConcurrentDictionary atomic increments / scenario 1", "Run workers parallel loops, each incrementing shared key x 2 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.", "Update factories can run more than once under contention.", E529.Verify),
    new(530, "ConcurrentDictionary atomic increments / scenario 2", "Run workers parallel loops, each incrementing shared key x 3 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.", "Update factories can run more than once under contention.", E530.Verify),
    new(531, "ConcurrentDictionary atomic increments / scenario 3", "Run workers parallel loops, each incrementing shared key x 4 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.", "Update factories can run more than once under contention.", E531.Verify),
    new(532, "ConcurrentDictionary atomic increments / scenario 4", "Run workers parallel loops, each incrementing shared key x 5 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.", "Update factories can run more than once under contention.", E532.Verify),
    new(533, "ConcurrentDictionary atomic increments / scenario 5", "Run workers parallel loops, each incrementing shared key x 6 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.", "Update factories can run more than once under contention.", E533.Verify),
    new(534, "ConcurrentDictionary atomic increments / scenario 6", "Run workers parallel loops, each incrementing shared key x 7 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.", "Update factories can run more than once under contention.", E534.Verify),
    new(535, "ConcurrentDictionary atomic increments / scenario 7", "Run workers parallel loops, each incrementing shared key x 8 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.", "Update factories can run more than once under contention.", E535.Verify),
    new(536, "ConcurrentDictionary atomic increments / scenario 8", "Run workers parallel loops, each incrementing shared key x 9 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.", "Update factories can run more than once under contention.", E536.Verify),
    new(537, "ConcurrentDictionary atomic increments / scenario 9", "Run workers parallel loops, each incrementing shared key x 10 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.", "Update factories can run more than once under contention.", E537.Verify),
    new(538, "ConcurrentDictionary atomic increments / scenario 10", "Run workers parallel loops, each incrementing shared key x 11 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.", "Update factories can run more than once under contention.", E538.Verify),
    new(539, "ConcurrentDictionary atomic increments / scenario 11", "Run workers parallel loops, each incrementing shared key x 12 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.", "Update factories can run more than once under contention.", E539.Verify),
    new(540, "System.Threading.Channels flow / scenario 1", "Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by1. Preserve order. No leaked reader waiting for completion.", "ReadAllAsync finishes only after writer completion and buffer drainage.", E540.Verify),
    new(541, "System.Threading.Channels flow / scenario 2", "Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by2. Preserve order. No leaked reader waiting for completion.", "ReadAllAsync finishes only after writer completion and buffer drainage.", E541.Verify),
    new(542, "System.Threading.Channels flow / scenario 3", "Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by3. Preserve order. No leaked reader waiting for completion.", "ReadAllAsync finishes only after writer completion and buffer drainage.", E542.Verify),
    new(543, "System.Threading.Channels flow / scenario 4", "Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by4. Preserve order. No leaked reader waiting for completion.", "ReadAllAsync finishes only after writer completion and buffer drainage.", E543.Verify),
    new(544, "System.Threading.Channels flow / scenario 5", "Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by5. Preserve order. No leaked reader waiting for completion.", "ReadAllAsync finishes only after writer completion and buffer drainage.", E544.Verify),
    new(545, "System.Threading.Channels flow / scenario 6", "Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by6. Preserve order. No leaked reader waiting for completion.", "ReadAllAsync finishes only after writer completion and buffer drainage.", E545.Verify),
    new(546, "System.Threading.Channels flow / scenario 7", "Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by7. Preserve order. No leaked reader waiting for completion.", "ReadAllAsync finishes only after writer completion and buffer drainage.", E546.Verify),
    new(547, "System.Threading.Channels flow / scenario 8", "Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by8. Preserve order. No leaked reader waiting for completion.", "ReadAllAsync finishes only after writer completion and buffer drainage.", E547.Verify),
    new(548, "System.Threading.Channels flow / scenario 9", "Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by9. Preserve order. No leaked reader waiting for completion.", "ReadAllAsync finishes only after writer completion and buffer drainage.", E548.Verify),
    new(549, "System.Threading.Channels flow / scenario 10", "Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by10. Preserve order. No leaked reader waiting for completion.", "ReadAllAsync finishes only after writer completion and buffer drainage.", E549.Verify),
    new(550, "System.Threading.Channels flow / scenario 11", "Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by11. Preserve order. No leaked reader waiting for completion.", "ReadAllAsync finishes only after writer completion and buffer drainage.", E550.Verify),
    new(551, "StringReader line processing / scenario 1", "Read CRLF/LF/CR lines, trim each, retain lines of length>=1. Dispose reader. Trailing newline does not create a retained blank line.", "ReadLine returns null at end, distinct from an empty line.", E551.Verify),
    new(552, "StringReader line processing / scenario 2", "Read CRLF/LF/CR lines, trim each, retain lines of length>=2. Dispose reader. Trailing newline does not create a retained blank line.", "ReadLine returns null at end, distinct from an empty line.", E552.Verify),
    new(553, "StringReader line processing / scenario 3", "Read CRLF/LF/CR lines, trim each, retain lines of length>=3. Dispose reader. Trailing newline does not create a retained blank line.", "ReadLine returns null at end, distinct from an empty line.", E553.Verify),
    new(554, "StringReader line processing / scenario 4", "Read CRLF/LF/CR lines, trim each, retain lines of length>=4. Dispose reader. Trailing newline does not create a retained blank line.", "ReadLine returns null at end, distinct from an empty line.", E554.Verify),
    new(555, "StringReader line processing / scenario 5", "Read CRLF/LF/CR lines, trim each, retain lines of length>=5. Dispose reader. Trailing newline does not create a retained blank line.", "ReadLine returns null at end, distinct from an empty line.", E555.Verify),
    new(556, "StringReader line processing / scenario 6", "Read CRLF/LF/CR lines, trim each, retain lines of length>=6. Dispose reader. Trailing newline does not create a retained blank line.", "ReadLine returns null at end, distinct from an empty line.", E556.Verify),
    new(557, "StringReader line processing / scenario 7", "Read CRLF/LF/CR lines, trim each, retain lines of length>=7. Dispose reader. Trailing newline does not create a retained blank line.", "ReadLine returns null at end, distinct from an empty line.", E557.Verify),
    new(558, "StringReader line processing / scenario 8", "Read CRLF/LF/CR lines, trim each, retain lines of length>=8. Dispose reader. Trailing newline does not create a retained blank line.", "ReadLine returns null at end, distinct from an empty line.", E558.Verify),
    new(559, "StringReader line processing / scenario 9", "Read CRLF/LF/CR lines, trim each, retain lines of length>=9. Dispose reader. Trailing newline does not create a retained blank line.", "ReadLine returns null at end, distinct from an empty line.", E559.Verify),
    new(560, "StringReader line processing / scenario 10", "Read CRLF/LF/CR lines, trim each, retain lines of length>=10. Dispose reader. Trailing newline does not create a retained blank line.", "ReadLine returns null at end, distinct from an empty line.", E560.Verify),
    new(561, "StringReader line processing / scenario 11", "Read CRLF/LF/CR lines, trim each, retain lines of length>=11. Dispose reader. Trailing newline does not create a retained blank line.", "ReadLine returns null at end, distinct from an empty line.", E561.Verify),
    new(562, "Exception filters and domain errors / scenario 1", "Negative input throws ArgumentOutOfRangeException. Nonnegative input below1 becomes retry through an exception filter catching only InvalidOperationException(\"small\"). At/above threshold returns ok.", "Do not catch Exception broadly and hide programming errors.", E562.Verify),
    new(563, "Exception filters and domain errors / scenario 2", "Negative input throws ArgumentOutOfRangeException. Nonnegative input below2 becomes retry through an exception filter catching only InvalidOperationException(\"small\"). At/above threshold returns ok.", "Do not catch Exception broadly and hide programming errors.", E563.Verify),
    new(564, "Exception filters and domain errors / scenario 3", "Negative input throws ArgumentOutOfRangeException. Nonnegative input below3 becomes retry through an exception filter catching only InvalidOperationException(\"small\"). At/above threshold returns ok.", "Do not catch Exception broadly and hide programming errors.", E564.Verify),
    new(565, "Exception filters and domain errors / scenario 4", "Negative input throws ArgumentOutOfRangeException. Nonnegative input below4 becomes retry through an exception filter catching only InvalidOperationException(\"small\"). At/above threshold returns ok.", "Do not catch Exception broadly and hide programming errors.", E565.Verify),
    new(566, "Exception filters and domain errors / scenario 5", "Negative input throws ArgumentOutOfRangeException. Nonnegative input below5 becomes retry through an exception filter catching only InvalidOperationException(\"small\"). At/above threshold returns ok.", "Do not catch Exception broadly and hide programming errors.", E566.Verify),
    new(567, "Exception filters and domain errors / scenario 6", "Negative input throws ArgumentOutOfRangeException. Nonnegative input below6 becomes retry through an exception filter catching only InvalidOperationException(\"small\"). At/above threshold returns ok.", "Do not catch Exception broadly and hide programming errors.", E567.Verify),
    new(568, "Exception filters and domain errors / scenario 7", "Negative input throws ArgumentOutOfRangeException. Nonnegative input below7 becomes retry through an exception filter catching only InvalidOperationException(\"small\"). At/above threshold returns ok.", "Do not catch Exception broadly and hide programming errors.", E568.Verify),
    new(569, "Exception filters and domain errors / scenario 8", "Negative input throws ArgumentOutOfRangeException. Nonnegative input below8 becomes retry through an exception filter catching only InvalidOperationException(\"small\"). At/above threshold returns ok.", "Do not catch Exception broadly and hide programming errors.", E569.Verify),
    new(570, "Exception filters and domain errors / scenario 9", "Negative input throws ArgumentOutOfRangeException. Nonnegative input below9 becomes retry through an exception filter catching only InvalidOperationException(\"small\"). At/above threshold returns ok.", "Do not catch Exception broadly and hide programming errors.", E570.Verify),
    new(571, "Exception filters and domain errors / scenario 10", "Negative input throws ArgumentOutOfRangeException. Nonnegative input below10 becomes retry through an exception filter catching only InvalidOperationException(\"small\"). At/above threshold returns ok.", "Do not catch Exception broadly and hide programming errors.", E571.Verify),
    new(572, "Exception filters and domain errors / scenario 11", "Negative input throws ArgumentOutOfRangeException. Nonnegative input below11 becomes retry through an exception filter catching only InvalidOperationException(\"small\"). At/above threshold returns ok.", "Do not catch Exception broadly and hide programming errors.", E572.Verify),
    new(573, "StringBuilder delimited formatting / scenario 1", "Format prefix 'S0:' followed by values joined with '|'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.", "A first-item flag distinguishes empty sequence from an empty element.", E573.Verify),
    new(574, "StringBuilder delimited formatting / scenario 2", "Format prefix 'S1:' followed by values joined with ','. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.", "A first-item flag distinguishes empty sequence from an empty element.", E574.Verify),
    new(575, "StringBuilder delimited formatting / scenario 3", "Format prefix 'S2:' followed by values joined with ';'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.", "A first-item flag distinguishes empty sequence from an empty element.", E575.Verify),
    new(576, "StringBuilder delimited formatting / scenario 4", "Format prefix 'S3:' followed by values joined with ':'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.", "A first-item flag distinguishes empty sequence from an empty element.", E576.Verify),
    new(577, "StringBuilder delimited formatting / scenario 5", "Format prefix 'S4:' followed by values joined with '/'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.", "A first-item flag distinguishes empty sequence from an empty element.", E577.Verify),
    new(578, "StringBuilder delimited formatting / scenario 6", "Format prefix 'S5:' followed by values joined with '|'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.", "A first-item flag distinguishes empty sequence from an empty element.", E578.Verify),
    new(579, "StringBuilder delimited formatting / scenario 7", "Format prefix 'S6:' followed by values joined with ','. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.", "A first-item flag distinguishes empty sequence from an empty element.", E579.Verify),
    new(580, "StringBuilder delimited formatting / scenario 8", "Format prefix 'S7:' followed by values joined with ';'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.", "A first-item flag distinguishes empty sequence from an empty element.", E580.Verify),
    new(581, "StringBuilder delimited formatting / scenario 9", "Format prefix 'S8:' followed by values joined with ':'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.", "A first-item flag distinguishes empty sequence from an empty element.", E581.Verify),
    new(582, "StringBuilder delimited formatting / scenario 10", "Format prefix 'S9:' followed by values joined with '/'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.", "A first-item flag distinguishes empty sequence from an empty element.", E582.Verify),
    new(583, "StringBuilder delimited formatting / scenario 11", "Format prefix 'S10:' followed by values joined with '|'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.", "A first-item flag distinguishes empty sequence from an empty element.", E583.Verify),
};
if(exercises.Length!=583 || !exercises.Select(e=>e.Id).SequenceEqual(Enumerable.Range(1,583)))throw new Exception("Exercise inventory mismatch");
if(args.Length==0 || args[0]=="--help") { Console.WriteLine("UNIONBOOT C# —583 exercises\n--list | --show ID | --verify [ID] | --practice ID\nPractice methods intentionally throw until implemented.\n53 topic families,11 scenario variants each. No dependencies beyond .NET10.\nSearch for class E001 etc. in this source file to edit. Reference solutions share the class.\nA test may use more than one assertion. No tasks access the network or your files."); return; }
if(args[0]=="--list"){foreach(var e in exercises)Console.WriteLine($"{e.Id:000} {e.Title}");return;}
if(args[0] is not ("--verify" or "--practice" or "--show")){Console.Error.WriteLine("Unknown command");Environment.ExitCode=2;return;}
int? id=null;if(args.Length>1){if(!int.TryParse(args[1],out var parsed)||parsed<1||parsed>583){Console.Error.WriteLine("ID must be1–583");Environment.ExitCode=2;return;}id=parsed;}
if((args[0]=="--show"||args[0]=="--practice")&&id is null){Console.Error.WriteLine("Specify an ID");Environment.ExitCode=2;return;}
if(args[0]=="--show"){var e=exercises[id!.Value-1];Console.WriteLine($"{e.Id:000} {e.Title}\n\n{e.Requirements}\n\nHint: {e.Hint}\n\nEdit E{e.Id:000}.Practice. Read E{e.Id:000}.Reference for the solution; Verify contains examples.");return;}
Check.PracticeMode=args[0]=="--practice";
int passed=0,failed=0;var selected=id is null?exercises:exercises.Where(e=>e.Id==id).ToArray();
foreach(var e in selected){try{e.Verify();passed++;Console.WriteLine($"PASS {e.Id:000} {e.Title}");}catch(Exception error){failed++;Console.Error.WriteLine($"FAIL {e.Id:000} {e.Title}: {error.GetType().Name}: {error.Message}");}}
Console.WriteLine($"{(Check.PracticeMode?"Practice":"Reference")}: {passed} passed, {failed} failed; {Check.Assertions} assertions; {selected.Length} exercise groups.");
Environment.ExitCode=failed==0?0:1;

sealed record Exercise(int Id,string Title,string Requirements,string Hint,Action Verify);
static class Check {
 public static bool PracticeMode { get; set; }
 public static int Assertions { get; private set; }
 private static readonly JsonSerializerOptions Options=new(){IncludeFields=true};
 public static void Equal<T>(T expected,T actual){Assertions++;if(typeof(T).IsValueType){if(!EqualityComparer<T>.Default.Equals(expected,actual))throw new Exception($"Expected {expected}, got {actual}");return;}var a=JsonSerializer.Serialize(expected,Options);var b=JsonSerializer.Serialize(actual,Options);if(a!=b)throw new Exception($"Expected {a}, got {b}");}
 public static void True(bool value){Assertions++;if(!value)throw new Exception("Expected true");}
 public static void Throws<T>(Action action) where T:Exception{Assertions++;try{action();}catch(T){return;}catch(Exception e){throw new Exception($"Expected {typeof(T).Name}, got {e.GetType().Name}",e);}throw new Exception($"Expected {typeof(T).Name}, no exception thrown");}
}

// ======================================================================
// 1: Checked integer accumulation / scenario 1
// Sum only values >= 1. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.
// Hint: Accumulate into long before adding; a LINQ int Sum can overflow.
// Practice: --practice 1; reference: --verify 1
static class E001 {

 public static long Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 1");
 }
 public static long Reference(IReadOnlyList<int> values) {
  long total = 0; foreach (var value in values) if (value >= 1) total += value; return total;
 }
 private static long Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(0L, Solve(Array.Empty<int>()));
  Check.Equal(5L, Solve(new int[] { 0, 1, 4 }));
  Check.Equal(4294967294L, Solve(new[] { int.MaxValue, int.MaxValue }));
 }
}

// ======================================================================
// 2: Checked integer accumulation / scenario 2
// Sum only values >= 2. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.
// Hint: Accumulate into long before adding; a LINQ int Sum can overflow.
// Practice: --practice 2; reference: --verify 2
static class E002 {

 public static long Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 2");
 }
 public static long Reference(IReadOnlyList<int> values) {
  long total = 0; foreach (var value in values) if (value >= 2) total += value; return total;
 }
 private static long Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(0L, Solve(Array.Empty<int>()));
  Check.Equal(7L, Solve(new int[] { 1, 2, 5 }));
  Check.Equal(4294967294L, Solve(new[] { int.MaxValue, int.MaxValue }));
 }
}

// ======================================================================
// 3: Checked integer accumulation / scenario 3
// Sum only values >= 3. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.
// Hint: Accumulate into long before adding; a LINQ int Sum can overflow.
// Practice: --practice 3; reference: --verify 3
static class E003 {

 public static long Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 3");
 }
 public static long Reference(IReadOnlyList<int> values) {
  long total = 0; foreach (var value in values) if (value >= 3) total += value; return total;
 }
 private static long Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(0L, Solve(Array.Empty<int>()));
  Check.Equal(9L, Solve(new int[] { 2, 3, 6 }));
  Check.Equal(4294967294L, Solve(new[] { int.MaxValue, int.MaxValue }));
 }
}

// ======================================================================
// 4: Checked integer accumulation / scenario 4
// Sum only values >= 4. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.
// Hint: Accumulate into long before adding; a LINQ int Sum can overflow.
// Practice: --practice 4; reference: --verify 4
static class E004 {

 public static long Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 4");
 }
 public static long Reference(IReadOnlyList<int> values) {
  long total = 0; foreach (var value in values) if (value >= 4) total += value; return total;
 }
 private static long Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(0L, Solve(Array.Empty<int>()));
  Check.Equal(11L, Solve(new int[] { 3, 4, 7 }));
  Check.Equal(4294967294L, Solve(new[] { int.MaxValue, int.MaxValue }));
 }
}

// ======================================================================
// 5: Checked integer accumulation / scenario 5
// Sum only values >= 5. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.
// Hint: Accumulate into long before adding; a LINQ int Sum can overflow.
// Practice: --practice 5; reference: --verify 5
static class E005 {

 public static long Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 5");
 }
 public static long Reference(IReadOnlyList<int> values) {
  long total = 0; foreach (var value in values) if (value >= 5) total += value; return total;
 }
 private static long Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(0L, Solve(Array.Empty<int>()));
  Check.Equal(13L, Solve(new int[] { 4, 5, 8 }));
  Check.Equal(4294967294L, Solve(new[] { int.MaxValue, int.MaxValue }));
 }
}

// ======================================================================
// 6: Checked integer accumulation / scenario 6
// Sum only values >= 6. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.
// Hint: Accumulate into long before adding; a LINQ int Sum can overflow.
// Practice: --practice 6; reference: --verify 6
static class E006 {

 public static long Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 6");
 }
 public static long Reference(IReadOnlyList<int> values) {
  long total = 0; foreach (var value in values) if (value >= 6) total += value; return total;
 }
 private static long Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(0L, Solve(Array.Empty<int>()));
  Check.Equal(15L, Solve(new int[] { 5, 6, 9 }));
  Check.Equal(4294967294L, Solve(new[] { int.MaxValue, int.MaxValue }));
 }
}

// ======================================================================
// 7: Checked integer accumulation / scenario 7
// Sum only values >= 7. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.
// Hint: Accumulate into long before adding; a LINQ int Sum can overflow.
// Practice: --practice 7; reference: --verify 7
static class E007 {

 public static long Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 7");
 }
 public static long Reference(IReadOnlyList<int> values) {
  long total = 0; foreach (var value in values) if (value >= 7) total += value; return total;
 }
 private static long Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(0L, Solve(Array.Empty<int>()));
  Check.Equal(17L, Solve(new int[] { 6, 7, 10 }));
  Check.Equal(4294967294L, Solve(new[] { int.MaxValue, int.MaxValue }));
 }
}

// ======================================================================
// 8: Checked integer accumulation / scenario 8
// Sum only values >= 8. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.
// Hint: Accumulate into long before adding; a LINQ int Sum can overflow.
// Practice: --practice 8; reference: --verify 8
static class E008 {

 public static long Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 8");
 }
 public static long Reference(IReadOnlyList<int> values) {
  long total = 0; foreach (var value in values) if (value >= 8) total += value; return total;
 }
 private static long Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(0L, Solve(Array.Empty<int>()));
  Check.Equal(19L, Solve(new int[] { 7, 8, 11 }));
  Check.Equal(4294967294L, Solve(new[] { int.MaxValue, int.MaxValue }));
 }
}

// ======================================================================
// 9: Checked integer accumulation / scenario 9
// Sum only values >= 9. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.
// Hint: Accumulate into long before adding; a LINQ int Sum can overflow.
// Practice: --practice 9; reference: --verify 9
static class E009 {

 public static long Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 9");
 }
 public static long Reference(IReadOnlyList<int> values) {
  long total = 0; foreach (var value in values) if (value >= 9) total += value; return total;
 }
 private static long Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(0L, Solve(Array.Empty<int>()));
  Check.Equal(21L, Solve(new int[] { 8, 9, 12 }));
  Check.Equal(4294967294L, Solve(new[] { int.MaxValue, int.MaxValue }));
 }
}

// ======================================================================
// 10: Checked integer accumulation / scenario 10
// Sum only values >= 10. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.
// Hint: Accumulate into long before adding; a LINQ int Sum can overflow.
// Practice: --practice 10; reference: --verify 10
static class E010 {

 public static long Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 10");
 }
 public static long Reference(IReadOnlyList<int> values) {
  long total = 0; foreach (var value in values) if (value >= 10) total += value; return total;
 }
 private static long Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(0L, Solve(Array.Empty<int>()));
  Check.Equal(23L, Solve(new int[] { 9, 10, 13 }));
  Check.Equal(4294967294L, Solve(new[] { int.MaxValue, int.MaxValue }));
 }
}

// ======================================================================
// 11: Checked integer accumulation / scenario 11
// Sum only values >= 11. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.
// Hint: Accumulate into long before adding; a LINQ int Sum can overflow.
// Practice: --practice 11; reference: --verify 11
static class E011 {

 public static long Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 11");
 }
 public static long Reference(IReadOnlyList<int> values) {
  long total = 0; foreach (var value in values) if (value >= 11) total += value; return total;
 }
 private static long Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(0L, Solve(Array.Empty<int>()));
  Check.Equal(25L, Solve(new int[] { 10, 11, 14 }));
  Check.Equal(4294967294L, Solve(new[] { int.MaxValue, int.MaxValue }));
 }
}

// ======================================================================
// 12: Stable LINQ filtering and projection / scenario 1
// Select integers divisible by 2, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.
// Hint: Filtering is lazy until ToArray materializes it.
// Practice: --practice 12; reference: --verify 12
static class E012 {

 public static string[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 12");
 }
 public static string[] Reference(IEnumerable<int> values) {
  return values.Where(n => n % 2 == 0).Select(n => $"item:{n}").ToArray();
 }
 private static string[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new string[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new string[] { "item:2", "item:-2", "item:2" }, Solve(new int[] { 2, 1, -2, 2 }));
  Check.Equal(new string[] { "item:0" }, Solve(new int[] { 0, 3 }));
 }
}

// ======================================================================
// 13: Stable LINQ filtering and projection / scenario 2
// Select integers divisible by 3, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.
// Hint: Filtering is lazy until ToArray materializes it.
// Practice: --practice 13; reference: --verify 13
static class E013 {

 public static string[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 13");
 }
 public static string[] Reference(IEnumerable<int> values) {
  return values.Where(n => n % 3 == 0).Select(n => $"item:{n}").ToArray();
 }
 private static string[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new string[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new string[] { "item:3", "item:-3", "item:3" }, Solve(new int[] { 3, 1, -3, 3 }));
  Check.Equal(new string[] { "item:0" }, Solve(new int[] { 0, 4 }));
 }
}

// ======================================================================
// 14: Stable LINQ filtering and projection / scenario 3
// Select integers divisible by 4, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.
// Hint: Filtering is lazy until ToArray materializes it.
// Practice: --practice 14; reference: --verify 14
static class E014 {

 public static string[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 14");
 }
 public static string[] Reference(IEnumerable<int> values) {
  return values.Where(n => n % 4 == 0).Select(n => $"item:{n}").ToArray();
 }
 private static string[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new string[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new string[] { "item:4", "item:-4", "item:4" }, Solve(new int[] { 4, 1, -4, 4 }));
  Check.Equal(new string[] { "item:0" }, Solve(new int[] { 0, 5 }));
 }
}

// ======================================================================
// 15: Stable LINQ filtering and projection / scenario 4
// Select integers divisible by 5, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.
// Hint: Filtering is lazy until ToArray materializes it.
// Practice: --practice 15; reference: --verify 15
static class E015 {

 public static string[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 15");
 }
 public static string[] Reference(IEnumerable<int> values) {
  return values.Where(n => n % 5 == 0).Select(n => $"item:{n}").ToArray();
 }
 private static string[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new string[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new string[] { "item:5", "item:-5", "item:5" }, Solve(new int[] { 5, 1, -5, 5 }));
  Check.Equal(new string[] { "item:0" }, Solve(new int[] { 0, 6 }));
 }
}

// ======================================================================
// 16: Stable LINQ filtering and projection / scenario 5
// Select integers divisible by 6, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.
// Hint: Filtering is lazy until ToArray materializes it.
// Practice: --practice 16; reference: --verify 16
static class E016 {

 public static string[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 16");
 }
 public static string[] Reference(IEnumerable<int> values) {
  return values.Where(n => n % 6 == 0).Select(n => $"item:{n}").ToArray();
 }
 private static string[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new string[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new string[] { "item:6", "item:-6", "item:6" }, Solve(new int[] { 6, 1, -6, 6 }));
  Check.Equal(new string[] { "item:0" }, Solve(new int[] { 0, 7 }));
 }
}

// ======================================================================
// 17: Stable LINQ filtering and projection / scenario 6
// Select integers divisible by 7, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.
// Hint: Filtering is lazy until ToArray materializes it.
// Practice: --practice 17; reference: --verify 17
static class E017 {

 public static string[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 17");
 }
 public static string[] Reference(IEnumerable<int> values) {
  return values.Where(n => n % 7 == 0).Select(n => $"item:{n}").ToArray();
 }
 private static string[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new string[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new string[] { "item:7", "item:-7", "item:7" }, Solve(new int[] { 7, 1, -7, 7 }));
  Check.Equal(new string[] { "item:0" }, Solve(new int[] { 0, 8 }));
 }
}

// ======================================================================
// 18: Stable LINQ filtering and projection / scenario 7
// Select integers divisible by 8, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.
// Hint: Filtering is lazy until ToArray materializes it.
// Practice: --practice 18; reference: --verify 18
static class E018 {

 public static string[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 18");
 }
 public static string[] Reference(IEnumerable<int> values) {
  return values.Where(n => n % 8 == 0).Select(n => $"item:{n}").ToArray();
 }
 private static string[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new string[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new string[] { "item:8", "item:-8", "item:8" }, Solve(new int[] { 8, 1, -8, 8 }));
  Check.Equal(new string[] { "item:0" }, Solve(new int[] { 0, 9 }));
 }
}

// ======================================================================
// 19: Stable LINQ filtering and projection / scenario 8
// Select integers divisible by 9, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.
// Hint: Filtering is lazy until ToArray materializes it.
// Practice: --practice 19; reference: --verify 19
static class E019 {

 public static string[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 19");
 }
 public static string[] Reference(IEnumerable<int> values) {
  return values.Where(n => n % 9 == 0).Select(n => $"item:{n}").ToArray();
 }
 private static string[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new string[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new string[] { "item:9", "item:-9", "item:9" }, Solve(new int[] { 9, 1, -9, 9 }));
  Check.Equal(new string[] { "item:0" }, Solve(new int[] { 0, 10 }));
 }
}

// ======================================================================
// 20: Stable LINQ filtering and projection / scenario 9
// Select integers divisible by 10, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.
// Hint: Filtering is lazy until ToArray materializes it.
// Practice: --practice 20; reference: --verify 20
static class E020 {

 public static string[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 20");
 }
 public static string[] Reference(IEnumerable<int> values) {
  return values.Where(n => n % 10 == 0).Select(n => $"item:{n}").ToArray();
 }
 private static string[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new string[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new string[] { "item:10", "item:-10", "item:10" }, Solve(new int[] { 10, 1, -10, 10 }));
  Check.Equal(new string[] { "item:0" }, Solve(new int[] { 0, 11 }));
 }
}

// ======================================================================
// 21: Stable LINQ filtering and projection / scenario 10
// Select integers divisible by 11, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.
// Hint: Filtering is lazy until ToArray materializes it.
// Practice: --practice 21; reference: --verify 21
static class E021 {

 public static string[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 21");
 }
 public static string[] Reference(IEnumerable<int> values) {
  return values.Where(n => n % 11 == 0).Select(n => $"item:{n}").ToArray();
 }
 private static string[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new string[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new string[] { "item:11", "item:-11", "item:11" }, Solve(new int[] { 11, 1, -11, 11 }));
  Check.Equal(new string[] { "item:0" }, Solve(new int[] { 0, 12 }));
 }
}

// ======================================================================
// 22: Stable LINQ filtering and projection / scenario 11
// Select integers divisible by 12, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.
// Hint: Filtering is lazy until ToArray materializes it.
// Practice: --practice 22; reference: --verify 22
static class E022 {

 public static string[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 22");
 }
 public static string[] Reference(IEnumerable<int> values) {
  return values.Where(n => n % 12 == 0).Select(n => $"item:{n}").ToArray();
 }
 private static string[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new string[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new string[] { "item:12", "item:-12", "item:12" }, Solve(new int[] { 12, 1, -12, 12 }));
  Check.Equal(new string[] { "item:0" }, Solve(new int[] { 0, 13 }));
 }
}

// ======================================================================
// 23: Dictionary frequency counting / scenario 1
// Count words with ordinal case-sensitive comparison. Retain counts >=1; sort output keys ordinally. Empty input returns an empty dictionary.
// Hint: Dictionary comparison and output normalization are separate choices.
// Practice: --practice 23; reference: --verify 23
static class E023 {

 public static SortedDictionary<string, int> Practice(IEnumerable<string> words) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 23");
 }
 public static SortedDictionary<string, int> Reference(IEnumerable<string> words) {
  var counts = new Dictionary<string,int>(StringComparer.Ordinal); foreach (var word in words) { var key = word; counts[key] = counts.GetValueOrDefault(key) + 1; } var result = new SortedDictionary<string,int>(StringComparer.Ordinal); foreach (var pair in counts) if (pair.Value >= 1) result[pair.Key] = pair.Value; return result;
 }
 private static SortedDictionary<string, int> Solve(IEnumerable<string> words) => Check.PracticeMode ? Practice(words) : Reference(words);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int>(), Solve(Array.Empty<string>()));
  Check.Equal(new SortedDictionary<string,int> { ["Tea"] = 1 }, Solve(Enumerable.Repeat("Tea", 1)));
  Check.Equal(new SortedDictionary<string,int>(), Solve(Enumerable.Repeat("x", 0)));
 }
}

// ======================================================================
// 24: Dictionary frequency counting / scenario 2
// Count words with ordinal case-insensitive comparison and lowercase output keys. Retain counts >=2; sort output keys ordinally. Empty input returns an empty dictionary.
// Hint: Dictionary comparison and output normalization are separate choices.
// Practice: --practice 24; reference: --verify 24
static class E024 {

 public static SortedDictionary<string, int> Practice(IEnumerable<string> words) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 24");
 }
 public static SortedDictionary<string, int> Reference(IEnumerable<string> words) {
  var counts = new Dictionary<string,int>(StringComparer.OrdinalIgnoreCase); foreach (var word in words) { var key = word.ToLowerInvariant(); counts[key] = counts.GetValueOrDefault(key) + 1; } var result = new SortedDictionary<string,int>(StringComparer.Ordinal); foreach (var pair in counts) if (pair.Value >= 2) result[pair.Key] = pair.Value; return result;
 }
 private static SortedDictionary<string, int> Solve(IEnumerable<string> words) => Check.PracticeMode ? Practice(words) : Reference(words);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int>(), Solve(Array.Empty<string>()));
  Check.Equal(new SortedDictionary<string,int> { ["tea"] = 2 }, Solve(Enumerable.Repeat("Tea", 2)));
  Check.Equal(new SortedDictionary<string,int>(), Solve(Enumerable.Repeat("x", 1)));
 }
}

// ======================================================================
// 25: Dictionary frequency counting / scenario 3
// Count words with ordinal case-sensitive comparison. Retain counts >=3; sort output keys ordinally. Empty input returns an empty dictionary.
// Hint: Dictionary comparison and output normalization are separate choices.
// Practice: --practice 25; reference: --verify 25
static class E025 {

 public static SortedDictionary<string, int> Practice(IEnumerable<string> words) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 25");
 }
 public static SortedDictionary<string, int> Reference(IEnumerable<string> words) {
  var counts = new Dictionary<string,int>(StringComparer.Ordinal); foreach (var word in words) { var key = word; counts[key] = counts.GetValueOrDefault(key) + 1; } var result = new SortedDictionary<string,int>(StringComparer.Ordinal); foreach (var pair in counts) if (pair.Value >= 3) result[pair.Key] = pair.Value; return result;
 }
 private static SortedDictionary<string, int> Solve(IEnumerable<string> words) => Check.PracticeMode ? Practice(words) : Reference(words);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int>(), Solve(Array.Empty<string>()));
  Check.Equal(new SortedDictionary<string,int> { ["Tea"] = 3 }, Solve(Enumerable.Repeat("Tea", 3)));
  Check.Equal(new SortedDictionary<string,int>(), Solve(Enumerable.Repeat("x", 2)));
 }
}

// ======================================================================
// 26: Dictionary frequency counting / scenario 4
// Count words with ordinal case-insensitive comparison and lowercase output keys. Retain counts >=4; sort output keys ordinally. Empty input returns an empty dictionary.
// Hint: Dictionary comparison and output normalization are separate choices.
// Practice: --practice 26; reference: --verify 26
static class E026 {

 public static SortedDictionary<string, int> Practice(IEnumerable<string> words) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 26");
 }
 public static SortedDictionary<string, int> Reference(IEnumerable<string> words) {
  var counts = new Dictionary<string,int>(StringComparer.OrdinalIgnoreCase); foreach (var word in words) { var key = word.ToLowerInvariant(); counts[key] = counts.GetValueOrDefault(key) + 1; } var result = new SortedDictionary<string,int>(StringComparer.Ordinal); foreach (var pair in counts) if (pair.Value >= 4) result[pair.Key] = pair.Value; return result;
 }
 private static SortedDictionary<string, int> Solve(IEnumerable<string> words) => Check.PracticeMode ? Practice(words) : Reference(words);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int>(), Solve(Array.Empty<string>()));
  Check.Equal(new SortedDictionary<string,int> { ["tea"] = 4 }, Solve(Enumerable.Repeat("Tea", 4)));
  Check.Equal(new SortedDictionary<string,int>(), Solve(Enumerable.Repeat("x", 3)));
 }
}

// ======================================================================
// 27: Dictionary frequency counting / scenario 5
// Count words with ordinal case-sensitive comparison. Retain counts >=5; sort output keys ordinally. Empty input returns an empty dictionary.
// Hint: Dictionary comparison and output normalization are separate choices.
// Practice: --practice 27; reference: --verify 27
static class E027 {

 public static SortedDictionary<string, int> Practice(IEnumerable<string> words) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 27");
 }
 public static SortedDictionary<string, int> Reference(IEnumerable<string> words) {
  var counts = new Dictionary<string,int>(StringComparer.Ordinal); foreach (var word in words) { var key = word; counts[key] = counts.GetValueOrDefault(key) + 1; } var result = new SortedDictionary<string,int>(StringComparer.Ordinal); foreach (var pair in counts) if (pair.Value >= 5) result[pair.Key] = pair.Value; return result;
 }
 private static SortedDictionary<string, int> Solve(IEnumerable<string> words) => Check.PracticeMode ? Practice(words) : Reference(words);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int>(), Solve(Array.Empty<string>()));
  Check.Equal(new SortedDictionary<string,int> { ["Tea"] = 5 }, Solve(Enumerable.Repeat("Tea", 5)));
  Check.Equal(new SortedDictionary<string,int>(), Solve(Enumerable.Repeat("x", 4)));
 }
}

// ======================================================================
// 28: Dictionary frequency counting / scenario 6
// Count words with ordinal case-insensitive comparison and lowercase output keys. Retain counts >=6; sort output keys ordinally. Empty input returns an empty dictionary.
// Hint: Dictionary comparison and output normalization are separate choices.
// Practice: --practice 28; reference: --verify 28
static class E028 {

 public static SortedDictionary<string, int> Practice(IEnumerable<string> words) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 28");
 }
 public static SortedDictionary<string, int> Reference(IEnumerable<string> words) {
  var counts = new Dictionary<string,int>(StringComparer.OrdinalIgnoreCase); foreach (var word in words) { var key = word.ToLowerInvariant(); counts[key] = counts.GetValueOrDefault(key) + 1; } var result = new SortedDictionary<string,int>(StringComparer.Ordinal); foreach (var pair in counts) if (pair.Value >= 6) result[pair.Key] = pair.Value; return result;
 }
 private static SortedDictionary<string, int> Solve(IEnumerable<string> words) => Check.PracticeMode ? Practice(words) : Reference(words);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int>(), Solve(Array.Empty<string>()));
  Check.Equal(new SortedDictionary<string,int> { ["tea"] = 6 }, Solve(Enumerable.Repeat("Tea", 6)));
  Check.Equal(new SortedDictionary<string,int>(), Solve(Enumerable.Repeat("x", 5)));
 }
}

// ======================================================================
// 29: Dictionary frequency counting / scenario 7
// Count words with ordinal case-sensitive comparison. Retain counts >=7; sort output keys ordinally. Empty input returns an empty dictionary.
// Hint: Dictionary comparison and output normalization are separate choices.
// Practice: --practice 29; reference: --verify 29
static class E029 {

 public static SortedDictionary<string, int> Practice(IEnumerable<string> words) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 29");
 }
 public static SortedDictionary<string, int> Reference(IEnumerable<string> words) {
  var counts = new Dictionary<string,int>(StringComparer.Ordinal); foreach (var word in words) { var key = word; counts[key] = counts.GetValueOrDefault(key) + 1; } var result = new SortedDictionary<string,int>(StringComparer.Ordinal); foreach (var pair in counts) if (pair.Value >= 7) result[pair.Key] = pair.Value; return result;
 }
 private static SortedDictionary<string, int> Solve(IEnumerable<string> words) => Check.PracticeMode ? Practice(words) : Reference(words);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int>(), Solve(Array.Empty<string>()));
  Check.Equal(new SortedDictionary<string,int> { ["Tea"] = 7 }, Solve(Enumerable.Repeat("Tea", 7)));
  Check.Equal(new SortedDictionary<string,int>(), Solve(Enumerable.Repeat("x", 6)));
 }
}

// ======================================================================
// 30: Dictionary frequency counting / scenario 8
// Count words with ordinal case-insensitive comparison and lowercase output keys. Retain counts >=8; sort output keys ordinally. Empty input returns an empty dictionary.
// Hint: Dictionary comparison and output normalization are separate choices.
// Practice: --practice 30; reference: --verify 30
static class E030 {

 public static SortedDictionary<string, int> Practice(IEnumerable<string> words) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 30");
 }
 public static SortedDictionary<string, int> Reference(IEnumerable<string> words) {
  var counts = new Dictionary<string,int>(StringComparer.OrdinalIgnoreCase); foreach (var word in words) { var key = word.ToLowerInvariant(); counts[key] = counts.GetValueOrDefault(key) + 1; } var result = new SortedDictionary<string,int>(StringComparer.Ordinal); foreach (var pair in counts) if (pair.Value >= 8) result[pair.Key] = pair.Value; return result;
 }
 private static SortedDictionary<string, int> Solve(IEnumerable<string> words) => Check.PracticeMode ? Practice(words) : Reference(words);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int>(), Solve(Array.Empty<string>()));
  Check.Equal(new SortedDictionary<string,int> { ["tea"] = 8 }, Solve(Enumerable.Repeat("Tea", 8)));
  Check.Equal(new SortedDictionary<string,int>(), Solve(Enumerable.Repeat("x", 7)));
 }
}

// ======================================================================
// 31: Dictionary frequency counting / scenario 9
// Count words with ordinal case-sensitive comparison. Retain counts >=9; sort output keys ordinally. Empty input returns an empty dictionary.
// Hint: Dictionary comparison and output normalization are separate choices.
// Practice: --practice 31; reference: --verify 31
static class E031 {

 public static SortedDictionary<string, int> Practice(IEnumerable<string> words) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 31");
 }
 public static SortedDictionary<string, int> Reference(IEnumerable<string> words) {
  var counts = new Dictionary<string,int>(StringComparer.Ordinal); foreach (var word in words) { var key = word; counts[key] = counts.GetValueOrDefault(key) + 1; } var result = new SortedDictionary<string,int>(StringComparer.Ordinal); foreach (var pair in counts) if (pair.Value >= 9) result[pair.Key] = pair.Value; return result;
 }
 private static SortedDictionary<string, int> Solve(IEnumerable<string> words) => Check.PracticeMode ? Practice(words) : Reference(words);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int>(), Solve(Array.Empty<string>()));
  Check.Equal(new SortedDictionary<string,int> { ["Tea"] = 9 }, Solve(Enumerable.Repeat("Tea", 9)));
  Check.Equal(new SortedDictionary<string,int>(), Solve(Enumerable.Repeat("x", 8)));
 }
}

// ======================================================================
// 32: Dictionary frequency counting / scenario 10
// Count words with ordinal case-insensitive comparison and lowercase output keys. Retain counts >=10; sort output keys ordinally. Empty input returns an empty dictionary.
// Hint: Dictionary comparison and output normalization are separate choices.
// Practice: --practice 32; reference: --verify 32
static class E032 {

 public static SortedDictionary<string, int> Practice(IEnumerable<string> words) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 32");
 }
 public static SortedDictionary<string, int> Reference(IEnumerable<string> words) {
  var counts = new Dictionary<string,int>(StringComparer.OrdinalIgnoreCase); foreach (var word in words) { var key = word.ToLowerInvariant(); counts[key] = counts.GetValueOrDefault(key) + 1; } var result = new SortedDictionary<string,int>(StringComparer.Ordinal); foreach (var pair in counts) if (pair.Value >= 10) result[pair.Key] = pair.Value; return result;
 }
 private static SortedDictionary<string, int> Solve(IEnumerable<string> words) => Check.PracticeMode ? Practice(words) : Reference(words);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int>(), Solve(Array.Empty<string>()));
  Check.Equal(new SortedDictionary<string,int> { ["tea"] = 10 }, Solve(Enumerable.Repeat("Tea", 10)));
  Check.Equal(new SortedDictionary<string,int>(), Solve(Enumerable.Repeat("x", 9)));
 }
}

// ======================================================================
// 33: Dictionary frequency counting / scenario 11
// Count words with ordinal case-sensitive comparison. Retain counts >=11; sort output keys ordinally. Empty input returns an empty dictionary.
// Hint: Dictionary comparison and output normalization are separate choices.
// Practice: --practice 33; reference: --verify 33
static class E033 {

 public static SortedDictionary<string, int> Practice(IEnumerable<string> words) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 33");
 }
 public static SortedDictionary<string, int> Reference(IEnumerable<string> words) {
  var counts = new Dictionary<string,int>(StringComparer.Ordinal); foreach (var word in words) { var key = word; counts[key] = counts.GetValueOrDefault(key) + 1; } var result = new SortedDictionary<string,int>(StringComparer.Ordinal); foreach (var pair in counts) if (pair.Value >= 11) result[pair.Key] = pair.Value; return result;
 }
 private static SortedDictionary<string, int> Solve(IEnumerable<string> words) => Check.PracticeMode ? Practice(words) : Reference(words);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int>(), Solve(Array.Empty<string>()));
  Check.Equal(new SortedDictionary<string,int> { ["Tea"] = 11 }, Solve(Enumerable.Repeat("Tea", 11)));
  Check.Equal(new SortedDictionary<string,int>(), Solve(Enumerable.Repeat("x", 10)));
 }
}

// ======================================================================
// 34: Numeric sorting with tie rules / scenario 1
// Return at most 1 values sorted ascending. Retain duplicates; never sort the caller's array in place.
// Hint: OrderBy returns a new sequence; List.Sort would mutate a list.
// Practice: --practice 34; reference: --verify 34
static class E034 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 34");
 }
 public static int[] Reference(IEnumerable<int> values) {
  return values.OrderBy(n => n).Take(1).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 1 }, Solve(new int[] { 1, 4, 2, 4, 3 }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { -2 }, Solve(new[] { -2 }));
  var input = new[] { 3, 1, 2 }; _ = Solve(input); Check.Equal(new[] { 3, 1, 2 }, input);
 }
}

// ======================================================================
// 35: Numeric sorting with tie rules / scenario 2
// Return at most 2 values sorted descending. Retain duplicates; never sort the caller's array in place.
// Hint: OrderBy returns a new sequence; List.Sort would mutate a list.
// Practice: --practice 35; reference: --verify 35
static class E035 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 35");
 }
 public static int[] Reference(IEnumerable<int> values) {
  return values.OrderByDescending(n => n).Take(2).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 4, 4 }, Solve(new int[] { 1, 4, 2, 4, 3 }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { -2 }, Solve(new[] { -2 }));
  var input = new[] { 3, 1, 2 }; _ = Solve(input); Check.Equal(new[] { 3, 1, 2 }, input);
 }
}

// ======================================================================
// 36: Numeric sorting with tie rules / scenario 3
// Return at most 3 values sorted ascending. Retain duplicates; never sort the caller's array in place.
// Hint: OrderBy returns a new sequence; List.Sort would mutate a list.
// Practice: --practice 36; reference: --verify 36
static class E036 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 36");
 }
 public static int[] Reference(IEnumerable<int> values) {
  return values.OrderBy(n => n).Take(3).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2, 3 }, Solve(new int[] { 1, 4, 2, 4, 3 }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { -2 }, Solve(new[] { -2 }));
  var input = new[] { 3, 1, 2 }; _ = Solve(input); Check.Equal(new[] { 3, 1, 2 }, input);
 }
}

// ======================================================================
// 37: Numeric sorting with tie rules / scenario 4
// Return at most 4 values sorted descending. Retain duplicates; never sort the caller's array in place.
// Hint: OrderBy returns a new sequence; List.Sort would mutate a list.
// Practice: --practice 37; reference: --verify 37
static class E037 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 37");
 }
 public static int[] Reference(IEnumerable<int> values) {
  return values.OrderByDescending(n => n).Take(4).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 4, 4, 3, 2 }, Solve(new int[] { 1, 4, 2, 4, 3 }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { -2 }, Solve(new[] { -2 }));
  var input = new[] { 3, 1, 2 }; _ = Solve(input); Check.Equal(new[] { 3, 1, 2 }, input);
 }
}

// ======================================================================
// 38: Numeric sorting with tie rules / scenario 5
// Return at most 5 values sorted ascending. Retain duplicates; never sort the caller's array in place.
// Hint: OrderBy returns a new sequence; List.Sort would mutate a list.
// Practice: --practice 38; reference: --verify 38
static class E038 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 38");
 }
 public static int[] Reference(IEnumerable<int> values) {
  return values.OrderBy(n => n).Take(5).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2, 3, 4, 4 }, Solve(new int[] { 1, 4, 2, 4, 3 }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { -2 }, Solve(new[] { -2 }));
  var input = new[] { 3, 1, 2 }; _ = Solve(input); Check.Equal(new[] { 3, 1, 2 }, input);
 }
}

// ======================================================================
// 39: Numeric sorting with tie rules / scenario 6
// Return at most 6 values sorted descending. Retain duplicates; never sort the caller's array in place.
// Hint: OrderBy returns a new sequence; List.Sort would mutate a list.
// Practice: --practice 39; reference: --verify 39
static class E039 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 39");
 }
 public static int[] Reference(IEnumerable<int> values) {
  return values.OrderByDescending(n => n).Take(6).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 4, 4, 3, 2, 1 }, Solve(new int[] { 1, 4, 2, 4, 3 }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { -2 }, Solve(new[] { -2 }));
  var input = new[] { 3, 1, 2 }; _ = Solve(input); Check.Equal(new[] { 3, 1, 2 }, input);
 }
}

// ======================================================================
// 40: Numeric sorting with tie rules / scenario 7
// Return at most 7 values sorted ascending. Retain duplicates; never sort the caller's array in place.
// Hint: OrderBy returns a new sequence; List.Sort would mutate a list.
// Practice: --practice 40; reference: --verify 40
static class E040 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 40");
 }
 public static int[] Reference(IEnumerable<int> values) {
  return values.OrderBy(n => n).Take(7).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2, 3, 4, 4 }, Solve(new int[] { 1, 4, 2, 4, 3 }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { -2 }, Solve(new[] { -2 }));
  var input = new[] { 3, 1, 2 }; _ = Solve(input); Check.Equal(new[] { 3, 1, 2 }, input);
 }
}

// ======================================================================
// 41: Numeric sorting with tie rules / scenario 8
// Return at most 8 values sorted descending. Retain duplicates; never sort the caller's array in place.
// Hint: OrderBy returns a new sequence; List.Sort would mutate a list.
// Practice: --practice 41; reference: --verify 41
static class E041 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 41");
 }
 public static int[] Reference(IEnumerable<int> values) {
  return values.OrderByDescending(n => n).Take(8).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 4, 4, 3, 2, 1 }, Solve(new int[] { 1, 4, 2, 4, 3 }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { -2 }, Solve(new[] { -2 }));
  var input = new[] { 3, 1, 2 }; _ = Solve(input); Check.Equal(new[] { 3, 1, 2 }, input);
 }
}

// ======================================================================
// 42: Numeric sorting with tie rules / scenario 9
// Return at most 9 values sorted ascending. Retain duplicates; never sort the caller's array in place.
// Hint: OrderBy returns a new sequence; List.Sort would mutate a list.
// Practice: --practice 42; reference: --verify 42
static class E042 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 42");
 }
 public static int[] Reference(IEnumerable<int> values) {
  return values.OrderBy(n => n).Take(9).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2, 3, 4, 4 }, Solve(new int[] { 1, 4, 2, 4, 3 }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { -2 }, Solve(new[] { -2 }));
  var input = new[] { 3, 1, 2 }; _ = Solve(input); Check.Equal(new[] { 3, 1, 2 }, input);
 }
}

// ======================================================================
// 43: Numeric sorting with tie rules / scenario 10
// Return at most 10 values sorted descending. Retain duplicates; never sort the caller's array in place.
// Hint: OrderBy returns a new sequence; List.Sort would mutate a list.
// Practice: --practice 43; reference: --verify 43
static class E043 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 43");
 }
 public static int[] Reference(IEnumerable<int> values) {
  return values.OrderByDescending(n => n).Take(10).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 4, 4, 3, 2, 1 }, Solve(new int[] { 1, 4, 2, 4, 3 }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { -2 }, Solve(new[] { -2 }));
  var input = new[] { 3, 1, 2 }; _ = Solve(input); Check.Equal(new[] { 3, 1, 2 }, input);
 }
}

// ======================================================================
// 44: Numeric sorting with tie rules / scenario 11
// Return at most 11 values sorted ascending. Retain duplicates; never sort the caller's array in place.
// Hint: OrderBy returns a new sequence; List.Sort would mutate a list.
// Practice: --practice 44; reference: --verify 44
static class E044 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 44");
 }
 public static int[] Reference(IEnumerable<int> values) {
  return values.OrderBy(n => n).Take(11).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2, 3, 4, 4 }, Solve(new int[] { 1, 4, 2, 4, 3 }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { -2 }, Solve(new[] { -2 }));
  var input = new[] { 3, 1, 2 }; _ = Solve(input); Check.Equal(new[] { 3, 1, 2 }, input);
 }
}

// ======================================================================
// 45: Sliding window sums / scenario 1
// Return sums for all contiguous windows of width1. Fewer than width values yields[]. O(n) time; long sums.
// Hint: Add the entering element and subtract the departing one.
// Practice: --practice 45; reference: --verify 45
static class E045 {

 public static long[] Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 45");
 }
 public static long[] Reference(IReadOnlyList<int> values) {
  const int width = 1; var result = new List<long>(); long sum = 0; for (int i = 0; i < values.Count; i++) { sum += values[i]; if (i >= width) sum -= values[i-width]; if (i >= width-1) result.Add(sum); } return result.ToArray();
 }
 private static long[] Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(Array.Empty<long>(), Solve(Array.Empty<int>()));
  Check.Equal(new long[] { 1, 1 }, Solve(Enumerable.Repeat(1, 2).ToArray()));
  Check.Equal(new long[] { -2 }, Solve(Enumerable.Repeat(-2, 1).ToArray()));
 }
}

// ======================================================================
// 46: Sliding window sums / scenario 2
// Return sums for all contiguous windows of width2. Fewer than width values yields[]. O(n) time; long sums.
// Hint: Add the entering element and subtract the departing one.
// Practice: --practice 46; reference: --verify 46
static class E046 {

 public static long[] Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 46");
 }
 public static long[] Reference(IReadOnlyList<int> values) {
  const int width = 2; var result = new List<long>(); long sum = 0; for (int i = 0; i < values.Count; i++) { sum += values[i]; if (i >= width) sum -= values[i-width]; if (i >= width-1) result.Add(sum); } return result.ToArray();
 }
 private static long[] Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(Array.Empty<long>(), Solve(Array.Empty<int>()));
  Check.Equal(new long[] { 2, 2 }, Solve(Enumerable.Repeat(1, 3).ToArray()));
  Check.Equal(new long[] { -4 }, Solve(Enumerable.Repeat(-2, 2).ToArray()));
 }
}

// ======================================================================
// 47: Sliding window sums / scenario 3
// Return sums for all contiguous windows of width3. Fewer than width values yields[]. O(n) time; long sums.
// Hint: Add the entering element and subtract the departing one.
// Practice: --practice 47; reference: --verify 47
static class E047 {

 public static long[] Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 47");
 }
 public static long[] Reference(IReadOnlyList<int> values) {
  const int width = 3; var result = new List<long>(); long sum = 0; for (int i = 0; i < values.Count; i++) { sum += values[i]; if (i >= width) sum -= values[i-width]; if (i >= width-1) result.Add(sum); } return result.ToArray();
 }
 private static long[] Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(Array.Empty<long>(), Solve(Array.Empty<int>()));
  Check.Equal(new long[] { 3, 3 }, Solve(Enumerable.Repeat(1, 4).ToArray()));
  Check.Equal(new long[] { -6 }, Solve(Enumerable.Repeat(-2, 3).ToArray()));
 }
}

// ======================================================================
// 48: Sliding window sums / scenario 4
// Return sums for all contiguous windows of width4. Fewer than width values yields[]. O(n) time; long sums.
// Hint: Add the entering element and subtract the departing one.
// Practice: --practice 48; reference: --verify 48
static class E048 {

 public static long[] Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 48");
 }
 public static long[] Reference(IReadOnlyList<int> values) {
  const int width = 4; var result = new List<long>(); long sum = 0; for (int i = 0; i < values.Count; i++) { sum += values[i]; if (i >= width) sum -= values[i-width]; if (i >= width-1) result.Add(sum); } return result.ToArray();
 }
 private static long[] Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(Array.Empty<long>(), Solve(Array.Empty<int>()));
  Check.Equal(new long[] { 4, 4 }, Solve(Enumerable.Repeat(1, 5).ToArray()));
  Check.Equal(new long[] { -8 }, Solve(Enumerable.Repeat(-2, 4).ToArray()));
 }
}

// ======================================================================
// 49: Sliding window sums / scenario 5
// Return sums for all contiguous windows of width5. Fewer than width values yields[]. O(n) time; long sums.
// Hint: Add the entering element and subtract the departing one.
// Practice: --practice 49; reference: --verify 49
static class E049 {

 public static long[] Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 49");
 }
 public static long[] Reference(IReadOnlyList<int> values) {
  const int width = 5; var result = new List<long>(); long sum = 0; for (int i = 0; i < values.Count; i++) { sum += values[i]; if (i >= width) sum -= values[i-width]; if (i >= width-1) result.Add(sum); } return result.ToArray();
 }
 private static long[] Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(Array.Empty<long>(), Solve(Array.Empty<int>()));
  Check.Equal(new long[] { 5, 5 }, Solve(Enumerable.Repeat(1, 6).ToArray()));
  Check.Equal(new long[] { -10 }, Solve(Enumerable.Repeat(-2, 5).ToArray()));
 }
}

// ======================================================================
// 50: Sliding window sums / scenario 6
// Return sums for all contiguous windows of width6. Fewer than width values yields[]. O(n) time; long sums.
// Hint: Add the entering element and subtract the departing one.
// Practice: --practice 50; reference: --verify 50
static class E050 {

 public static long[] Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 50");
 }
 public static long[] Reference(IReadOnlyList<int> values) {
  const int width = 6; var result = new List<long>(); long sum = 0; for (int i = 0; i < values.Count; i++) { sum += values[i]; if (i >= width) sum -= values[i-width]; if (i >= width-1) result.Add(sum); } return result.ToArray();
 }
 private static long[] Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(Array.Empty<long>(), Solve(Array.Empty<int>()));
  Check.Equal(new long[] { 6, 6 }, Solve(Enumerable.Repeat(1, 7).ToArray()));
  Check.Equal(new long[] { -12 }, Solve(Enumerable.Repeat(-2, 6).ToArray()));
 }
}

// ======================================================================
// 51: Sliding window sums / scenario 7
// Return sums for all contiguous windows of width7. Fewer than width values yields[]. O(n) time; long sums.
// Hint: Add the entering element and subtract the departing one.
// Practice: --practice 51; reference: --verify 51
static class E051 {

 public static long[] Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 51");
 }
 public static long[] Reference(IReadOnlyList<int> values) {
  const int width = 7; var result = new List<long>(); long sum = 0; for (int i = 0; i < values.Count; i++) { sum += values[i]; if (i >= width) sum -= values[i-width]; if (i >= width-1) result.Add(sum); } return result.ToArray();
 }
 private static long[] Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(Array.Empty<long>(), Solve(Array.Empty<int>()));
  Check.Equal(new long[] { 7, 7 }, Solve(Enumerable.Repeat(1, 8).ToArray()));
  Check.Equal(new long[] { -14 }, Solve(Enumerable.Repeat(-2, 7).ToArray()));
 }
}

// ======================================================================
// 52: Sliding window sums / scenario 8
// Return sums for all contiguous windows of width8. Fewer than width values yields[]. O(n) time; long sums.
// Hint: Add the entering element and subtract the departing one.
// Practice: --practice 52; reference: --verify 52
static class E052 {

 public static long[] Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 52");
 }
 public static long[] Reference(IReadOnlyList<int> values) {
  const int width = 8; var result = new List<long>(); long sum = 0; for (int i = 0; i < values.Count; i++) { sum += values[i]; if (i >= width) sum -= values[i-width]; if (i >= width-1) result.Add(sum); } return result.ToArray();
 }
 private static long[] Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(Array.Empty<long>(), Solve(Array.Empty<int>()));
  Check.Equal(new long[] { 8, 8 }, Solve(Enumerable.Repeat(1, 9).ToArray()));
  Check.Equal(new long[] { -16 }, Solve(Enumerable.Repeat(-2, 8).ToArray()));
 }
}

// ======================================================================
// 53: Sliding window sums / scenario 9
// Return sums for all contiguous windows of width9. Fewer than width values yields[]. O(n) time; long sums.
// Hint: Add the entering element and subtract the departing one.
// Practice: --practice 53; reference: --verify 53
static class E053 {

 public static long[] Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 53");
 }
 public static long[] Reference(IReadOnlyList<int> values) {
  const int width = 9; var result = new List<long>(); long sum = 0; for (int i = 0; i < values.Count; i++) { sum += values[i]; if (i >= width) sum -= values[i-width]; if (i >= width-1) result.Add(sum); } return result.ToArray();
 }
 private static long[] Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(Array.Empty<long>(), Solve(Array.Empty<int>()));
  Check.Equal(new long[] { 9, 9 }, Solve(Enumerable.Repeat(1, 10).ToArray()));
  Check.Equal(new long[] { -18 }, Solve(Enumerable.Repeat(-2, 9).ToArray()));
 }
}

// ======================================================================
// 54: Sliding window sums / scenario 10
// Return sums for all contiguous windows of width10. Fewer than width values yields[]. O(n) time; long sums.
// Hint: Add the entering element and subtract the departing one.
// Practice: --practice 54; reference: --verify 54
static class E054 {

 public static long[] Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 54");
 }
 public static long[] Reference(IReadOnlyList<int> values) {
  const int width = 10; var result = new List<long>(); long sum = 0; for (int i = 0; i < values.Count; i++) { sum += values[i]; if (i >= width) sum -= values[i-width]; if (i >= width-1) result.Add(sum); } return result.ToArray();
 }
 private static long[] Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(Array.Empty<long>(), Solve(Array.Empty<int>()));
  Check.Equal(new long[] { 10, 10 }, Solve(Enumerable.Repeat(1, 11).ToArray()));
  Check.Equal(new long[] { -20 }, Solve(Enumerable.Repeat(-2, 10).ToArray()));
 }
}

// ======================================================================
// 55: Sliding window sums / scenario 11
// Return sums for all contiguous windows of width11. Fewer than width values yields[]. O(n) time; long sums.
// Hint: Add the entering element and subtract the departing one.
// Practice: --practice 55; reference: --verify 55
static class E055 {

 public static long[] Practice(IReadOnlyList<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 55");
 }
 public static long[] Reference(IReadOnlyList<int> values) {
  const int width = 11; var result = new List<long>(); long sum = 0; for (int i = 0; i < values.Count; i++) { sum += values[i]; if (i >= width) sum -= values[i-width]; if (i >= width-1) result.Add(sum); } return result.ToArray();
 }
 private static long[] Solve(IReadOnlyList<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(Array.Empty<long>(), Solve(Array.Empty<int>()));
  Check.Equal(new long[] { 11, 11 }, Solve(Enumerable.Repeat(1, 12).ToArray()));
  Check.Equal(new long[] { -22 }, Solve(Enumerable.Repeat(-2, 11).ToArray()));
 }
}

// ======================================================================
// 56: Validated pagination records / scenario 1
// Page size1. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).
// Hint: Validate, compute total pages, clamp, then slice.
// Practice: --practice 56; reference: --verify 56
static class E056 {
public sealed record Page(int[] Items, int Number, int TotalPages);
 public static Page Practice(IReadOnlyList<int> values, int requestedPage) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 56");
 }
 public static Page Reference(IReadOnlyList<int> values, int requestedPage) {
  if (requestedPage < 1) throw new ArgumentOutOfRangeException(nameof(requestedPage)); int totalPages = (int)Math.Ceiling(values.Count / (double)1); int page = Math.Min(requestedPage, Math.Max(1, totalPages)); return new Page(values.Skip((page-1)*1).Take(1).ToArray(), page, totalPages);
 }
 private static Page Solve(IReadOnlyList<int> values, int requestedPage) => Check.PracticeMode ? Practice(values, requestedPage) : Reference(values, requestedPage);
 public static void Verify() {
  Check.Equal(new Page(Array.Empty<int>(), 1, 0), Solve(Array.Empty<int>(), 99));
  Check.Equal(new Page(new[] { 2 }, 2, 2), Solve(Enumerable.Range(1, 2).ToArray(), 99));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(Array.Empty<int>(), 0); });
 }
}

// ======================================================================
// 57: Validated pagination records / scenario 2
// Page size2. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).
// Hint: Validate, compute total pages, clamp, then slice.
// Practice: --practice 57; reference: --verify 57
static class E057 {
public sealed record Page(int[] Items, int Number, int TotalPages);
 public static Page Practice(IReadOnlyList<int> values, int requestedPage) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 57");
 }
 public static Page Reference(IReadOnlyList<int> values, int requestedPage) {
  if (requestedPage < 1) throw new ArgumentOutOfRangeException(nameof(requestedPage)); int totalPages = (int)Math.Ceiling(values.Count / (double)2); int page = Math.Min(requestedPage, Math.Max(1, totalPages)); return new Page(values.Skip((page-1)*2).Take(2).ToArray(), page, totalPages);
 }
 private static Page Solve(IReadOnlyList<int> values, int requestedPage) => Check.PracticeMode ? Practice(values, requestedPage) : Reference(values, requestedPage);
 public static void Verify() {
  Check.Equal(new Page(Array.Empty<int>(), 1, 0), Solve(Array.Empty<int>(), 99));
  Check.Equal(new Page(new[] { 3 }, 2, 2), Solve(Enumerable.Range(1, 3).ToArray(), 99));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(Array.Empty<int>(), 0); });
 }
}

// ======================================================================
// 58: Validated pagination records / scenario 3
// Page size3. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).
// Hint: Validate, compute total pages, clamp, then slice.
// Practice: --practice 58; reference: --verify 58
static class E058 {
public sealed record Page(int[] Items, int Number, int TotalPages);
 public static Page Practice(IReadOnlyList<int> values, int requestedPage) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 58");
 }
 public static Page Reference(IReadOnlyList<int> values, int requestedPage) {
  if (requestedPage < 1) throw new ArgumentOutOfRangeException(nameof(requestedPage)); int totalPages = (int)Math.Ceiling(values.Count / (double)3); int page = Math.Min(requestedPage, Math.Max(1, totalPages)); return new Page(values.Skip((page-1)*3).Take(3).ToArray(), page, totalPages);
 }
 private static Page Solve(IReadOnlyList<int> values, int requestedPage) => Check.PracticeMode ? Practice(values, requestedPage) : Reference(values, requestedPage);
 public static void Verify() {
  Check.Equal(new Page(Array.Empty<int>(), 1, 0), Solve(Array.Empty<int>(), 99));
  Check.Equal(new Page(new[] { 4 }, 2, 2), Solve(Enumerable.Range(1, 4).ToArray(), 99));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(Array.Empty<int>(), 0); });
 }
}

// ======================================================================
// 59: Validated pagination records / scenario 4
// Page size4. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).
// Hint: Validate, compute total pages, clamp, then slice.
// Practice: --practice 59; reference: --verify 59
static class E059 {
public sealed record Page(int[] Items, int Number, int TotalPages);
 public static Page Practice(IReadOnlyList<int> values, int requestedPage) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 59");
 }
 public static Page Reference(IReadOnlyList<int> values, int requestedPage) {
  if (requestedPage < 1) throw new ArgumentOutOfRangeException(nameof(requestedPage)); int totalPages = (int)Math.Ceiling(values.Count / (double)4); int page = Math.Min(requestedPage, Math.Max(1, totalPages)); return new Page(values.Skip((page-1)*4).Take(4).ToArray(), page, totalPages);
 }
 private static Page Solve(IReadOnlyList<int> values, int requestedPage) => Check.PracticeMode ? Practice(values, requestedPage) : Reference(values, requestedPage);
 public static void Verify() {
  Check.Equal(new Page(Array.Empty<int>(), 1, 0), Solve(Array.Empty<int>(), 99));
  Check.Equal(new Page(new[] { 5 }, 2, 2), Solve(Enumerable.Range(1, 5).ToArray(), 99));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(Array.Empty<int>(), 0); });
 }
}

// ======================================================================
// 60: Validated pagination records / scenario 5
// Page size5. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).
// Hint: Validate, compute total pages, clamp, then slice.
// Practice: --practice 60; reference: --verify 60
static class E060 {
public sealed record Page(int[] Items, int Number, int TotalPages);
 public static Page Practice(IReadOnlyList<int> values, int requestedPage) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 60");
 }
 public static Page Reference(IReadOnlyList<int> values, int requestedPage) {
  if (requestedPage < 1) throw new ArgumentOutOfRangeException(nameof(requestedPage)); int totalPages = (int)Math.Ceiling(values.Count / (double)5); int page = Math.Min(requestedPage, Math.Max(1, totalPages)); return new Page(values.Skip((page-1)*5).Take(5).ToArray(), page, totalPages);
 }
 private static Page Solve(IReadOnlyList<int> values, int requestedPage) => Check.PracticeMode ? Practice(values, requestedPage) : Reference(values, requestedPage);
 public static void Verify() {
  Check.Equal(new Page(Array.Empty<int>(), 1, 0), Solve(Array.Empty<int>(), 99));
  Check.Equal(new Page(new[] { 6 }, 2, 2), Solve(Enumerable.Range(1, 6).ToArray(), 99));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(Array.Empty<int>(), 0); });
 }
}

// ======================================================================
// 61: Validated pagination records / scenario 6
// Page size6. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).
// Hint: Validate, compute total pages, clamp, then slice.
// Practice: --practice 61; reference: --verify 61
static class E061 {
public sealed record Page(int[] Items, int Number, int TotalPages);
 public static Page Practice(IReadOnlyList<int> values, int requestedPage) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 61");
 }
 public static Page Reference(IReadOnlyList<int> values, int requestedPage) {
  if (requestedPage < 1) throw new ArgumentOutOfRangeException(nameof(requestedPage)); int totalPages = (int)Math.Ceiling(values.Count / (double)6); int page = Math.Min(requestedPage, Math.Max(1, totalPages)); return new Page(values.Skip((page-1)*6).Take(6).ToArray(), page, totalPages);
 }
 private static Page Solve(IReadOnlyList<int> values, int requestedPage) => Check.PracticeMode ? Practice(values, requestedPage) : Reference(values, requestedPage);
 public static void Verify() {
  Check.Equal(new Page(Array.Empty<int>(), 1, 0), Solve(Array.Empty<int>(), 99));
  Check.Equal(new Page(new[] { 7 }, 2, 2), Solve(Enumerable.Range(1, 7).ToArray(), 99));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(Array.Empty<int>(), 0); });
 }
}

// ======================================================================
// 62: Validated pagination records / scenario 7
// Page size7. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).
// Hint: Validate, compute total pages, clamp, then slice.
// Practice: --practice 62; reference: --verify 62
static class E062 {
public sealed record Page(int[] Items, int Number, int TotalPages);
 public static Page Practice(IReadOnlyList<int> values, int requestedPage) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 62");
 }
 public static Page Reference(IReadOnlyList<int> values, int requestedPage) {
  if (requestedPage < 1) throw new ArgumentOutOfRangeException(nameof(requestedPage)); int totalPages = (int)Math.Ceiling(values.Count / (double)7); int page = Math.Min(requestedPage, Math.Max(1, totalPages)); return new Page(values.Skip((page-1)*7).Take(7).ToArray(), page, totalPages);
 }
 private static Page Solve(IReadOnlyList<int> values, int requestedPage) => Check.PracticeMode ? Practice(values, requestedPage) : Reference(values, requestedPage);
 public static void Verify() {
  Check.Equal(new Page(Array.Empty<int>(), 1, 0), Solve(Array.Empty<int>(), 99));
  Check.Equal(new Page(new[] { 8 }, 2, 2), Solve(Enumerable.Range(1, 8).ToArray(), 99));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(Array.Empty<int>(), 0); });
 }
}

// ======================================================================
// 63: Validated pagination records / scenario 8
// Page size8. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).
// Hint: Validate, compute total pages, clamp, then slice.
// Practice: --practice 63; reference: --verify 63
static class E063 {
public sealed record Page(int[] Items, int Number, int TotalPages);
 public static Page Practice(IReadOnlyList<int> values, int requestedPage) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 63");
 }
 public static Page Reference(IReadOnlyList<int> values, int requestedPage) {
  if (requestedPage < 1) throw new ArgumentOutOfRangeException(nameof(requestedPage)); int totalPages = (int)Math.Ceiling(values.Count / (double)8); int page = Math.Min(requestedPage, Math.Max(1, totalPages)); return new Page(values.Skip((page-1)*8).Take(8).ToArray(), page, totalPages);
 }
 private static Page Solve(IReadOnlyList<int> values, int requestedPage) => Check.PracticeMode ? Practice(values, requestedPage) : Reference(values, requestedPage);
 public static void Verify() {
  Check.Equal(new Page(Array.Empty<int>(), 1, 0), Solve(Array.Empty<int>(), 99));
  Check.Equal(new Page(new[] { 9 }, 2, 2), Solve(Enumerable.Range(1, 9).ToArray(), 99));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(Array.Empty<int>(), 0); });
 }
}

// ======================================================================
// 64: Validated pagination records / scenario 9
// Page size9. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).
// Hint: Validate, compute total pages, clamp, then slice.
// Practice: --practice 64; reference: --verify 64
static class E064 {
public sealed record Page(int[] Items, int Number, int TotalPages);
 public static Page Practice(IReadOnlyList<int> values, int requestedPage) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 64");
 }
 public static Page Reference(IReadOnlyList<int> values, int requestedPage) {
  if (requestedPage < 1) throw new ArgumentOutOfRangeException(nameof(requestedPage)); int totalPages = (int)Math.Ceiling(values.Count / (double)9); int page = Math.Min(requestedPage, Math.Max(1, totalPages)); return new Page(values.Skip((page-1)*9).Take(9).ToArray(), page, totalPages);
 }
 private static Page Solve(IReadOnlyList<int> values, int requestedPage) => Check.PracticeMode ? Practice(values, requestedPage) : Reference(values, requestedPage);
 public static void Verify() {
  Check.Equal(new Page(Array.Empty<int>(), 1, 0), Solve(Array.Empty<int>(), 99));
  Check.Equal(new Page(new[] { 10 }, 2, 2), Solve(Enumerable.Range(1, 10).ToArray(), 99));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(Array.Empty<int>(), 0); });
 }
}

// ======================================================================
// 65: Validated pagination records / scenario 10
// Page size10. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).
// Hint: Validate, compute total pages, clamp, then slice.
// Practice: --practice 65; reference: --verify 65
static class E065 {
public sealed record Page(int[] Items, int Number, int TotalPages);
 public static Page Practice(IReadOnlyList<int> values, int requestedPage) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 65");
 }
 public static Page Reference(IReadOnlyList<int> values, int requestedPage) {
  if (requestedPage < 1) throw new ArgumentOutOfRangeException(nameof(requestedPage)); int totalPages = (int)Math.Ceiling(values.Count / (double)10); int page = Math.Min(requestedPage, Math.Max(1, totalPages)); return new Page(values.Skip((page-1)*10).Take(10).ToArray(), page, totalPages);
 }
 private static Page Solve(IReadOnlyList<int> values, int requestedPage) => Check.PracticeMode ? Practice(values, requestedPage) : Reference(values, requestedPage);
 public static void Verify() {
  Check.Equal(new Page(Array.Empty<int>(), 1, 0), Solve(Array.Empty<int>(), 99));
  Check.Equal(new Page(new[] { 11 }, 2, 2), Solve(Enumerable.Range(1, 11).ToArray(), 99));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(Array.Empty<int>(), 0); });
 }
}

// ======================================================================
// 66: Validated pagination records / scenario 11
// Page size11. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).
// Hint: Validate, compute total pages, clamp, then slice.
// Practice: --practice 66; reference: --verify 66
static class E066 {
public sealed record Page(int[] Items, int Number, int TotalPages);
 public static Page Practice(IReadOnlyList<int> values, int requestedPage) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 66");
 }
 public static Page Reference(IReadOnlyList<int> values, int requestedPage) {
  if (requestedPage < 1) throw new ArgumentOutOfRangeException(nameof(requestedPage)); int totalPages = (int)Math.Ceiling(values.Count / (double)11); int page = Math.Min(requestedPage, Math.Max(1, totalPages)); return new Page(values.Skip((page-1)*11).Take(11).ToArray(), page, totalPages);
 }
 private static Page Solve(IReadOnlyList<int> values, int requestedPage) => Check.PracticeMode ? Practice(values, requestedPage) : Reference(values, requestedPage);
 public static void Verify() {
  Check.Equal(new Page(Array.Empty<int>(), 1, 0), Solve(Array.Empty<int>(), 99));
  Check.Equal(new Page(new[] { 12 }, 2, 2), Solve(Enumerable.Range(1, 12).ToArray(), 99));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(Array.Empty<int>(), 0); });
 }
}

// ======================================================================
// 67: Ordinal text normalization / scenario 1
// Apply upper normalization, then limit to3 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.
// Hint: Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.
// Practice: --practice 67; reference: --verify 67
static class E067 {

 public static string Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 67");
 }
 public static string Reference(string text) {
  ArgumentNullException.ThrowIfNull(text); var normalized = text.ToUpperInvariant(); return normalized.Length <= 3 ? normalized : normalized[..3];
 }
 private static string Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal("  H", Solve("  HeLLo  x  "));
  Check.Equal("", Solve(""));
  Check.Equal("A", Solve("a"));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 68: Ordinal text normalization / scenario 2
// Apply lower normalization, then limit to4 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.
// Hint: Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.
// Practice: --practice 68; reference: --verify 68
static class E068 {

 public static string Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 68");
 }
 public static string Reference(string text) {
  ArgumentNullException.ThrowIfNull(text); var normalized = text.ToLowerInvariant(); return normalized.Length <= 4 ? normalized : normalized[..4];
 }
 private static string Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal("  he", Solve("  HeLLo  x  "));
  Check.Equal("", Solve(""));
  Check.Equal("a", Solve("a"));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 69: Ordinal text normalization / scenario 3
// Apply trim normalization, then limit to5 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.
// Hint: Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.
// Practice: --practice 69; reference: --verify 69
static class E069 {

 public static string Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 69");
 }
 public static string Reference(string text) {
  ArgumentNullException.ThrowIfNull(text); var normalized = text.Trim(); return normalized.Length <= 5 ? normalized : normalized[..5];
 }
 private static string Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal("HeLLo", Solve("  HeLLo  x  "));
  Check.Equal("", Solve(""));
  Check.Equal("a", Solve("a"));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 70: Ordinal text normalization / scenario 4
// Apply collapse normalization, then limit to6 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.
// Hint: Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.
// Practice: --practice 70; reference: --verify 70
static class E070 {

 public static string Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 70");
 }
 public static string Reference(string text) {
  ArgumentNullException.ThrowIfNull(text); var normalized = Regex.Replace(text.Trim(), @"\s+", " "); return normalized.Length <= 6 ? normalized : normalized[..6];
 }
 private static string Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal("HeLLo ", Solve("  HeLLo  x  "));
  Check.Equal("", Solve(""));
  Check.Equal("a", Solve("a"));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 71: Ordinal text normalization / scenario 5
// Apply upper normalization, then limit to7 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.
// Hint: Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.
// Practice: --practice 71; reference: --verify 71
static class E071 {

 public static string Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 71");
 }
 public static string Reference(string text) {
  ArgumentNullException.ThrowIfNull(text); var normalized = text.ToUpperInvariant(); return normalized.Length <= 7 ? normalized : normalized[..7];
 }
 private static string Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal("  HELLO", Solve("  HeLLo  x  "));
  Check.Equal("", Solve(""));
  Check.Equal("A", Solve("a"));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 72: Ordinal text normalization / scenario 6
// Apply lower normalization, then limit to8 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.
// Hint: Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.
// Practice: --practice 72; reference: --verify 72
static class E072 {

 public static string Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 72");
 }
 public static string Reference(string text) {
  ArgumentNullException.ThrowIfNull(text); var normalized = text.ToLowerInvariant(); return normalized.Length <= 8 ? normalized : normalized[..8];
 }
 private static string Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal("  hello ", Solve("  HeLLo  x  "));
  Check.Equal("", Solve(""));
  Check.Equal("a", Solve("a"));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 73: Ordinal text normalization / scenario 7
// Apply trim normalization, then limit to9 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.
// Hint: Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.
// Practice: --practice 73; reference: --verify 73
static class E073 {

 public static string Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 73");
 }
 public static string Reference(string text) {
  ArgumentNullException.ThrowIfNull(text); var normalized = text.Trim(); return normalized.Length <= 9 ? normalized : normalized[..9];
 }
 private static string Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal("HeLLo  x", Solve("  HeLLo  x  "));
  Check.Equal("", Solve(""));
  Check.Equal("a", Solve("a"));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 74: Ordinal text normalization / scenario 8
// Apply collapse normalization, then limit to10 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.
// Hint: Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.
// Practice: --practice 74; reference: --verify 74
static class E074 {

 public static string Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 74");
 }
 public static string Reference(string text) {
  ArgumentNullException.ThrowIfNull(text); var normalized = Regex.Replace(text.Trim(), @"\s+", " "); return normalized.Length <= 10 ? normalized : normalized[..10];
 }
 private static string Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal("HeLLo x", Solve("  HeLLo  x  "));
  Check.Equal("", Solve(""));
  Check.Equal("a", Solve("a"));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 75: Ordinal text normalization / scenario 9
// Apply upper normalization, then limit to11 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.
// Hint: Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.
// Practice: --practice 75; reference: --verify 75
static class E075 {

 public static string Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 75");
 }
 public static string Reference(string text) {
  ArgumentNullException.ThrowIfNull(text); var normalized = text.ToUpperInvariant(); return normalized.Length <= 11 ? normalized : normalized[..11];
 }
 private static string Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal("  HELLO  X ", Solve("  HeLLo  x  "));
  Check.Equal("", Solve(""));
  Check.Equal("A", Solve("a"));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 76: Ordinal text normalization / scenario 10
// Apply lower normalization, then limit to12 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.
// Hint: Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.
// Practice: --practice 76; reference: --verify 76
static class E076 {

 public static string Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 76");
 }
 public static string Reference(string text) {
  ArgumentNullException.ThrowIfNull(text); var normalized = text.ToLowerInvariant(); return normalized.Length <= 12 ? normalized : normalized[..12];
 }
 private static string Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal("  hello  x  ", Solve("  HeLLo  x  "));
  Check.Equal("", Solve(""));
  Check.Equal("a", Solve("a"));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 77: Ordinal text normalization / scenario 11
// Apply trim normalization, then limit to13 UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.
// Hint: Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.
// Practice: --practice 77; reference: --verify 77
static class E077 {

 public static string Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 77");
 }
 public static string Reference(string text) {
  ArgumentNullException.ThrowIfNull(text); var normalized = text.Trim(); return normalized.Length <= 13 ? normalized : normalized[..13];
 }
 private static string Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal("HeLLo  x", Solve("  HeLLo  x  "));
  Check.Equal("", Solve(""));
  Check.Equal("a", Solve("a"));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 78: Safe integer parsing with TryParse / scenario 1
// Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below-5. Preserve order.
// Hint: TryParse communicates failure without exceptions.
// Practice: --practice 78; reference: --verify 78
static class E078 {

 public static int[] Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 78");
 }
 public static int[] Reference(IEnumerable<string> values) {
  var result = new List<int>(); foreach (var value in values) if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) && n >= -5) result.Add(n); return result.ToArray();
 }
 private static int[] Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { -5, -3 }, Solve(new string[] { "-5", "bad", "2147483648", "-3", "-6" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<string>()));
  Check.Equal(new int[] { 20 }, Solve(new[] { " +20 " }));
 }
}

// ======================================================================
// 79: Safe integer parsing with TryParse / scenario 2
// Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below-4. Preserve order.
// Hint: TryParse communicates failure without exceptions.
// Practice: --practice 79; reference: --verify 79
static class E079 {

 public static int[] Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 79");
 }
 public static int[] Reference(IEnumerable<string> values) {
  var result = new List<int>(); foreach (var value in values) if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) && n >= -4) result.Add(n); return result.ToArray();
 }
 private static int[] Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { -4, -2 }, Solve(new string[] { "-4", "bad", "2147483648", "-2", "-5" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<string>()));
  Check.Equal(new int[] { 20 }, Solve(new[] { " +20 " }));
 }
}

// ======================================================================
// 80: Safe integer parsing with TryParse / scenario 3
// Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below-3. Preserve order.
// Hint: TryParse communicates failure without exceptions.
// Practice: --practice 80; reference: --verify 80
static class E080 {

 public static int[] Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 80");
 }
 public static int[] Reference(IEnumerable<string> values) {
  var result = new List<int>(); foreach (var value in values) if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) && n >= -3) result.Add(n); return result.ToArray();
 }
 private static int[] Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { -3, -1 }, Solve(new string[] { "-3", "bad", "2147483648", "-1", "-4" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<string>()));
  Check.Equal(new int[] { 20 }, Solve(new[] { " +20 " }));
 }
}

// ======================================================================
// 81: Safe integer parsing with TryParse / scenario 4
// Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below-2. Preserve order.
// Hint: TryParse communicates failure without exceptions.
// Practice: --practice 81; reference: --verify 81
static class E081 {

 public static int[] Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 81");
 }
 public static int[] Reference(IEnumerable<string> values) {
  var result = new List<int>(); foreach (var value in values) if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) && n >= -2) result.Add(n); return result.ToArray();
 }
 private static int[] Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { -2, 0 }, Solve(new string[] { "-2", "bad", "2147483648", "0", "-3" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<string>()));
  Check.Equal(new int[] { 20 }, Solve(new[] { " +20 " }));
 }
}

// ======================================================================
// 82: Safe integer parsing with TryParse / scenario 5
// Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below-1. Preserve order.
// Hint: TryParse communicates failure without exceptions.
// Practice: --practice 82; reference: --verify 82
static class E082 {

 public static int[] Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 82");
 }
 public static int[] Reference(IEnumerable<string> values) {
  var result = new List<int>(); foreach (var value in values) if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) && n >= -1) result.Add(n); return result.ToArray();
 }
 private static int[] Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { -1, 1 }, Solve(new string[] { "-1", "bad", "2147483648", "1", "-2" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<string>()));
  Check.Equal(new int[] { 20 }, Solve(new[] { " +20 " }));
 }
}

// ======================================================================
// 83: Safe integer parsing with TryParse / scenario 6
// Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below0. Preserve order.
// Hint: TryParse communicates failure without exceptions.
// Practice: --practice 83; reference: --verify 83
static class E083 {

 public static int[] Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 83");
 }
 public static int[] Reference(IEnumerable<string> values) {
  var result = new List<int>(); foreach (var value in values) if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) && n >= 0) result.Add(n); return result.ToArray();
 }
 private static int[] Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 0, 2 }, Solve(new string[] { "0", "bad", "2147483648", "2", "-1" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<string>()));
  Check.Equal(new int[] { 20 }, Solve(new[] { " +20 " }));
 }
}

// ======================================================================
// 84: Safe integer parsing with TryParse / scenario 7
// Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below1. Preserve order.
// Hint: TryParse communicates failure without exceptions.
// Practice: --practice 84; reference: --verify 84
static class E084 {

 public static int[] Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 84");
 }
 public static int[] Reference(IEnumerable<string> values) {
  var result = new List<int>(); foreach (var value in values) if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) && n >= 1) result.Add(n); return result.ToArray();
 }
 private static int[] Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 3 }, Solve(new string[] { "1", "bad", "2147483648", "3", "0" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<string>()));
  Check.Equal(new int[] { 20 }, Solve(new[] { " +20 " }));
 }
}

// ======================================================================
// 85: Safe integer parsing with TryParse / scenario 8
// Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below2. Preserve order.
// Hint: TryParse communicates failure without exceptions.
// Practice: --practice 85; reference: --verify 85
static class E085 {

 public static int[] Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 85");
 }
 public static int[] Reference(IEnumerable<string> values) {
  var result = new List<int>(); foreach (var value in values) if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) && n >= 2) result.Add(n); return result.ToArray();
 }
 private static int[] Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 2, 4 }, Solve(new string[] { "2", "bad", "2147483648", "4", "1" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<string>()));
  Check.Equal(new int[] { 20 }, Solve(new[] { " +20 " }));
 }
}

// ======================================================================
// 86: Safe integer parsing with TryParse / scenario 9
// Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below3. Preserve order.
// Hint: TryParse communicates failure without exceptions.
// Practice: --practice 86; reference: --verify 86
static class E086 {

 public static int[] Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 86");
 }
 public static int[] Reference(IEnumerable<string> values) {
  var result = new List<int>(); foreach (var value in values) if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) && n >= 3) result.Add(n); return result.ToArray();
 }
 private static int[] Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 3, 5 }, Solve(new string[] { "3", "bad", "2147483648", "5", "2" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<string>()));
  Check.Equal(new int[] { 20 }, Solve(new[] { " +20 " }));
 }
}

// ======================================================================
// 87: Safe integer parsing with TryParse / scenario 10
// Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below4. Preserve order.
// Hint: TryParse communicates failure without exceptions.
// Practice: --practice 87; reference: --verify 87
static class E087 {

 public static int[] Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 87");
 }
 public static int[] Reference(IEnumerable<string> values) {
  var result = new List<int>(); foreach (var value in values) if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) && n >= 4) result.Add(n); return result.ToArray();
 }
 private static int[] Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 4, 6 }, Solve(new string[] { "4", "bad", "2147483648", "6", "3" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<string>()));
  Check.Equal(new int[] { 20 }, Solve(new[] { " +20 " }));
 }
}

// ======================================================================
// 88: Safe integer parsing with TryParse / scenario 11
// Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below5. Preserve order.
// Hint: TryParse communicates failure without exceptions.
// Practice: --practice 88; reference: --verify 88
static class E088 {

 public static int[] Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 88");
 }
 public static int[] Reference(IEnumerable<string> values) {
  var result = new List<int>(); foreach (var value in values) if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) && n >= 5) result.Add(n); return result.ToArray();
 }
 private static int[] Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 5, 7 }, Solve(new string[] { "5", "bad", "2147483648", "7", "4" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<string>()));
  Check.Equal(new int[] { 20 }, Solve(new[] { " +20 " }));
 }
}

// ======================================================================
// 89: Decimal pricing and midpoint rounding / scenario 1
// Apply1% tax to a nonnegative decimal subtotal, then round to0 places using ToEven. Reject negative subtotal. No binary floating-point conversion.
// Hint: Use decimal literals with the m suffix throughout.
// Practice: --practice 89; reference: --verify 89
static class E089 {

 public static decimal Practice(decimal subtotal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 89");
 }
 public static decimal Reference(decimal subtotal) {
  if (subtotal < 0) throw new ArgumentOutOfRangeException(nameof(subtotal)); return Math.Round(subtotal * (1m + 1m / 100m), 0, MidpointRounding.ToEven);
 }
 private static decimal Solve(decimal subtotal) => Check.PracticeMode ? Practice(subtotal) : Reference(subtotal);
 public static void Verify() {
  Check.Equal(0m, Solve(0m));
  Check.Equal(101m, Solve(100m));
  Check.Equal(202m, Solve(200m));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1m); });
 }
}

// ======================================================================
// 90: Decimal pricing and midpoint rounding / scenario 2
// Apply2% tax to a nonnegative decimal subtotal, then round to1 places using AwayFromZero. Reject negative subtotal. No binary floating-point conversion.
// Hint: Use decimal literals with the m suffix throughout.
// Practice: --practice 90; reference: --verify 90
static class E090 {

 public static decimal Practice(decimal subtotal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 90");
 }
 public static decimal Reference(decimal subtotal) {
  if (subtotal < 0) throw new ArgumentOutOfRangeException(nameof(subtotal)); return Math.Round(subtotal * (1m + 2m / 100m), 1, MidpointRounding.AwayFromZero);
 }
 private static decimal Solve(decimal subtotal) => Check.PracticeMode ? Practice(subtotal) : Reference(subtotal);
 public static void Verify() {
  Check.Equal(0m, Solve(0m));
  Check.Equal(102m, Solve(100m));
  Check.Equal(204m, Solve(200m));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1m); });
 }
}

// ======================================================================
// 91: Decimal pricing and midpoint rounding / scenario 3
// Apply3% tax to a nonnegative decimal subtotal, then round to2 places using ToEven. Reject negative subtotal. No binary floating-point conversion.
// Hint: Use decimal literals with the m suffix throughout.
// Practice: --practice 91; reference: --verify 91
static class E091 {

 public static decimal Practice(decimal subtotal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 91");
 }
 public static decimal Reference(decimal subtotal) {
  if (subtotal < 0) throw new ArgumentOutOfRangeException(nameof(subtotal)); return Math.Round(subtotal * (1m + 3m / 100m), 2, MidpointRounding.ToEven);
 }
 private static decimal Solve(decimal subtotal) => Check.PracticeMode ? Practice(subtotal) : Reference(subtotal);
 public static void Verify() {
  Check.Equal(0m, Solve(0m));
  Check.Equal(103m, Solve(100m));
  Check.Equal(206m, Solve(200m));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1m); });
 }
}

// ======================================================================
// 92: Decimal pricing and midpoint rounding / scenario 4
// Apply4% tax to a nonnegative decimal subtotal, then round to0 places using AwayFromZero. Reject negative subtotal. No binary floating-point conversion.
// Hint: Use decimal literals with the m suffix throughout.
// Practice: --practice 92; reference: --verify 92
static class E092 {

 public static decimal Practice(decimal subtotal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 92");
 }
 public static decimal Reference(decimal subtotal) {
  if (subtotal < 0) throw new ArgumentOutOfRangeException(nameof(subtotal)); return Math.Round(subtotal * (1m + 4m / 100m), 0, MidpointRounding.AwayFromZero);
 }
 private static decimal Solve(decimal subtotal) => Check.PracticeMode ? Practice(subtotal) : Reference(subtotal);
 public static void Verify() {
  Check.Equal(0m, Solve(0m));
  Check.Equal(104m, Solve(100m));
  Check.Equal(208m, Solve(200m));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1m); });
 }
}

// ======================================================================
// 93: Decimal pricing and midpoint rounding / scenario 5
// Apply5% tax to a nonnegative decimal subtotal, then round to1 places using ToEven. Reject negative subtotal. No binary floating-point conversion.
// Hint: Use decimal literals with the m suffix throughout.
// Practice: --practice 93; reference: --verify 93
static class E093 {

 public static decimal Practice(decimal subtotal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 93");
 }
 public static decimal Reference(decimal subtotal) {
  if (subtotal < 0) throw new ArgumentOutOfRangeException(nameof(subtotal)); return Math.Round(subtotal * (1m + 5m / 100m), 1, MidpointRounding.ToEven);
 }
 private static decimal Solve(decimal subtotal) => Check.PracticeMode ? Practice(subtotal) : Reference(subtotal);
 public static void Verify() {
  Check.Equal(0m, Solve(0m));
  Check.Equal(105m, Solve(100m));
  Check.Equal(210m, Solve(200m));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1m); });
 }
}

// ======================================================================
// 94: Decimal pricing and midpoint rounding / scenario 6
// Apply6% tax to a nonnegative decimal subtotal, then round to2 places using AwayFromZero. Reject negative subtotal. No binary floating-point conversion.
// Hint: Use decimal literals with the m suffix throughout.
// Practice: --practice 94; reference: --verify 94
static class E094 {

 public static decimal Practice(decimal subtotal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 94");
 }
 public static decimal Reference(decimal subtotal) {
  if (subtotal < 0) throw new ArgumentOutOfRangeException(nameof(subtotal)); return Math.Round(subtotal * (1m + 6m / 100m), 2, MidpointRounding.AwayFromZero);
 }
 private static decimal Solve(decimal subtotal) => Check.PracticeMode ? Practice(subtotal) : Reference(subtotal);
 public static void Verify() {
  Check.Equal(0m, Solve(0m));
  Check.Equal(106m, Solve(100m));
  Check.Equal(212m, Solve(200m));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1m); });
 }
}

// ======================================================================
// 95: Decimal pricing and midpoint rounding / scenario 7
// Apply7% tax to a nonnegative decimal subtotal, then round to0 places using ToEven. Reject negative subtotal. No binary floating-point conversion.
// Hint: Use decimal literals with the m suffix throughout.
// Practice: --practice 95; reference: --verify 95
static class E095 {

 public static decimal Practice(decimal subtotal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 95");
 }
 public static decimal Reference(decimal subtotal) {
  if (subtotal < 0) throw new ArgumentOutOfRangeException(nameof(subtotal)); return Math.Round(subtotal * (1m + 7m / 100m), 0, MidpointRounding.ToEven);
 }
 private static decimal Solve(decimal subtotal) => Check.PracticeMode ? Practice(subtotal) : Reference(subtotal);
 public static void Verify() {
  Check.Equal(0m, Solve(0m));
  Check.Equal(107m, Solve(100m));
  Check.Equal(214m, Solve(200m));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1m); });
 }
}

// ======================================================================
// 96: Decimal pricing and midpoint rounding / scenario 8
// Apply8% tax to a nonnegative decimal subtotal, then round to1 places using AwayFromZero. Reject negative subtotal. No binary floating-point conversion.
// Hint: Use decimal literals with the m suffix throughout.
// Practice: --practice 96; reference: --verify 96
static class E096 {

 public static decimal Practice(decimal subtotal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 96");
 }
 public static decimal Reference(decimal subtotal) {
  if (subtotal < 0) throw new ArgumentOutOfRangeException(nameof(subtotal)); return Math.Round(subtotal * (1m + 8m / 100m), 1, MidpointRounding.AwayFromZero);
 }
 private static decimal Solve(decimal subtotal) => Check.PracticeMode ? Practice(subtotal) : Reference(subtotal);
 public static void Verify() {
  Check.Equal(0m, Solve(0m));
  Check.Equal(108m, Solve(100m));
  Check.Equal(216m, Solve(200m));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1m); });
 }
}

// ======================================================================
// 97: Decimal pricing and midpoint rounding / scenario 9
// Apply9% tax to a nonnegative decimal subtotal, then round to2 places using ToEven. Reject negative subtotal. No binary floating-point conversion.
// Hint: Use decimal literals with the m suffix throughout.
// Practice: --practice 97; reference: --verify 97
static class E097 {

 public static decimal Practice(decimal subtotal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 97");
 }
 public static decimal Reference(decimal subtotal) {
  if (subtotal < 0) throw new ArgumentOutOfRangeException(nameof(subtotal)); return Math.Round(subtotal * (1m + 9m / 100m), 2, MidpointRounding.ToEven);
 }
 private static decimal Solve(decimal subtotal) => Check.PracticeMode ? Practice(subtotal) : Reference(subtotal);
 public static void Verify() {
  Check.Equal(0m, Solve(0m));
  Check.Equal(109m, Solve(100m));
  Check.Equal(218m, Solve(200m));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1m); });
 }
}

// ======================================================================
// 98: Decimal pricing and midpoint rounding / scenario 10
// Apply10% tax to a nonnegative decimal subtotal, then round to0 places using AwayFromZero. Reject negative subtotal. No binary floating-point conversion.
// Hint: Use decimal literals with the m suffix throughout.
// Practice: --practice 98; reference: --verify 98
static class E098 {

 public static decimal Practice(decimal subtotal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 98");
 }
 public static decimal Reference(decimal subtotal) {
  if (subtotal < 0) throw new ArgumentOutOfRangeException(nameof(subtotal)); return Math.Round(subtotal * (1m + 10m / 100m), 0, MidpointRounding.AwayFromZero);
 }
 private static decimal Solve(decimal subtotal) => Check.PracticeMode ? Practice(subtotal) : Reference(subtotal);
 public static void Verify() {
  Check.Equal(0m, Solve(0m));
  Check.Equal(110m, Solve(100m));
  Check.Equal(220m, Solve(200m));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1m); });
 }
}

// ======================================================================
// 99: Decimal pricing and midpoint rounding / scenario 11
// Apply11% tax to a nonnegative decimal subtotal, then round to1 places using ToEven. Reject negative subtotal. No binary floating-point conversion.
// Hint: Use decimal literals with the m suffix throughout.
// Practice: --practice 99; reference: --verify 99
static class E099 {

 public static decimal Practice(decimal subtotal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 99");
 }
 public static decimal Reference(decimal subtotal) {
  if (subtotal < 0) throw new ArgumentOutOfRangeException(nameof(subtotal)); return Math.Round(subtotal * (1m + 11m / 100m), 1, MidpointRounding.ToEven);
 }
 private static decimal Solve(decimal subtotal) => Check.PracticeMode ? Practice(subtotal) : Reference(subtotal);
 public static void Verify() {
  Check.Equal(0m, Solve(0m));
  Check.Equal(111m, Solve(100m));
  Check.Equal(222m, Solve(200m));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1m); });
 }
}

// ======================================================================
// 100: Flags enum permissions / scenario 1
// Return true iff granted includes every bit of mask1. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.
// Hint: Checking any bit is not the same as checking every required bit.
// Practice: --practice 100; reference: --verify 100
static class E100 {
[Flags] public enum Permission { None=0, Read=1, Write=2, Execute=4 }
 public static bool Practice(Permission granted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 100");
 }
 public static bool Reference(Permission granted) {
  const Permission required = (Permission)1; return (granted & required) == required;
 }
 private static bool Solve(Permission granted) => Check.PracticeMode ? Practice(granted) : Reference(granted);
 public static void Verify() {
  Check.Equal(true, Solve((Permission)1));
  Check.Equal(true, Solve((Permission)15));
  Check.Equal(false, Solve(Permission.None));
  Check.Equal(true, Solve(Permission.Read));
 }
}

// ======================================================================
// 101: Flags enum permissions / scenario 2
// Return true iff granted includes every bit of mask2. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.
// Hint: Checking any bit is not the same as checking every required bit.
// Practice: --practice 101; reference: --verify 101
static class E101 {
[Flags] public enum Permission { None=0, Read=1, Write=2, Execute=4 }
 public static bool Practice(Permission granted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 101");
 }
 public static bool Reference(Permission granted) {
  const Permission required = (Permission)2; return (granted & required) == required;
 }
 private static bool Solve(Permission granted) => Check.PracticeMode ? Practice(granted) : Reference(granted);
 public static void Verify() {
  Check.Equal(true, Solve((Permission)2));
  Check.Equal(true, Solve((Permission)15));
  Check.Equal(false, Solve(Permission.None));
  Check.Equal(false, Solve(Permission.Read));
 }
}

// ======================================================================
// 102: Flags enum permissions / scenario 3
// Return true iff granted includes every bit of mask3. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.
// Hint: Checking any bit is not the same as checking every required bit.
// Practice: --practice 102; reference: --verify 102
static class E102 {
[Flags] public enum Permission { None=0, Read=1, Write=2, Execute=4 }
 public static bool Practice(Permission granted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 102");
 }
 public static bool Reference(Permission granted) {
  const Permission required = (Permission)3; return (granted & required) == required;
 }
 private static bool Solve(Permission granted) => Check.PracticeMode ? Practice(granted) : Reference(granted);
 public static void Verify() {
  Check.Equal(true, Solve((Permission)3));
  Check.Equal(true, Solve((Permission)15));
  Check.Equal(false, Solve(Permission.None));
  Check.Equal(false, Solve(Permission.Read));
 }
}

// ======================================================================
// 103: Flags enum permissions / scenario 4
// Return true iff granted includes every bit of mask4. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.
// Hint: Checking any bit is not the same as checking every required bit.
// Practice: --practice 103; reference: --verify 103
static class E103 {
[Flags] public enum Permission { None=0, Read=1, Write=2, Execute=4 }
 public static bool Practice(Permission granted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 103");
 }
 public static bool Reference(Permission granted) {
  const Permission required = (Permission)4; return (granted & required) == required;
 }
 private static bool Solve(Permission granted) => Check.PracticeMode ? Practice(granted) : Reference(granted);
 public static void Verify() {
  Check.Equal(true, Solve((Permission)4));
  Check.Equal(true, Solve((Permission)15));
  Check.Equal(false, Solve(Permission.None));
  Check.Equal(false, Solve(Permission.Read));
 }
}

// ======================================================================
// 104: Flags enum permissions / scenario 5
// Return true iff granted includes every bit of mask5. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.
// Hint: Checking any bit is not the same as checking every required bit.
// Practice: --practice 104; reference: --verify 104
static class E104 {
[Flags] public enum Permission { None=0, Read=1, Write=2, Execute=4 }
 public static bool Practice(Permission granted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 104");
 }
 public static bool Reference(Permission granted) {
  const Permission required = (Permission)5; return (granted & required) == required;
 }
 private static bool Solve(Permission granted) => Check.PracticeMode ? Practice(granted) : Reference(granted);
 public static void Verify() {
  Check.Equal(true, Solve((Permission)5));
  Check.Equal(true, Solve((Permission)15));
  Check.Equal(false, Solve(Permission.None));
  Check.Equal(false, Solve(Permission.Read));
 }
}

// ======================================================================
// 105: Flags enum permissions / scenario 6
// Return true iff granted includes every bit of mask6. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.
// Hint: Checking any bit is not the same as checking every required bit.
// Practice: --practice 105; reference: --verify 105
static class E105 {
[Flags] public enum Permission { None=0, Read=1, Write=2, Execute=4 }
 public static bool Practice(Permission granted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 105");
 }
 public static bool Reference(Permission granted) {
  const Permission required = (Permission)6; return (granted & required) == required;
 }
 private static bool Solve(Permission granted) => Check.PracticeMode ? Practice(granted) : Reference(granted);
 public static void Verify() {
  Check.Equal(true, Solve((Permission)6));
  Check.Equal(true, Solve((Permission)15));
  Check.Equal(false, Solve(Permission.None));
  Check.Equal(false, Solve(Permission.Read));
 }
}

// ======================================================================
// 106: Flags enum permissions / scenario 7
// Return true iff granted includes every bit of mask7. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.
// Hint: Checking any bit is not the same as checking every required bit.
// Practice: --practice 106; reference: --verify 106
static class E106 {
[Flags] public enum Permission { None=0, Read=1, Write=2, Execute=4 }
 public static bool Practice(Permission granted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 106");
 }
 public static bool Reference(Permission granted) {
  const Permission required = (Permission)7; return (granted & required) == required;
 }
 private static bool Solve(Permission granted) => Check.PracticeMode ? Practice(granted) : Reference(granted);
 public static void Verify() {
  Check.Equal(true, Solve((Permission)7));
  Check.Equal(true, Solve((Permission)15));
  Check.Equal(false, Solve(Permission.None));
  Check.Equal(false, Solve(Permission.Read));
 }
}

// ======================================================================
// 107: Flags enum permissions / scenario 8
// Return true iff granted includes every bit of mask1. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.
// Hint: Checking any bit is not the same as checking every required bit.
// Practice: --practice 107; reference: --verify 107
static class E107 {
[Flags] public enum Permission { None=0, Read=1, Write=2, Execute=4 }
 public static bool Practice(Permission granted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 107");
 }
 public static bool Reference(Permission granted) {
  const Permission required = (Permission)1; return (granted & required) == required;
 }
 private static bool Solve(Permission granted) => Check.PracticeMode ? Practice(granted) : Reference(granted);
 public static void Verify() {
  Check.Equal(true, Solve((Permission)1));
  Check.Equal(true, Solve((Permission)15));
  Check.Equal(false, Solve(Permission.None));
  Check.Equal(true, Solve(Permission.Read));
 }
}

// ======================================================================
// 108: Flags enum permissions / scenario 9
// Return true iff granted includes every bit of mask2. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.
// Hint: Checking any bit is not the same as checking every required bit.
// Practice: --practice 108; reference: --verify 108
static class E108 {
[Flags] public enum Permission { None=0, Read=1, Write=2, Execute=4 }
 public static bool Practice(Permission granted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 108");
 }
 public static bool Reference(Permission granted) {
  const Permission required = (Permission)2; return (granted & required) == required;
 }
 private static bool Solve(Permission granted) => Check.PracticeMode ? Practice(granted) : Reference(granted);
 public static void Verify() {
  Check.Equal(true, Solve((Permission)2));
  Check.Equal(true, Solve((Permission)15));
  Check.Equal(false, Solve(Permission.None));
  Check.Equal(false, Solve(Permission.Read));
 }
}

// ======================================================================
// 109: Flags enum permissions / scenario 10
// Return true iff granted includes every bit of mask3. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.
// Hint: Checking any bit is not the same as checking every required bit.
// Practice: --practice 109; reference: --verify 109
static class E109 {
[Flags] public enum Permission { None=0, Read=1, Write=2, Execute=4 }
 public static bool Practice(Permission granted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 109");
 }
 public static bool Reference(Permission granted) {
  const Permission required = (Permission)3; return (granted & required) == required;
 }
 private static bool Solve(Permission granted) => Check.PracticeMode ? Practice(granted) : Reference(granted);
 public static void Verify() {
  Check.Equal(true, Solve((Permission)3));
  Check.Equal(true, Solve((Permission)15));
  Check.Equal(false, Solve(Permission.None));
  Check.Equal(false, Solve(Permission.Read));
 }
}

// ======================================================================
// 110: Flags enum permissions / scenario 11
// Return true iff granted includes every bit of mask4. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.
// Hint: Checking any bit is not the same as checking every required bit.
// Practice: --practice 110; reference: --verify 110
static class E110 {
[Flags] public enum Permission { None=0, Read=1, Write=2, Execute=4 }
 public static bool Practice(Permission granted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 110");
 }
 public static bool Reference(Permission granted) {
  const Permission required = (Permission)4; return (granted & required) == required;
 }
 private static bool Solve(Permission granted) => Check.PracticeMode ? Practice(granted) : Reference(granted);
 public static void Verify() {
  Check.Equal(true, Solve((Permission)4));
  Check.Equal(true, Solve((Permission)15));
  Check.Equal(false, Solve(Permission.None));
  Check.Equal(false, Solve(Permission.Read));
 }
}

// ======================================================================
// 111: Pattern matching result types / scenario 1
// Match Success(int Value) and Failure(string Message). Success formats ok:(Value+1); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.
// Hint: Record inheritance supplies data variants; a switch expression handles each case.
// Practice: --practice 111; reference: --verify 111
static class E111 {
public abstract record Result; public sealed record Success(int Value):Result; public sealed record Failure(string Message):Result;
 public static string Practice(Result result) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 111");
 }
 public static string Reference(Result result) {
  return result switch { Success { Value: var n } => $"ok:{n + 1}", Failure { Message: var message } => $"error:{message}", _ => throw new ArgumentException("Unknown result") };
 }
 private static string Solve(Result result) => Check.PracticeMode ? Practice(result) : Reference(result);
 public static void Verify() {
  Check.Equal("ok:3", Solve(new Success(2)));
  Check.Equal("error:offline", Solve(new Failure("offline")));
  Check.Throws<ArgumentException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 112: Pattern matching result types / scenario 2
// Match Success(int Value) and Failure(string Message). Success formats ok:(Value+2); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.
// Hint: Record inheritance supplies data variants; a switch expression handles each case.
// Practice: --practice 112; reference: --verify 112
static class E112 {
public abstract record Result; public sealed record Success(int Value):Result; public sealed record Failure(string Message):Result;
 public static string Practice(Result result) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 112");
 }
 public static string Reference(Result result) {
  return result switch { Success { Value: var n } => $"ok:{n + 2}", Failure { Message: var message } => $"error:{message}", _ => throw new ArgumentException("Unknown result") };
 }
 private static string Solve(Result result) => Check.PracticeMode ? Practice(result) : Reference(result);
 public static void Verify() {
  Check.Equal("ok:4", Solve(new Success(2)));
  Check.Equal("error:offline", Solve(new Failure("offline")));
  Check.Throws<ArgumentException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 113: Pattern matching result types / scenario 3
// Match Success(int Value) and Failure(string Message). Success formats ok:(Value+3); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.
// Hint: Record inheritance supplies data variants; a switch expression handles each case.
// Practice: --practice 113; reference: --verify 113
static class E113 {
public abstract record Result; public sealed record Success(int Value):Result; public sealed record Failure(string Message):Result;
 public static string Practice(Result result) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 113");
 }
 public static string Reference(Result result) {
  return result switch { Success { Value: var n } => $"ok:{n + 3}", Failure { Message: var message } => $"error:{message}", _ => throw new ArgumentException("Unknown result") };
 }
 private static string Solve(Result result) => Check.PracticeMode ? Practice(result) : Reference(result);
 public static void Verify() {
  Check.Equal("ok:5", Solve(new Success(2)));
  Check.Equal("error:offline", Solve(new Failure("offline")));
  Check.Throws<ArgumentException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 114: Pattern matching result types / scenario 4
// Match Success(int Value) and Failure(string Message). Success formats ok:(Value+4); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.
// Hint: Record inheritance supplies data variants; a switch expression handles each case.
// Practice: --practice 114; reference: --verify 114
static class E114 {
public abstract record Result; public sealed record Success(int Value):Result; public sealed record Failure(string Message):Result;
 public static string Practice(Result result) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 114");
 }
 public static string Reference(Result result) {
  return result switch { Success { Value: var n } => $"ok:{n + 4}", Failure { Message: var message } => $"error:{message}", _ => throw new ArgumentException("Unknown result") };
 }
 private static string Solve(Result result) => Check.PracticeMode ? Practice(result) : Reference(result);
 public static void Verify() {
  Check.Equal("ok:6", Solve(new Success(2)));
  Check.Equal("error:offline", Solve(new Failure("offline")));
  Check.Throws<ArgumentException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 115: Pattern matching result types / scenario 5
// Match Success(int Value) and Failure(string Message). Success formats ok:(Value+5); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.
// Hint: Record inheritance supplies data variants; a switch expression handles each case.
// Practice: --practice 115; reference: --verify 115
static class E115 {
public abstract record Result; public sealed record Success(int Value):Result; public sealed record Failure(string Message):Result;
 public static string Practice(Result result) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 115");
 }
 public static string Reference(Result result) {
  return result switch { Success { Value: var n } => $"ok:{n + 5}", Failure { Message: var message } => $"error:{message}", _ => throw new ArgumentException("Unknown result") };
 }
 private static string Solve(Result result) => Check.PracticeMode ? Practice(result) : Reference(result);
 public static void Verify() {
  Check.Equal("ok:7", Solve(new Success(2)));
  Check.Equal("error:offline", Solve(new Failure("offline")));
  Check.Throws<ArgumentException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 116: Pattern matching result types / scenario 6
// Match Success(int Value) and Failure(string Message). Success formats ok:(Value+6); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.
// Hint: Record inheritance supplies data variants; a switch expression handles each case.
// Practice: --practice 116; reference: --verify 116
static class E116 {
public abstract record Result; public sealed record Success(int Value):Result; public sealed record Failure(string Message):Result;
 public static string Practice(Result result) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 116");
 }
 public static string Reference(Result result) {
  return result switch { Success { Value: var n } => $"ok:{n + 6}", Failure { Message: var message } => $"error:{message}", _ => throw new ArgumentException("Unknown result") };
 }
 private static string Solve(Result result) => Check.PracticeMode ? Practice(result) : Reference(result);
 public static void Verify() {
  Check.Equal("ok:8", Solve(new Success(2)));
  Check.Equal("error:offline", Solve(new Failure("offline")));
  Check.Throws<ArgumentException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 117: Pattern matching result types / scenario 7
// Match Success(int Value) and Failure(string Message). Success formats ok:(Value+7); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.
// Hint: Record inheritance supplies data variants; a switch expression handles each case.
// Practice: --practice 117; reference: --verify 117
static class E117 {
public abstract record Result; public sealed record Success(int Value):Result; public sealed record Failure(string Message):Result;
 public static string Practice(Result result) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 117");
 }
 public static string Reference(Result result) {
  return result switch { Success { Value: var n } => $"ok:{n + 7}", Failure { Message: var message } => $"error:{message}", _ => throw new ArgumentException("Unknown result") };
 }
 private static string Solve(Result result) => Check.PracticeMode ? Practice(result) : Reference(result);
 public static void Verify() {
  Check.Equal("ok:9", Solve(new Success(2)));
  Check.Equal("error:offline", Solve(new Failure("offline")));
  Check.Throws<ArgumentException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 118: Pattern matching result types / scenario 8
// Match Success(int Value) and Failure(string Message). Success formats ok:(Value+8); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.
// Hint: Record inheritance supplies data variants; a switch expression handles each case.
// Practice: --practice 118; reference: --verify 118
static class E118 {
public abstract record Result; public sealed record Success(int Value):Result; public sealed record Failure(string Message):Result;
 public static string Practice(Result result) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 118");
 }
 public static string Reference(Result result) {
  return result switch { Success { Value: var n } => $"ok:{n + 8}", Failure { Message: var message } => $"error:{message}", _ => throw new ArgumentException("Unknown result") };
 }
 private static string Solve(Result result) => Check.PracticeMode ? Practice(result) : Reference(result);
 public static void Verify() {
  Check.Equal("ok:10", Solve(new Success(2)));
  Check.Equal("error:offline", Solve(new Failure("offline")));
  Check.Throws<ArgumentException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 119: Pattern matching result types / scenario 9
// Match Success(int Value) and Failure(string Message). Success formats ok:(Value+9); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.
// Hint: Record inheritance supplies data variants; a switch expression handles each case.
// Practice: --practice 119; reference: --verify 119
static class E119 {
public abstract record Result; public sealed record Success(int Value):Result; public sealed record Failure(string Message):Result;
 public static string Practice(Result result) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 119");
 }
 public static string Reference(Result result) {
  return result switch { Success { Value: var n } => $"ok:{n + 9}", Failure { Message: var message } => $"error:{message}", _ => throw new ArgumentException("Unknown result") };
 }
 private static string Solve(Result result) => Check.PracticeMode ? Practice(result) : Reference(result);
 public static void Verify() {
  Check.Equal("ok:11", Solve(new Success(2)));
  Check.Equal("error:offline", Solve(new Failure("offline")));
  Check.Throws<ArgumentException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 120: Pattern matching result types / scenario 10
// Match Success(int Value) and Failure(string Message). Success formats ok:(Value+10); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.
// Hint: Record inheritance supplies data variants; a switch expression handles each case.
// Practice: --practice 120; reference: --verify 120
static class E120 {
public abstract record Result; public sealed record Success(int Value):Result; public sealed record Failure(string Message):Result;
 public static string Practice(Result result) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 120");
 }
 public static string Reference(Result result) {
  return result switch { Success { Value: var n } => $"ok:{n + 10}", Failure { Message: var message } => $"error:{message}", _ => throw new ArgumentException("Unknown result") };
 }
 private static string Solve(Result result) => Check.PracticeMode ? Practice(result) : Reference(result);
 public static void Verify() {
  Check.Equal("ok:12", Solve(new Success(2)));
  Check.Equal("error:offline", Solve(new Failure("offline")));
  Check.Throws<ArgumentException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 121: Pattern matching result types / scenario 11
// Match Success(int Value) and Failure(string Message). Success formats ok:(Value+11); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.
// Hint: Record inheritance supplies data variants; a switch expression handles each case.
// Practice: --practice 121; reference: --verify 121
static class E121 {
public abstract record Result; public sealed record Success(int Value):Result; public sealed record Failure(string Message):Result;
 public static string Practice(Result result) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 121");
 }
 public static string Reference(Result result) {
  return result switch { Success { Value: var n } => $"ok:{n + 11}", Failure { Message: var message } => $"error:{message}", _ => throw new ArgumentException("Unknown result") };
 }
 private static string Solve(Result result) => Check.PracticeMode ? Practice(result) : Reference(result);
 public static void Verify() {
  Check.Equal("ok:13", Solve(new Success(2)));
  Check.Equal("error:offline", Solve(new Failure("offline")));
  Check.Throws<ArgumentException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 122: Immutable record updates / scenario 1
// Return a new Account with Balance increased by1, Name unchanged. Preserve original. Throw OverflowException on int overflow.
// Hint: The with expression copies a record without mutating its source.
// Practice: --practice 122; reference: --verify 122
static class E122 {
public sealed record Account(string Name, int Balance);
 public static Account Practice(Account account) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 122");
 }
 public static Account Reference(Account account) {
  return account with { Balance = checked(account.Balance + 1) };
 }
 private static Account Solve(Account account) => Check.PracticeMode ? Practice(account) : Reference(account);
 public static void Verify() {
  Check.Equal(new Account("Ada", 5), Solve(new Account("Ada", 4)));
  var a = new Account("A", 0); var b = Solve(a); Check.Equal(0, a.Balance); Check.True(!ReferenceEquals(a,b));
  Check.Throws<OverflowException>(() => { Solve(new Account("A", int.MaxValue)); });
 }
}

// ======================================================================
// 123: Immutable record updates / scenario 2
// Return a new Account with Balance increased by2, Name unchanged. Preserve original. Throw OverflowException on int overflow.
// Hint: The with expression copies a record without mutating its source.
// Practice: --practice 123; reference: --verify 123
static class E123 {
public sealed record Account(string Name, int Balance);
 public static Account Practice(Account account) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 123");
 }
 public static Account Reference(Account account) {
  return account with { Balance = checked(account.Balance + 2) };
 }
 private static Account Solve(Account account) => Check.PracticeMode ? Practice(account) : Reference(account);
 public static void Verify() {
  Check.Equal(new Account("Ada", 6), Solve(new Account("Ada", 4)));
  var a = new Account("A", 0); var b = Solve(a); Check.Equal(0, a.Balance); Check.True(!ReferenceEquals(a,b));
  Check.Throws<OverflowException>(() => { Solve(new Account("A", int.MaxValue)); });
 }
}

// ======================================================================
// 124: Immutable record updates / scenario 3
// Return a new Account with Balance increased by3, Name unchanged. Preserve original. Throw OverflowException on int overflow.
// Hint: The with expression copies a record without mutating its source.
// Practice: --practice 124; reference: --verify 124
static class E124 {
public sealed record Account(string Name, int Balance);
 public static Account Practice(Account account) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 124");
 }
 public static Account Reference(Account account) {
  return account with { Balance = checked(account.Balance + 3) };
 }
 private static Account Solve(Account account) => Check.PracticeMode ? Practice(account) : Reference(account);
 public static void Verify() {
  Check.Equal(new Account("Ada", 7), Solve(new Account("Ada", 4)));
  var a = new Account("A", 0); var b = Solve(a); Check.Equal(0, a.Balance); Check.True(!ReferenceEquals(a,b));
  Check.Throws<OverflowException>(() => { Solve(new Account("A", int.MaxValue)); });
 }
}

// ======================================================================
// 125: Immutable record updates / scenario 4
// Return a new Account with Balance increased by4, Name unchanged. Preserve original. Throw OverflowException on int overflow.
// Hint: The with expression copies a record without mutating its source.
// Practice: --practice 125; reference: --verify 125
static class E125 {
public sealed record Account(string Name, int Balance);
 public static Account Practice(Account account) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 125");
 }
 public static Account Reference(Account account) {
  return account with { Balance = checked(account.Balance + 4) };
 }
 private static Account Solve(Account account) => Check.PracticeMode ? Practice(account) : Reference(account);
 public static void Verify() {
  Check.Equal(new Account("Ada", 8), Solve(new Account("Ada", 4)));
  var a = new Account("A", 0); var b = Solve(a); Check.Equal(0, a.Balance); Check.True(!ReferenceEquals(a,b));
  Check.Throws<OverflowException>(() => { Solve(new Account("A", int.MaxValue)); });
 }
}

// ======================================================================
// 126: Immutable record updates / scenario 5
// Return a new Account with Balance increased by5, Name unchanged. Preserve original. Throw OverflowException on int overflow.
// Hint: The with expression copies a record without mutating its source.
// Practice: --practice 126; reference: --verify 126
static class E126 {
public sealed record Account(string Name, int Balance);
 public static Account Practice(Account account) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 126");
 }
 public static Account Reference(Account account) {
  return account with { Balance = checked(account.Balance + 5) };
 }
 private static Account Solve(Account account) => Check.PracticeMode ? Practice(account) : Reference(account);
 public static void Verify() {
  Check.Equal(new Account("Ada", 9), Solve(new Account("Ada", 4)));
  var a = new Account("A", 0); var b = Solve(a); Check.Equal(0, a.Balance); Check.True(!ReferenceEquals(a,b));
  Check.Throws<OverflowException>(() => { Solve(new Account("A", int.MaxValue)); });
 }
}

// ======================================================================
// 127: Immutable record updates / scenario 6
// Return a new Account with Balance increased by6, Name unchanged. Preserve original. Throw OverflowException on int overflow.
// Hint: The with expression copies a record without mutating its source.
// Practice: --practice 127; reference: --verify 127
static class E127 {
public sealed record Account(string Name, int Balance);
 public static Account Practice(Account account) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 127");
 }
 public static Account Reference(Account account) {
  return account with { Balance = checked(account.Balance + 6) };
 }
 private static Account Solve(Account account) => Check.PracticeMode ? Practice(account) : Reference(account);
 public static void Verify() {
  Check.Equal(new Account("Ada", 10), Solve(new Account("Ada", 4)));
  var a = new Account("A", 0); var b = Solve(a); Check.Equal(0, a.Balance); Check.True(!ReferenceEquals(a,b));
  Check.Throws<OverflowException>(() => { Solve(new Account("A", int.MaxValue)); });
 }
}

// ======================================================================
// 128: Immutable record updates / scenario 7
// Return a new Account with Balance increased by7, Name unchanged. Preserve original. Throw OverflowException on int overflow.
// Hint: The with expression copies a record without mutating its source.
// Practice: --practice 128; reference: --verify 128
static class E128 {
public sealed record Account(string Name, int Balance);
 public static Account Practice(Account account) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 128");
 }
 public static Account Reference(Account account) {
  return account with { Balance = checked(account.Balance + 7) };
 }
 private static Account Solve(Account account) => Check.PracticeMode ? Practice(account) : Reference(account);
 public static void Verify() {
  Check.Equal(new Account("Ada", 11), Solve(new Account("Ada", 4)));
  var a = new Account("A", 0); var b = Solve(a); Check.Equal(0, a.Balance); Check.True(!ReferenceEquals(a,b));
  Check.Throws<OverflowException>(() => { Solve(new Account("A", int.MaxValue)); });
 }
}

// ======================================================================
// 129: Immutable record updates / scenario 8
// Return a new Account with Balance increased by8, Name unchanged. Preserve original. Throw OverflowException on int overflow.
// Hint: The with expression copies a record without mutating its source.
// Practice: --practice 129; reference: --verify 129
static class E129 {
public sealed record Account(string Name, int Balance);
 public static Account Practice(Account account) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 129");
 }
 public static Account Reference(Account account) {
  return account with { Balance = checked(account.Balance + 8) };
 }
 private static Account Solve(Account account) => Check.PracticeMode ? Practice(account) : Reference(account);
 public static void Verify() {
  Check.Equal(new Account("Ada", 12), Solve(new Account("Ada", 4)));
  var a = new Account("A", 0); var b = Solve(a); Check.Equal(0, a.Balance); Check.True(!ReferenceEquals(a,b));
  Check.Throws<OverflowException>(() => { Solve(new Account("A", int.MaxValue)); });
 }
}

// ======================================================================
// 130: Immutable record updates / scenario 9
// Return a new Account with Balance increased by9, Name unchanged. Preserve original. Throw OverflowException on int overflow.
// Hint: The with expression copies a record without mutating its source.
// Practice: --practice 130; reference: --verify 130
static class E130 {
public sealed record Account(string Name, int Balance);
 public static Account Practice(Account account) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 130");
 }
 public static Account Reference(Account account) {
  return account with { Balance = checked(account.Balance + 9) };
 }
 private static Account Solve(Account account) => Check.PracticeMode ? Practice(account) : Reference(account);
 public static void Verify() {
  Check.Equal(new Account("Ada", 13), Solve(new Account("Ada", 4)));
  var a = new Account("A", 0); var b = Solve(a); Check.Equal(0, a.Balance); Check.True(!ReferenceEquals(a,b));
  Check.Throws<OverflowException>(() => { Solve(new Account("A", int.MaxValue)); });
 }
}

// ======================================================================
// 131: Immutable record updates / scenario 10
// Return a new Account with Balance increased by10, Name unchanged. Preserve original. Throw OverflowException on int overflow.
// Hint: The with expression copies a record without mutating its source.
// Practice: --practice 131; reference: --verify 131
static class E131 {
public sealed record Account(string Name, int Balance);
 public static Account Practice(Account account) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 131");
 }
 public static Account Reference(Account account) {
  return account with { Balance = checked(account.Balance + 10) };
 }
 private static Account Solve(Account account) => Check.PracticeMode ? Practice(account) : Reference(account);
 public static void Verify() {
  Check.Equal(new Account("Ada", 14), Solve(new Account("Ada", 4)));
  var a = new Account("A", 0); var b = Solve(a); Check.Equal(0, a.Balance); Check.True(!ReferenceEquals(a,b));
  Check.Throws<OverflowException>(() => { Solve(new Account("A", int.MaxValue)); });
 }
}

// ======================================================================
// 132: Immutable record updates / scenario 11
// Return a new Account with Balance increased by11, Name unchanged. Preserve original. Throw OverflowException on int overflow.
// Hint: The with expression copies a record without mutating its source.
// Practice: --practice 132; reference: --verify 132
static class E132 {
public sealed record Account(string Name, int Balance);
 public static Account Practice(Account account) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 132");
 }
 public static Account Reference(Account account) {
  return account with { Balance = checked(account.Balance + 11) };
 }
 private static Account Solve(Account account) => Check.PracticeMode ? Practice(account) : Reference(account);
 public static void Verify() {
  Check.Equal(new Account("Ada", 15), Solve(new Account("Ada", 4)));
  var a = new Account("A", 0); var b = Solve(a); Check.Equal(0, a.Balance); Check.True(!ReferenceEquals(a,b));
  Check.Throws<OverflowException>(() => { Solve(new Account("A", int.MaxValue)); });
 }
}

// ======================================================================
// 133: Nullable fallback rules / scenario 1
// Return supplied nullable integer or fallback-5 when null. Preserve0 and negative values; do not use truthiness-style rules.
// Hint: Null-coalescing examines null, not the numeric value.
// Practice: --practice 133; reference: --verify 133
static class E133 {

 public static int Practice(int? value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 133");
 }
 public static int Reference(int? value) {
  return value ?? -5;
 }
 private static int Solve(int? value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(-5, Solve(null));
  Check.Equal(0, Solve(0));
  Check.Equal(-20, Solve(-20));
  Check.Equal(20, Solve(20));
 }
}

// ======================================================================
// 134: Nullable fallback rules / scenario 2
// Return supplied nullable integer or fallback-4 when null. Preserve0 and negative values; do not use truthiness-style rules.
// Hint: Null-coalescing examines null, not the numeric value.
// Practice: --practice 134; reference: --verify 134
static class E134 {

 public static int Practice(int? value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 134");
 }
 public static int Reference(int? value) {
  return value ?? -4;
 }
 private static int Solve(int? value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(-4, Solve(null));
  Check.Equal(0, Solve(0));
  Check.Equal(-20, Solve(-20));
  Check.Equal(20, Solve(20));
 }
}

// ======================================================================
// 135: Nullable fallback rules / scenario 3
// Return supplied nullable integer or fallback-3 when null. Preserve0 and negative values; do not use truthiness-style rules.
// Hint: Null-coalescing examines null, not the numeric value.
// Practice: --practice 135; reference: --verify 135
static class E135 {

 public static int Practice(int? value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 135");
 }
 public static int Reference(int? value) {
  return value ?? -3;
 }
 private static int Solve(int? value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(-3, Solve(null));
  Check.Equal(0, Solve(0));
  Check.Equal(-20, Solve(-20));
  Check.Equal(20, Solve(20));
 }
}

// ======================================================================
// 136: Nullable fallback rules / scenario 4
// Return supplied nullable integer or fallback-2 when null. Preserve0 and negative values; do not use truthiness-style rules.
// Hint: Null-coalescing examines null, not the numeric value.
// Practice: --practice 136; reference: --verify 136
static class E136 {

 public static int Practice(int? value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 136");
 }
 public static int Reference(int? value) {
  return value ?? -2;
 }
 private static int Solve(int? value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(-2, Solve(null));
  Check.Equal(0, Solve(0));
  Check.Equal(-20, Solve(-20));
  Check.Equal(20, Solve(20));
 }
}

// ======================================================================
// 137: Nullable fallback rules / scenario 5
// Return supplied nullable integer or fallback-1 when null. Preserve0 and negative values; do not use truthiness-style rules.
// Hint: Null-coalescing examines null, not the numeric value.
// Practice: --practice 137; reference: --verify 137
static class E137 {

 public static int Practice(int? value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 137");
 }
 public static int Reference(int? value) {
  return value ?? -1;
 }
 private static int Solve(int? value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(-1, Solve(null));
  Check.Equal(0, Solve(0));
  Check.Equal(-20, Solve(-20));
  Check.Equal(20, Solve(20));
 }
}

// ======================================================================
// 138: Nullable fallback rules / scenario 6
// Return supplied nullable integer or fallback0 when null. Preserve0 and negative values; do not use truthiness-style rules.
// Hint: Null-coalescing examines null, not the numeric value.
// Practice: --practice 138; reference: --verify 138
static class E138 {

 public static int Practice(int? value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 138");
 }
 public static int Reference(int? value) {
  return value ?? 0;
 }
 private static int Solve(int? value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(0, Solve(null));
  Check.Equal(0, Solve(0));
  Check.Equal(-20, Solve(-20));
  Check.Equal(20, Solve(20));
 }
}

// ======================================================================
// 139: Nullable fallback rules / scenario 7
// Return supplied nullable integer or fallback1 when null. Preserve0 and negative values; do not use truthiness-style rules.
// Hint: Null-coalescing examines null, not the numeric value.
// Practice: --practice 139; reference: --verify 139
static class E139 {

 public static int Practice(int? value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 139");
 }
 public static int Reference(int? value) {
  return value ?? 1;
 }
 private static int Solve(int? value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(1, Solve(null));
  Check.Equal(0, Solve(0));
  Check.Equal(-20, Solve(-20));
  Check.Equal(20, Solve(20));
 }
}

// ======================================================================
// 140: Nullable fallback rules / scenario 8
// Return supplied nullable integer or fallback2 when null. Preserve0 and negative values; do not use truthiness-style rules.
// Hint: Null-coalescing examines null, not the numeric value.
// Practice: --practice 140; reference: --verify 140
static class E140 {

 public static int Practice(int? value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 140");
 }
 public static int Reference(int? value) {
  return value ?? 2;
 }
 private static int Solve(int? value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(2, Solve(null));
  Check.Equal(0, Solve(0));
  Check.Equal(-20, Solve(-20));
  Check.Equal(20, Solve(20));
 }
}

// ======================================================================
// 141: Nullable fallback rules / scenario 9
// Return supplied nullable integer or fallback3 when null. Preserve0 and negative values; do not use truthiness-style rules.
// Hint: Null-coalescing examines null, not the numeric value.
// Practice: --practice 141; reference: --verify 141
static class E141 {

 public static int Practice(int? value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 141");
 }
 public static int Reference(int? value) {
  return value ?? 3;
 }
 private static int Solve(int? value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(3, Solve(null));
  Check.Equal(0, Solve(0));
  Check.Equal(-20, Solve(-20));
  Check.Equal(20, Solve(20));
 }
}

// ======================================================================
// 142: Nullable fallback rules / scenario 10
// Return supplied nullable integer or fallback4 when null. Preserve0 and negative values; do not use truthiness-style rules.
// Hint: Null-coalescing examines null, not the numeric value.
// Practice: --practice 142; reference: --verify 142
static class E142 {

 public static int Practice(int? value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 142");
 }
 public static int Reference(int? value) {
  return value ?? 4;
 }
 private static int Solve(int? value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(4, Solve(null));
  Check.Equal(0, Solve(0));
  Check.Equal(-20, Solve(-20));
  Check.Equal(20, Solve(20));
 }
}

// ======================================================================
// 143: Nullable fallback rules / scenario 11
// Return supplied nullable integer or fallback5 when null. Preserve0 and negative values; do not use truthiness-style rules.
// Hint: Null-coalescing examines null, not the numeric value.
// Practice: --practice 143; reference: --verify 143
static class E143 {

 public static int Practice(int? value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 143");
 }
 public static int Reference(int? value) {
  return value ?? 5;
 }
 private static int Solve(int? value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(5, Solve(null));
  Check.Equal(0, Solve(0));
  Check.Equal(-20, Solve(-20));
  Check.Equal(20, Solve(20));
 }
}

// ======================================================================
// 144: Generic stable deduplication / scenario 1
// Return up to1 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.
// Hint: A HashSet detects duplicates while a List retains order.
// Practice: --practice 144; reference: --verify 144
static class E144 {

 public static T[] Practice<T>(IEnumerable<T> values) where T : notnull {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 144");
 }
 public static T[] Reference<T>(IEnumerable<T> values) where T : notnull {
  var seen = new HashSet<T>(); var result = new List<T>(); foreach(var value in values) if(seen.Add(value)) { result.Add(value); if(result.Count == 1) break; } return result.ToArray();
 }
 private static T[] Solve<T>(IEnumerable<T> values) where T : notnull => Check.PracticeMode ? Practice<T>(values) : Reference<T>(values);
 public static void Verify() {
  Check.Equal(new int[] { 1 }, Solve(new[] { 1, 1, 2, 3 }));
  Check.Equal(new string[] { "a" }, Solve(new[] { "a", "a", "b" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
 }
}

// ======================================================================
// 145: Generic stable deduplication / scenario 2
// Return up to2 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.
// Hint: A HashSet detects duplicates while a List retains order.
// Practice: --practice 145; reference: --verify 145
static class E145 {

 public static T[] Practice<T>(IEnumerable<T> values) where T : notnull {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 145");
 }
 public static T[] Reference<T>(IEnumerable<T> values) where T : notnull {
  var seen = new HashSet<T>(); var result = new List<T>(); foreach(var value in values) if(seen.Add(value)) { result.Add(value); if(result.Count == 2) break; } return result.ToArray();
 }
 private static T[] Solve<T>(IEnumerable<T> values) where T : notnull => Check.PracticeMode ? Practice<T>(values) : Reference<T>(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2 }, Solve(new[] { 1, 1, 2, 3 }));
  Check.Equal(new string[] { "a", "b" }, Solve(new[] { "a", "a", "b" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
 }
}

// ======================================================================
// 146: Generic stable deduplication / scenario 3
// Return up to3 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.
// Hint: A HashSet detects duplicates while a List retains order.
// Practice: --practice 146; reference: --verify 146
static class E146 {

 public static T[] Practice<T>(IEnumerable<T> values) where T : notnull {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 146");
 }
 public static T[] Reference<T>(IEnumerable<T> values) where T : notnull {
  var seen = new HashSet<T>(); var result = new List<T>(); foreach(var value in values) if(seen.Add(value)) { result.Add(value); if(result.Count == 3) break; } return result.ToArray();
 }
 private static T[] Solve<T>(IEnumerable<T> values) where T : notnull => Check.PracticeMode ? Practice<T>(values) : Reference<T>(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2, 3 }, Solve(new[] { 1, 1, 2, 3 }));
  Check.Equal(new string[] { "a", "b" }, Solve(new[] { "a", "a", "b" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
 }
}

// ======================================================================
// 147: Generic stable deduplication / scenario 4
// Return up to4 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.
// Hint: A HashSet detects duplicates while a List retains order.
// Practice: --practice 147; reference: --verify 147
static class E147 {

 public static T[] Practice<T>(IEnumerable<T> values) where T : notnull {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 147");
 }
 public static T[] Reference<T>(IEnumerable<T> values) where T : notnull {
  var seen = new HashSet<T>(); var result = new List<T>(); foreach(var value in values) if(seen.Add(value)) { result.Add(value); if(result.Count == 4) break; } return result.ToArray();
 }
 private static T[] Solve<T>(IEnumerable<T> values) where T : notnull => Check.PracticeMode ? Practice<T>(values) : Reference<T>(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2, 3 }, Solve(new[] { 1, 1, 2, 3 }));
  Check.Equal(new string[] { "a", "b" }, Solve(new[] { "a", "a", "b" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
 }
}

// ======================================================================
// 148: Generic stable deduplication / scenario 5
// Return up to5 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.
// Hint: A HashSet detects duplicates while a List retains order.
// Practice: --practice 148; reference: --verify 148
static class E148 {

 public static T[] Practice<T>(IEnumerable<T> values) where T : notnull {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 148");
 }
 public static T[] Reference<T>(IEnumerable<T> values) where T : notnull {
  var seen = new HashSet<T>(); var result = new List<T>(); foreach(var value in values) if(seen.Add(value)) { result.Add(value); if(result.Count == 5) break; } return result.ToArray();
 }
 private static T[] Solve<T>(IEnumerable<T> values) where T : notnull => Check.PracticeMode ? Practice<T>(values) : Reference<T>(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2, 3 }, Solve(new[] { 1, 1, 2, 3 }));
  Check.Equal(new string[] { "a", "b" }, Solve(new[] { "a", "a", "b" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
 }
}

// ======================================================================
// 149: Generic stable deduplication / scenario 6
// Return up to6 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.
// Hint: A HashSet detects duplicates while a List retains order.
// Practice: --practice 149; reference: --verify 149
static class E149 {

 public static T[] Practice<T>(IEnumerable<T> values) where T : notnull {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 149");
 }
 public static T[] Reference<T>(IEnumerable<T> values) where T : notnull {
  var seen = new HashSet<T>(); var result = new List<T>(); foreach(var value in values) if(seen.Add(value)) { result.Add(value); if(result.Count == 6) break; } return result.ToArray();
 }
 private static T[] Solve<T>(IEnumerable<T> values) where T : notnull => Check.PracticeMode ? Practice<T>(values) : Reference<T>(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2, 3 }, Solve(new[] { 1, 1, 2, 3 }));
  Check.Equal(new string[] { "a", "b" }, Solve(new[] { "a", "a", "b" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
 }
}

// ======================================================================
// 150: Generic stable deduplication / scenario 7
// Return up to7 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.
// Hint: A HashSet detects duplicates while a List retains order.
// Practice: --practice 150; reference: --verify 150
static class E150 {

 public static T[] Practice<T>(IEnumerable<T> values) where T : notnull {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 150");
 }
 public static T[] Reference<T>(IEnumerable<T> values) where T : notnull {
  var seen = new HashSet<T>(); var result = new List<T>(); foreach(var value in values) if(seen.Add(value)) { result.Add(value); if(result.Count == 7) break; } return result.ToArray();
 }
 private static T[] Solve<T>(IEnumerable<T> values) where T : notnull => Check.PracticeMode ? Practice<T>(values) : Reference<T>(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2, 3 }, Solve(new[] { 1, 1, 2, 3 }));
  Check.Equal(new string[] { "a", "b" }, Solve(new[] { "a", "a", "b" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
 }
}

// ======================================================================
// 151: Generic stable deduplication / scenario 8
// Return up to8 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.
// Hint: A HashSet detects duplicates while a List retains order.
// Practice: --practice 151; reference: --verify 151
static class E151 {

 public static T[] Practice<T>(IEnumerable<T> values) where T : notnull {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 151");
 }
 public static T[] Reference<T>(IEnumerable<T> values) where T : notnull {
  var seen = new HashSet<T>(); var result = new List<T>(); foreach(var value in values) if(seen.Add(value)) { result.Add(value); if(result.Count == 8) break; } return result.ToArray();
 }
 private static T[] Solve<T>(IEnumerable<T> values) where T : notnull => Check.PracticeMode ? Practice<T>(values) : Reference<T>(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2, 3 }, Solve(new[] { 1, 1, 2, 3 }));
  Check.Equal(new string[] { "a", "b" }, Solve(new[] { "a", "a", "b" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
 }
}

// ======================================================================
// 152: Generic stable deduplication / scenario 9
// Return up to9 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.
// Hint: A HashSet detects duplicates while a List retains order.
// Practice: --practice 152; reference: --verify 152
static class E152 {

 public static T[] Practice<T>(IEnumerable<T> values) where T : notnull {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 152");
 }
 public static T[] Reference<T>(IEnumerable<T> values) where T : notnull {
  var seen = new HashSet<T>(); var result = new List<T>(); foreach(var value in values) if(seen.Add(value)) { result.Add(value); if(result.Count == 9) break; } return result.ToArray();
 }
 private static T[] Solve<T>(IEnumerable<T> values) where T : notnull => Check.PracticeMode ? Practice<T>(values) : Reference<T>(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2, 3 }, Solve(new[] { 1, 1, 2, 3 }));
  Check.Equal(new string[] { "a", "b" }, Solve(new[] { "a", "a", "b" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
 }
}

// ======================================================================
// 153: Generic stable deduplication / scenario 10
// Return up to10 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.
// Hint: A HashSet detects duplicates while a List retains order.
// Practice: --practice 153; reference: --verify 153
static class E153 {

 public static T[] Practice<T>(IEnumerable<T> values) where T : notnull {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 153");
 }
 public static T[] Reference<T>(IEnumerable<T> values) where T : notnull {
  var seen = new HashSet<T>(); var result = new List<T>(); foreach(var value in values) if(seen.Add(value)) { result.Add(value); if(result.Count == 10) break; } return result.ToArray();
 }
 private static T[] Solve<T>(IEnumerable<T> values) where T : notnull => Check.PracticeMode ? Practice<T>(values) : Reference<T>(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2, 3 }, Solve(new[] { 1, 1, 2, 3 }));
  Check.Equal(new string[] { "a", "b" }, Solve(new[] { "a", "a", "b" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
 }
}

// ======================================================================
// 154: Generic stable deduplication / scenario 11
// Return up to11 distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.
// Hint: A HashSet detects duplicates while a List retains order.
// Practice: --practice 154; reference: --verify 154
static class E154 {

 public static T[] Practice<T>(IEnumerable<T> values) where T : notnull {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 154");
 }
 public static T[] Reference<T>(IEnumerable<T> values) where T : notnull {
  var seen = new HashSet<T>(); var result = new List<T>(); foreach(var value in values) if(seen.Add(value)) { result.Add(value); if(result.Count == 11) break; } return result.ToArray();
 }
 private static T[] Solve<T>(IEnumerable<T> values) where T : notnull => Check.PracticeMode ? Practice<T>(values) : Reference<T>(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2, 3 }, Solve(new[] { 1, 1, 2, 3 }));
  Check.Equal(new string[] { "a", "b" }, Solve(new[] { "a", "a", "b" }));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
 }
}

// ======================================================================
// 155: Custom equality comparers / scenario 1
// Count distinct strings using Ordinal comparison. Culture-independent; do not trim whitespace. Scenario1.
// Hint: Passing the comparer avoids allocating normalized strings.
// Practice: --practice 155; reference: --verify 155
static class E155 {

 public static int Practice(IEnumerable<string> names) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 155");
 }
 public static int Reference(IEnumerable<string> names) {
  return names.Distinct(StringComparer.Ordinal).Count();
 }
 private static int Solve(IEnumerable<string> names) => Check.PracticeMode ? Practice(names) : Reference(names);
 public static void Verify() {
  Check.Equal(3, Solve(new[] { "Ada", "ada", "Bo" }));
  Check.Equal(0, Solve(Array.Empty<string>()));
  Check.Equal(2, Solve(new[] { "a", " a" }));
 }
}

// ======================================================================
// 156: Custom equality comparers / scenario 2
// Count distinct strings using OrdinalIgnoreCase comparison. Culture-independent; do not trim whitespace. Scenario2.
// Hint: Passing the comparer avoids allocating normalized strings.
// Practice: --practice 156; reference: --verify 156
static class E156 {

 public static int Practice(IEnumerable<string> names) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 156");
 }
 public static int Reference(IEnumerable<string> names) {
  return names.Distinct(StringComparer.OrdinalIgnoreCase).Count();
 }
 private static int Solve(IEnumerable<string> names) => Check.PracticeMode ? Practice(names) : Reference(names);
 public static void Verify() {
  Check.Equal(2, Solve(new[] { "Ada", "ada", "Bo" }));
  Check.Equal(0, Solve(Array.Empty<string>()));
  Check.Equal(2, Solve(new[] { "a", " a" }));
 }
}

// ======================================================================
// 157: Custom equality comparers / scenario 3
// Count distinct strings using Ordinal comparison. Culture-independent; do not trim whitespace. Scenario3.
// Hint: Passing the comparer avoids allocating normalized strings.
// Practice: --practice 157; reference: --verify 157
static class E157 {

 public static int Practice(IEnumerable<string> names) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 157");
 }
 public static int Reference(IEnumerable<string> names) {
  return names.Distinct(StringComparer.Ordinal).Count();
 }
 private static int Solve(IEnumerable<string> names) => Check.PracticeMode ? Practice(names) : Reference(names);
 public static void Verify() {
  Check.Equal(3, Solve(new[] { "Ada", "ada", "Bo" }));
  Check.Equal(0, Solve(Array.Empty<string>()));
  Check.Equal(2, Solve(new[] { "a", " a" }));
 }
}

// ======================================================================
// 158: Custom equality comparers / scenario 4
// Count distinct strings using OrdinalIgnoreCase comparison. Culture-independent; do not trim whitespace. Scenario4.
// Hint: Passing the comparer avoids allocating normalized strings.
// Practice: --practice 158; reference: --verify 158
static class E158 {

 public static int Practice(IEnumerable<string> names) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 158");
 }
 public static int Reference(IEnumerable<string> names) {
  return names.Distinct(StringComparer.OrdinalIgnoreCase).Count();
 }
 private static int Solve(IEnumerable<string> names) => Check.PracticeMode ? Practice(names) : Reference(names);
 public static void Verify() {
  Check.Equal(2, Solve(new[] { "Ada", "ada", "Bo" }));
  Check.Equal(0, Solve(Array.Empty<string>()));
  Check.Equal(2, Solve(new[] { "a", " a" }));
 }
}

// ======================================================================
// 159: Custom equality comparers / scenario 5
// Count distinct strings using Ordinal comparison. Culture-independent; do not trim whitespace. Scenario5.
// Hint: Passing the comparer avoids allocating normalized strings.
// Practice: --practice 159; reference: --verify 159
static class E159 {

 public static int Practice(IEnumerable<string> names) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 159");
 }
 public static int Reference(IEnumerable<string> names) {
  return names.Distinct(StringComparer.Ordinal).Count();
 }
 private static int Solve(IEnumerable<string> names) => Check.PracticeMode ? Practice(names) : Reference(names);
 public static void Verify() {
  Check.Equal(3, Solve(new[] { "Ada", "ada", "Bo" }));
  Check.Equal(0, Solve(Array.Empty<string>()));
  Check.Equal(2, Solve(new[] { "a", " a" }));
 }
}

// ======================================================================
// 160: Custom equality comparers / scenario 6
// Count distinct strings using OrdinalIgnoreCase comparison. Culture-independent; do not trim whitespace. Scenario6.
// Hint: Passing the comparer avoids allocating normalized strings.
// Practice: --practice 160; reference: --verify 160
static class E160 {

 public static int Practice(IEnumerable<string> names) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 160");
 }
 public static int Reference(IEnumerable<string> names) {
  return names.Distinct(StringComparer.OrdinalIgnoreCase).Count();
 }
 private static int Solve(IEnumerable<string> names) => Check.PracticeMode ? Practice(names) : Reference(names);
 public static void Verify() {
  Check.Equal(2, Solve(new[] { "Ada", "ada", "Bo" }));
  Check.Equal(0, Solve(Array.Empty<string>()));
  Check.Equal(2, Solve(new[] { "a", " a" }));
 }
}

// ======================================================================
// 161: Custom equality comparers / scenario 7
// Count distinct strings using Ordinal comparison. Culture-independent; do not trim whitespace. Scenario7.
// Hint: Passing the comparer avoids allocating normalized strings.
// Practice: --practice 161; reference: --verify 161
static class E161 {

 public static int Practice(IEnumerable<string> names) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 161");
 }
 public static int Reference(IEnumerable<string> names) {
  return names.Distinct(StringComparer.Ordinal).Count();
 }
 private static int Solve(IEnumerable<string> names) => Check.PracticeMode ? Practice(names) : Reference(names);
 public static void Verify() {
  Check.Equal(3, Solve(new[] { "Ada", "ada", "Bo" }));
  Check.Equal(0, Solve(Array.Empty<string>()));
  Check.Equal(2, Solve(new[] { "a", " a" }));
 }
}

// ======================================================================
// 162: Custom equality comparers / scenario 8
// Count distinct strings using OrdinalIgnoreCase comparison. Culture-independent; do not trim whitespace. Scenario8.
// Hint: Passing the comparer avoids allocating normalized strings.
// Practice: --practice 162; reference: --verify 162
static class E162 {

 public static int Practice(IEnumerable<string> names) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 162");
 }
 public static int Reference(IEnumerable<string> names) {
  return names.Distinct(StringComparer.OrdinalIgnoreCase).Count();
 }
 private static int Solve(IEnumerable<string> names) => Check.PracticeMode ? Practice(names) : Reference(names);
 public static void Verify() {
  Check.Equal(2, Solve(new[] { "Ada", "ada", "Bo" }));
  Check.Equal(0, Solve(Array.Empty<string>()));
  Check.Equal(2, Solve(new[] { "a", " a" }));
 }
}

// ======================================================================
// 163: Custom equality comparers / scenario 9
// Count distinct strings using Ordinal comparison. Culture-independent; do not trim whitespace. Scenario9.
// Hint: Passing the comparer avoids allocating normalized strings.
// Practice: --practice 163; reference: --verify 163
static class E163 {

 public static int Practice(IEnumerable<string> names) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 163");
 }
 public static int Reference(IEnumerable<string> names) {
  return names.Distinct(StringComparer.Ordinal).Count();
 }
 private static int Solve(IEnumerable<string> names) => Check.PracticeMode ? Practice(names) : Reference(names);
 public static void Verify() {
  Check.Equal(3, Solve(new[] { "Ada", "ada", "Bo" }));
  Check.Equal(0, Solve(Array.Empty<string>()));
  Check.Equal(2, Solve(new[] { "a", " a" }));
 }
}

// ======================================================================
// 164: Custom equality comparers / scenario 10
// Count distinct strings using OrdinalIgnoreCase comparison. Culture-independent; do not trim whitespace. Scenario10.
// Hint: Passing the comparer avoids allocating normalized strings.
// Practice: --practice 164; reference: --verify 164
static class E164 {

 public static int Practice(IEnumerable<string> names) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 164");
 }
 public static int Reference(IEnumerable<string> names) {
  return names.Distinct(StringComparer.OrdinalIgnoreCase).Count();
 }
 private static int Solve(IEnumerable<string> names) => Check.PracticeMode ? Practice(names) : Reference(names);
 public static void Verify() {
  Check.Equal(2, Solve(new[] { "Ada", "ada", "Bo" }));
  Check.Equal(0, Solve(Array.Empty<string>()));
  Check.Equal(2, Solve(new[] { "a", " a" }));
 }
}

// ======================================================================
// 165: Custom equality comparers / scenario 11
// Count distinct strings using Ordinal comparison. Culture-independent; do not trim whitespace. Scenario11.
// Hint: Passing the comparer avoids allocating normalized strings.
// Practice: --practice 165; reference: --verify 165
static class E165 {

 public static int Practice(IEnumerable<string> names) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 165");
 }
 public static int Reference(IEnumerable<string> names) {
  return names.Distinct(StringComparer.Ordinal).Count();
 }
 private static int Solve(IEnumerable<string> names) => Check.PracticeMode ? Practice(names) : Reference(names);
 public static void Verify() {
  Check.Equal(3, Solve(new[] { "Ada", "ada", "Bo" }));
  Check.Equal(0, Solve(Array.Empty<string>()));
  Check.Equal(2, Solve(new[] { "a", " a" }));
 }
}

// ======================================================================
// 166: Lazy iterator sampling / scenario 1
// Lazily yield elements at zero-based indices divisible by1. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.
// Hint: yield return builds a state machine; it should not call ToArray internally.
// Practice: --practice 166; reference: --verify 166
static class E166 {

 public static IEnumerable<int> Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 166");
 }
 public static IEnumerable<int> Reference(IEnumerable<int> values) {
  int index = 0; foreach (var value in values) { if(index % 1 == 0) yield return value; index++; }
 }
 private static IEnumerable<int> Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 0, 1, 2 }, Solve(Enumerable.Range(0, 3)).ToArray());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).ToArray());
  int visited=0; IEnumerable<int> Source(){for(int i=0;i<100;i++){visited++;yield return i;}} var lazy=Solve(Source()); Check.Equal(0,visited); Check.Equal(0,lazy.First()); Check.Equal(1,visited);
 }
}

// ======================================================================
// 167: Lazy iterator sampling / scenario 2
// Lazily yield elements at zero-based indices divisible by2. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.
// Hint: yield return builds a state machine; it should not call ToArray internally.
// Practice: --practice 167; reference: --verify 167
static class E167 {

 public static IEnumerable<int> Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 167");
 }
 public static IEnumerable<int> Reference(IEnumerable<int> values) {
  int index = 0; foreach (var value in values) { if(index % 2 == 0) yield return value; index++; }
 }
 private static IEnumerable<int> Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 0, 2, 4 }, Solve(Enumerable.Range(0, 6)).ToArray());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).ToArray());
  int visited=0; IEnumerable<int> Source(){for(int i=0;i<100;i++){visited++;yield return i;}} var lazy=Solve(Source()); Check.Equal(0,visited); Check.Equal(0,lazy.First()); Check.Equal(1,visited);
 }
}

// ======================================================================
// 168: Lazy iterator sampling / scenario 3
// Lazily yield elements at zero-based indices divisible by3. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.
// Hint: yield return builds a state machine; it should not call ToArray internally.
// Practice: --practice 168; reference: --verify 168
static class E168 {

 public static IEnumerable<int> Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 168");
 }
 public static IEnumerable<int> Reference(IEnumerable<int> values) {
  int index = 0; foreach (var value in values) { if(index % 3 == 0) yield return value; index++; }
 }
 private static IEnumerable<int> Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 0, 3, 6 }, Solve(Enumerable.Range(0, 9)).ToArray());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).ToArray());
  int visited=0; IEnumerable<int> Source(){for(int i=0;i<100;i++){visited++;yield return i;}} var lazy=Solve(Source()); Check.Equal(0,visited); Check.Equal(0,lazy.First()); Check.Equal(1,visited);
 }
}

// ======================================================================
// 169: Lazy iterator sampling / scenario 4
// Lazily yield elements at zero-based indices divisible by4. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.
// Hint: yield return builds a state machine; it should not call ToArray internally.
// Practice: --practice 169; reference: --verify 169
static class E169 {

 public static IEnumerable<int> Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 169");
 }
 public static IEnumerable<int> Reference(IEnumerable<int> values) {
  int index = 0; foreach (var value in values) { if(index % 4 == 0) yield return value; index++; }
 }
 private static IEnumerable<int> Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 0, 4, 8 }, Solve(Enumerable.Range(0, 12)).ToArray());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).ToArray());
  int visited=0; IEnumerable<int> Source(){for(int i=0;i<100;i++){visited++;yield return i;}} var lazy=Solve(Source()); Check.Equal(0,visited); Check.Equal(0,lazy.First()); Check.Equal(1,visited);
 }
}

// ======================================================================
// 170: Lazy iterator sampling / scenario 5
// Lazily yield elements at zero-based indices divisible by5. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.
// Hint: yield return builds a state machine; it should not call ToArray internally.
// Practice: --practice 170; reference: --verify 170
static class E170 {

 public static IEnumerable<int> Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 170");
 }
 public static IEnumerable<int> Reference(IEnumerable<int> values) {
  int index = 0; foreach (var value in values) { if(index % 5 == 0) yield return value; index++; }
 }
 private static IEnumerable<int> Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 0, 5, 10 }, Solve(Enumerable.Range(0, 15)).ToArray());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).ToArray());
  int visited=0; IEnumerable<int> Source(){for(int i=0;i<100;i++){visited++;yield return i;}} var lazy=Solve(Source()); Check.Equal(0,visited); Check.Equal(0,lazy.First()); Check.Equal(1,visited);
 }
}

// ======================================================================
// 171: Lazy iterator sampling / scenario 6
// Lazily yield elements at zero-based indices divisible by6. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.
// Hint: yield return builds a state machine; it should not call ToArray internally.
// Practice: --practice 171; reference: --verify 171
static class E171 {

 public static IEnumerable<int> Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 171");
 }
 public static IEnumerable<int> Reference(IEnumerable<int> values) {
  int index = 0; foreach (var value in values) { if(index % 6 == 0) yield return value; index++; }
 }
 private static IEnumerable<int> Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 0, 6, 12 }, Solve(Enumerable.Range(0, 18)).ToArray());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).ToArray());
  int visited=0; IEnumerable<int> Source(){for(int i=0;i<100;i++){visited++;yield return i;}} var lazy=Solve(Source()); Check.Equal(0,visited); Check.Equal(0,lazy.First()); Check.Equal(1,visited);
 }
}

// ======================================================================
// 172: Lazy iterator sampling / scenario 7
// Lazily yield elements at zero-based indices divisible by7. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.
// Hint: yield return builds a state machine; it should not call ToArray internally.
// Practice: --practice 172; reference: --verify 172
static class E172 {

 public static IEnumerable<int> Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 172");
 }
 public static IEnumerable<int> Reference(IEnumerable<int> values) {
  int index = 0; foreach (var value in values) { if(index % 7 == 0) yield return value; index++; }
 }
 private static IEnumerable<int> Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 0, 7, 14 }, Solve(Enumerable.Range(0, 21)).ToArray());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).ToArray());
  int visited=0; IEnumerable<int> Source(){for(int i=0;i<100;i++){visited++;yield return i;}} var lazy=Solve(Source()); Check.Equal(0,visited); Check.Equal(0,lazy.First()); Check.Equal(1,visited);
 }
}

// ======================================================================
// 173: Lazy iterator sampling / scenario 8
// Lazily yield elements at zero-based indices divisible by8. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.
// Hint: yield return builds a state machine; it should not call ToArray internally.
// Practice: --practice 173; reference: --verify 173
static class E173 {

 public static IEnumerable<int> Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 173");
 }
 public static IEnumerable<int> Reference(IEnumerable<int> values) {
  int index = 0; foreach (var value in values) { if(index % 8 == 0) yield return value; index++; }
 }
 private static IEnumerable<int> Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 0, 8, 16 }, Solve(Enumerable.Range(0, 24)).ToArray());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).ToArray());
  int visited=0; IEnumerable<int> Source(){for(int i=0;i<100;i++){visited++;yield return i;}} var lazy=Solve(Source()); Check.Equal(0,visited); Check.Equal(0,lazy.First()); Check.Equal(1,visited);
 }
}

// ======================================================================
// 174: Lazy iterator sampling / scenario 9
// Lazily yield elements at zero-based indices divisible by9. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.
// Hint: yield return builds a state machine; it should not call ToArray internally.
// Practice: --practice 174; reference: --verify 174
static class E174 {

 public static IEnumerable<int> Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 174");
 }
 public static IEnumerable<int> Reference(IEnumerable<int> values) {
  int index = 0; foreach (var value in values) { if(index % 9 == 0) yield return value; index++; }
 }
 private static IEnumerable<int> Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 0, 9, 18 }, Solve(Enumerable.Range(0, 27)).ToArray());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).ToArray());
  int visited=0; IEnumerable<int> Source(){for(int i=0;i<100;i++){visited++;yield return i;}} var lazy=Solve(Source()); Check.Equal(0,visited); Check.Equal(0,lazy.First()); Check.Equal(1,visited);
 }
}

// ======================================================================
// 175: Lazy iterator sampling / scenario 10
// Lazily yield elements at zero-based indices divisible by10. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.
// Hint: yield return builds a state machine; it should not call ToArray internally.
// Practice: --practice 175; reference: --verify 175
static class E175 {

 public static IEnumerable<int> Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 175");
 }
 public static IEnumerable<int> Reference(IEnumerable<int> values) {
  int index = 0; foreach (var value in values) { if(index % 10 == 0) yield return value; index++; }
 }
 private static IEnumerable<int> Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 0, 10, 20 }, Solve(Enumerable.Range(0, 30)).ToArray());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).ToArray());
  int visited=0; IEnumerable<int> Source(){for(int i=0;i<100;i++){visited++;yield return i;}} var lazy=Solve(Source()); Check.Equal(0,visited); Check.Equal(0,lazy.First()); Check.Equal(1,visited);
 }
}

// ======================================================================
// 176: Lazy iterator sampling / scenario 11
// Lazily yield elements at zero-based indices divisible by11. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.
// Hint: yield return builds a state machine; it should not call ToArray internally.
// Practice: --practice 176; reference: --verify 176
static class E176 {

 public static IEnumerable<int> Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 176");
 }
 public static IEnumerable<int> Reference(IEnumerable<int> values) {
  int index = 0; foreach (var value in values) { if(index % 11 == 0) yield return value; index++; }
 }
 private static IEnumerable<int> Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 0, 11, 22 }, Solve(Enumerable.Range(0, 33)).ToArray());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).ToArray());
  int visited=0; IEnumerable<int> Source(){for(int i=0;i<100;i++){visited++;yield return i;}} var lazy=Solve(Source()); Check.Equal(0,visited); Check.Equal(0,lazy.First()); Check.Equal(1,visited);
 }
}

// ======================================================================
// 177: Span-based parsing / scenario 1
// Read first signed int32 before ':' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.
// Hint: Span slicing avoids allocating a substring.
// Practice: --practice 177; reference: --verify 177
static class E177 {

 public static int Practice(ReadOnlySpan<char> text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 177");
 }
 public static int Reference(ReadOnlySpan<char> text) {
  int split = text.IndexOf(':'); var token = split < 0 ? text : text[..split]; if (!int.TryParse(token, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value)) throw new FormatException("Invalid first integer"); return value;
 }
 private static int Solve(ReadOnlySpan<char> text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(42, Solve("42:ignored".AsSpan()));
  Check.Equal(-2, Solve(" -2 ".AsSpan()));
  Check.Throws<FormatException>(() => { Solve("x:1".AsSpan()); });
  Check.Throws<FormatException>(() => { Solve("2147483648".AsSpan()); });
 }
}

// ======================================================================
// 178: Span-based parsing / scenario 2
// Read first signed int32 before ',' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.
// Hint: Span slicing avoids allocating a substring.
// Practice: --practice 178; reference: --verify 178
static class E178 {

 public static int Practice(ReadOnlySpan<char> text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 178");
 }
 public static int Reference(ReadOnlySpan<char> text) {
  int split = text.IndexOf(','); var token = split < 0 ? text : text[..split]; if (!int.TryParse(token, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value)) throw new FormatException("Invalid first integer"); return value;
 }
 private static int Solve(ReadOnlySpan<char> text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(42, Solve("42,ignored".AsSpan()));
  Check.Equal(-2, Solve(" -2 ".AsSpan()));
  Check.Throws<FormatException>(() => { Solve("x,1".AsSpan()); });
  Check.Throws<FormatException>(() => { Solve("2147483648".AsSpan()); });
 }
}

// ======================================================================
// 179: Span-based parsing / scenario 3
// Read first signed int32 before ';' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.
// Hint: Span slicing avoids allocating a substring.
// Practice: --practice 179; reference: --verify 179
static class E179 {

 public static int Practice(ReadOnlySpan<char> text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 179");
 }
 public static int Reference(ReadOnlySpan<char> text) {
  int split = text.IndexOf(';'); var token = split < 0 ? text : text[..split]; if (!int.TryParse(token, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value)) throw new FormatException("Invalid first integer"); return value;
 }
 private static int Solve(ReadOnlySpan<char> text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(42, Solve("42;ignored".AsSpan()));
  Check.Equal(-2, Solve(" -2 ".AsSpan()));
  Check.Throws<FormatException>(() => { Solve("x;1".AsSpan()); });
  Check.Throws<FormatException>(() => { Solve("2147483648".AsSpan()); });
 }
}

// ======================================================================
// 180: Span-based parsing / scenario 4
// Read first signed int32 before '|' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.
// Hint: Span slicing avoids allocating a substring.
// Practice: --practice 180; reference: --verify 180
static class E180 {

 public static int Practice(ReadOnlySpan<char> text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 180");
 }
 public static int Reference(ReadOnlySpan<char> text) {
  int split = text.IndexOf('|'); var token = split < 0 ? text : text[..split]; if (!int.TryParse(token, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value)) throw new FormatException("Invalid first integer"); return value;
 }
 private static int Solve(ReadOnlySpan<char> text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(42, Solve("42|ignored".AsSpan()));
  Check.Equal(-2, Solve(" -2 ".AsSpan()));
  Check.Throws<FormatException>(() => { Solve("x|1".AsSpan()); });
  Check.Throws<FormatException>(() => { Solve("2147483648".AsSpan()); });
 }
}

// ======================================================================
// 181: Span-based parsing / scenario 5
// Read first signed int32 before ':' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.
// Hint: Span slicing avoids allocating a substring.
// Practice: --practice 181; reference: --verify 181
static class E181 {

 public static int Practice(ReadOnlySpan<char> text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 181");
 }
 public static int Reference(ReadOnlySpan<char> text) {
  int split = text.IndexOf(':'); var token = split < 0 ? text : text[..split]; if (!int.TryParse(token, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value)) throw new FormatException("Invalid first integer"); return value;
 }
 private static int Solve(ReadOnlySpan<char> text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(42, Solve("42:ignored".AsSpan()));
  Check.Equal(-2, Solve(" -2 ".AsSpan()));
  Check.Throws<FormatException>(() => { Solve("x:1".AsSpan()); });
  Check.Throws<FormatException>(() => { Solve("2147483648".AsSpan()); });
 }
}

// ======================================================================
// 182: Span-based parsing / scenario 6
// Read first signed int32 before ',' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.
// Hint: Span slicing avoids allocating a substring.
// Practice: --practice 182; reference: --verify 182
static class E182 {

 public static int Practice(ReadOnlySpan<char> text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 182");
 }
 public static int Reference(ReadOnlySpan<char> text) {
  int split = text.IndexOf(','); var token = split < 0 ? text : text[..split]; if (!int.TryParse(token, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value)) throw new FormatException("Invalid first integer"); return value;
 }
 private static int Solve(ReadOnlySpan<char> text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(42, Solve("42,ignored".AsSpan()));
  Check.Equal(-2, Solve(" -2 ".AsSpan()));
  Check.Throws<FormatException>(() => { Solve("x,1".AsSpan()); });
  Check.Throws<FormatException>(() => { Solve("2147483648".AsSpan()); });
 }
}

// ======================================================================
// 183: Span-based parsing / scenario 7
// Read first signed int32 before ';' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.
// Hint: Span slicing avoids allocating a substring.
// Practice: --practice 183; reference: --verify 183
static class E183 {

 public static int Practice(ReadOnlySpan<char> text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 183");
 }
 public static int Reference(ReadOnlySpan<char> text) {
  int split = text.IndexOf(';'); var token = split < 0 ? text : text[..split]; if (!int.TryParse(token, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value)) throw new FormatException("Invalid first integer"); return value;
 }
 private static int Solve(ReadOnlySpan<char> text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(42, Solve("42;ignored".AsSpan()));
  Check.Equal(-2, Solve(" -2 ".AsSpan()));
  Check.Throws<FormatException>(() => { Solve("x;1".AsSpan()); });
  Check.Throws<FormatException>(() => { Solve("2147483648".AsSpan()); });
 }
}

// ======================================================================
// 184: Span-based parsing / scenario 8
// Read first signed int32 before '|' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.
// Hint: Span slicing avoids allocating a substring.
// Practice: --practice 184; reference: --verify 184
static class E184 {

 public static int Practice(ReadOnlySpan<char> text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 184");
 }
 public static int Reference(ReadOnlySpan<char> text) {
  int split = text.IndexOf('|'); var token = split < 0 ? text : text[..split]; if (!int.TryParse(token, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value)) throw new FormatException("Invalid first integer"); return value;
 }
 private static int Solve(ReadOnlySpan<char> text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(42, Solve("42|ignored".AsSpan()));
  Check.Equal(-2, Solve(" -2 ".AsSpan()));
  Check.Throws<FormatException>(() => { Solve("x|1".AsSpan()); });
  Check.Throws<FormatException>(() => { Solve("2147483648".AsSpan()); });
 }
}

// ======================================================================
// 185: Span-based parsing / scenario 9
// Read first signed int32 before ':' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.
// Hint: Span slicing avoids allocating a substring.
// Practice: --practice 185; reference: --verify 185
static class E185 {

 public static int Practice(ReadOnlySpan<char> text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 185");
 }
 public static int Reference(ReadOnlySpan<char> text) {
  int split = text.IndexOf(':'); var token = split < 0 ? text : text[..split]; if (!int.TryParse(token, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value)) throw new FormatException("Invalid first integer"); return value;
 }
 private static int Solve(ReadOnlySpan<char> text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(42, Solve("42:ignored".AsSpan()));
  Check.Equal(-2, Solve(" -2 ".AsSpan()));
  Check.Throws<FormatException>(() => { Solve("x:1".AsSpan()); });
  Check.Throws<FormatException>(() => { Solve("2147483648".AsSpan()); });
 }
}

// ======================================================================
// 186: Span-based parsing / scenario 10
// Read first signed int32 before ',' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.
// Hint: Span slicing avoids allocating a substring.
// Practice: --practice 186; reference: --verify 186
static class E186 {

 public static int Practice(ReadOnlySpan<char> text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 186");
 }
 public static int Reference(ReadOnlySpan<char> text) {
  int split = text.IndexOf(','); var token = split < 0 ? text : text[..split]; if (!int.TryParse(token, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value)) throw new FormatException("Invalid first integer"); return value;
 }
 private static int Solve(ReadOnlySpan<char> text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(42, Solve("42,ignored".AsSpan()));
  Check.Equal(-2, Solve(" -2 ".AsSpan()));
  Check.Throws<FormatException>(() => { Solve("x,1".AsSpan()); });
  Check.Throws<FormatException>(() => { Solve("2147483648".AsSpan()); });
 }
}

// ======================================================================
// 187: Span-based parsing / scenario 11
// Read first signed int32 before ';' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.
// Hint: Span slicing avoids allocating a substring.
// Practice: --practice 187; reference: --verify 187
static class E187 {

 public static int Practice(ReadOnlySpan<char> text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 187");
 }
 public static int Reference(ReadOnlySpan<char> text) {
  int split = text.IndexOf(';'); var token = split < 0 ? text : text[..split]; if (!int.TryParse(token, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value)) throw new FormatException("Invalid first integer"); return value;
 }
 private static int Solve(ReadOnlySpan<char> text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(42, Solve("42;ignored".AsSpan()));
  Check.Equal(-2, Solve(" -2 ".AsSpan()));
  Check.Throws<FormatException>(() => { Solve("x;1".AsSpan()); });
  Check.Throws<FormatException>(() => { Solve("2147483648".AsSpan()); });
 }
}

// ======================================================================
// 188: Unicode Rune counting / scenario 1
// Count Unicode scalar values with code point >=65. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.
// Hint: String.Length counts code units; Rune enumeration counts scalar values.
// Practice: --practice 188; reference: --verify 188
static class E188 {

 public static int Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 188");
 }
 public static int Reference(string text) {
  int count=0; foreach(var rune in text.EnumerateRunes()) if(rune.Value >= 65) count++; return count;
 }
 private static int Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(0, Solve(""));
  Check.Equal(1, Solve("A"));
  Check.Equal(1, Solve("😀"));
  Check.Equal(0, Solve("012"));
 }
}

// ======================================================================
// 189: Unicode Rune counting / scenario 2
// Count Unicode scalar values with code point >=66. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.
// Hint: String.Length counts code units; Rune enumeration counts scalar values.
// Practice: --practice 189; reference: --verify 189
static class E189 {

 public static int Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 189");
 }
 public static int Reference(string text) {
  int count=0; foreach(var rune in text.EnumerateRunes()) if(rune.Value >= 66) count++; return count;
 }
 private static int Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(0, Solve(""));
  Check.Equal(1, Solve("B"));
  Check.Equal(1, Solve("😀"));
  Check.Equal(0, Solve("012"));
 }
}

// ======================================================================
// 190: Unicode Rune counting / scenario 3
// Count Unicode scalar values with code point >=67. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.
// Hint: String.Length counts code units; Rune enumeration counts scalar values.
// Practice: --practice 190; reference: --verify 190
static class E190 {

 public static int Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 190");
 }
 public static int Reference(string text) {
  int count=0; foreach(var rune in text.EnumerateRunes()) if(rune.Value >= 67) count++; return count;
 }
 private static int Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(0, Solve(""));
  Check.Equal(1, Solve("C"));
  Check.Equal(1, Solve("😀"));
  Check.Equal(0, Solve("012"));
 }
}

// ======================================================================
// 191: Unicode Rune counting / scenario 4
// Count Unicode scalar values with code point >=68. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.
// Hint: String.Length counts code units; Rune enumeration counts scalar values.
// Practice: --practice 191; reference: --verify 191
static class E191 {

 public static int Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 191");
 }
 public static int Reference(string text) {
  int count=0; foreach(var rune in text.EnumerateRunes()) if(rune.Value >= 68) count++; return count;
 }
 private static int Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(0, Solve(""));
  Check.Equal(1, Solve("D"));
  Check.Equal(1, Solve("😀"));
  Check.Equal(0, Solve("012"));
 }
}

// ======================================================================
// 192: Unicode Rune counting / scenario 5
// Count Unicode scalar values with code point >=69. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.
// Hint: String.Length counts code units; Rune enumeration counts scalar values.
// Practice: --practice 192; reference: --verify 192
static class E192 {

 public static int Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 192");
 }
 public static int Reference(string text) {
  int count=0; foreach(var rune in text.EnumerateRunes()) if(rune.Value >= 69) count++; return count;
 }
 private static int Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(0, Solve(""));
  Check.Equal(1, Solve("E"));
  Check.Equal(1, Solve("😀"));
  Check.Equal(0, Solve("012"));
 }
}

// ======================================================================
// 193: Unicode Rune counting / scenario 6
// Count Unicode scalar values with code point >=70. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.
// Hint: String.Length counts code units; Rune enumeration counts scalar values.
// Practice: --practice 193; reference: --verify 193
static class E193 {

 public static int Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 193");
 }
 public static int Reference(string text) {
  int count=0; foreach(var rune in text.EnumerateRunes()) if(rune.Value >= 70) count++; return count;
 }
 private static int Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(0, Solve(""));
  Check.Equal(1, Solve("F"));
  Check.Equal(1, Solve("😀"));
  Check.Equal(0, Solve("012"));
 }
}

// ======================================================================
// 194: Unicode Rune counting / scenario 7
// Count Unicode scalar values with code point >=71. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.
// Hint: String.Length counts code units; Rune enumeration counts scalar values.
// Practice: --practice 194; reference: --verify 194
static class E194 {

 public static int Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 194");
 }
 public static int Reference(string text) {
  int count=0; foreach(var rune in text.EnumerateRunes()) if(rune.Value >= 71) count++; return count;
 }
 private static int Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(0, Solve(""));
  Check.Equal(1, Solve("G"));
  Check.Equal(1, Solve("😀"));
  Check.Equal(0, Solve("012"));
 }
}

// ======================================================================
// 195: Unicode Rune counting / scenario 8
// Count Unicode scalar values with code point >=72. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.
// Hint: String.Length counts code units; Rune enumeration counts scalar values.
// Practice: --practice 195; reference: --verify 195
static class E195 {

 public static int Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 195");
 }
 public static int Reference(string text) {
  int count=0; foreach(var rune in text.EnumerateRunes()) if(rune.Value >= 72) count++; return count;
 }
 private static int Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(0, Solve(""));
  Check.Equal(1, Solve("H"));
  Check.Equal(1, Solve("😀"));
  Check.Equal(0, Solve("012"));
 }
}

// ======================================================================
// 196: Unicode Rune counting / scenario 9
// Count Unicode scalar values with code point >=73. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.
// Hint: String.Length counts code units; Rune enumeration counts scalar values.
// Practice: --practice 196; reference: --verify 196
static class E196 {

 public static int Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 196");
 }
 public static int Reference(string text) {
  int count=0; foreach(var rune in text.EnumerateRunes()) if(rune.Value >= 73) count++; return count;
 }
 private static int Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(0, Solve(""));
  Check.Equal(1, Solve("I"));
  Check.Equal(1, Solve("😀"));
  Check.Equal(0, Solve("012"));
 }
}

// ======================================================================
// 197: Unicode Rune counting / scenario 10
// Count Unicode scalar values with code point >=74. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.
// Hint: String.Length counts code units; Rune enumeration counts scalar values.
// Practice: --practice 197; reference: --verify 197
static class E197 {

 public static int Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 197");
 }
 public static int Reference(string text) {
  int count=0; foreach(var rune in text.EnumerateRunes()) if(rune.Value >= 74) count++; return count;
 }
 private static int Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(0, Solve(""));
  Check.Equal(1, Solve("J"));
  Check.Equal(1, Solve("😀"));
  Check.Equal(0, Solve("012"));
 }
}

// ======================================================================
// 198: Unicode Rune counting / scenario 11
// Count Unicode scalar values with code point >=75. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.
// Hint: String.Length counts code units; Rune enumeration counts scalar values.
// Practice: --practice 198; reference: --verify 198
static class E198 {

 public static int Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 198");
 }
 public static int Reference(string text) {
  int count=0; foreach(var rune in text.EnumerateRunes()) if(rune.Value >= 75) count++; return count;
 }
 private static int Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(0, Solve(""));
  Check.Equal(1, Solve("K"));
  Check.Equal(1, Solve("😀"));
  Check.Equal(0, Solve("012"));
 }
}

// ======================================================================
// 199: Regular expression capture extraction / scenario 1
// Extract maximal ASCII-letter runs, retaining words of length >=1. Preserve case/order. Digits/punctuation split runs.
// Hint: Regex.Matches supplies Match objects; project Value explicitly.
// Practice: --practice 199; reference: --verify 199
static class E199 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 199");
 }
 public static string[] Reference(string text) {
  return Regex.Matches(text, @"[A-Za-z]+").Select(m => m.Value).Where(word => word.Length >= 1).ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "a" }, Solve("1a"));
  Check.Equal(new string[] {  }, Solve("123--"));
  Check.Equal(new string[] {  }, Solve(""));
 }
}

// ======================================================================
// 200: Regular expression capture extraction / scenario 2
// Extract maximal ASCII-letter runs, retaining words of length >=2. Preserve case/order. Digits/punctuation split runs.
// Hint: Regex.Matches supplies Match objects; project Value explicitly.
// Practice: --practice 200; reference: --verify 200
static class E200 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 200");
 }
 public static string[] Reference(string text) {
  return Regex.Matches(text, @"[A-Za-z]+").Select(m => m.Value).Where(word => word.Length >= 2).ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aa" }, Solve("x1aa"));
  Check.Equal(new string[] {  }, Solve("123--"));
  Check.Equal(new string[] {  }, Solve(""));
 }
}

// ======================================================================
// 201: Regular expression capture extraction / scenario 3
// Extract maximal ASCII-letter runs, retaining words of length >=3. Preserve case/order. Digits/punctuation split runs.
// Hint: Regex.Matches supplies Match objects; project Value explicitly.
// Practice: --practice 201; reference: --verify 201
static class E201 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 201");
 }
 public static string[] Reference(string text) {
  return Regex.Matches(text, @"[A-Za-z]+").Select(m => m.Value).Where(word => word.Length >= 3).ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaa" }, Solve("xx1aaa"));
  Check.Equal(new string[] {  }, Solve("123--"));
  Check.Equal(new string[] {  }, Solve(""));
 }
}

// ======================================================================
// 202: Regular expression capture extraction / scenario 4
// Extract maximal ASCII-letter runs, retaining words of length >=4. Preserve case/order. Digits/punctuation split runs.
// Hint: Regex.Matches supplies Match objects; project Value explicitly.
// Practice: --practice 202; reference: --verify 202
static class E202 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 202");
 }
 public static string[] Reference(string text) {
  return Regex.Matches(text, @"[A-Za-z]+").Select(m => m.Value).Where(word => word.Length >= 4).ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaa" }, Solve("xxx1aaaa"));
  Check.Equal(new string[] {  }, Solve("123--"));
  Check.Equal(new string[] {  }, Solve(""));
 }
}

// ======================================================================
// 203: Regular expression capture extraction / scenario 5
// Extract maximal ASCII-letter runs, retaining words of length >=5. Preserve case/order. Digits/punctuation split runs.
// Hint: Regex.Matches supplies Match objects; project Value explicitly.
// Practice: --practice 203; reference: --verify 203
static class E203 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 203");
 }
 public static string[] Reference(string text) {
  return Regex.Matches(text, @"[A-Za-z]+").Select(m => m.Value).Where(word => word.Length >= 5).ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaaa" }, Solve("xxxx1aaaaa"));
  Check.Equal(new string[] {  }, Solve("123--"));
  Check.Equal(new string[] {  }, Solve(""));
 }
}

// ======================================================================
// 204: Regular expression capture extraction / scenario 6
// Extract maximal ASCII-letter runs, retaining words of length >=6. Preserve case/order. Digits/punctuation split runs.
// Hint: Regex.Matches supplies Match objects; project Value explicitly.
// Practice: --practice 204; reference: --verify 204
static class E204 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 204");
 }
 public static string[] Reference(string text) {
  return Regex.Matches(text, @"[A-Za-z]+").Select(m => m.Value).Where(word => word.Length >= 6).ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaaaa" }, Solve("xxxxx1aaaaaa"));
  Check.Equal(new string[] {  }, Solve("123--"));
  Check.Equal(new string[] {  }, Solve(""));
 }
}

// ======================================================================
// 205: Regular expression capture extraction / scenario 7
// Extract maximal ASCII-letter runs, retaining words of length >=7. Preserve case/order. Digits/punctuation split runs.
// Hint: Regex.Matches supplies Match objects; project Value explicitly.
// Practice: --practice 205; reference: --verify 205
static class E205 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 205");
 }
 public static string[] Reference(string text) {
  return Regex.Matches(text, @"[A-Za-z]+").Select(m => m.Value).Where(word => word.Length >= 7).ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaaaaa" }, Solve("xxxxxx1aaaaaaa"));
  Check.Equal(new string[] {  }, Solve("123--"));
  Check.Equal(new string[] {  }, Solve(""));
 }
}

// ======================================================================
// 206: Regular expression capture extraction / scenario 8
// Extract maximal ASCII-letter runs, retaining words of length >=8. Preserve case/order. Digits/punctuation split runs.
// Hint: Regex.Matches supplies Match objects; project Value explicitly.
// Practice: --practice 206; reference: --verify 206
static class E206 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 206");
 }
 public static string[] Reference(string text) {
  return Regex.Matches(text, @"[A-Za-z]+").Select(m => m.Value).Where(word => word.Length >= 8).ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaaaaaa" }, Solve("xxxxxxx1aaaaaaaa"));
  Check.Equal(new string[] {  }, Solve("123--"));
  Check.Equal(new string[] {  }, Solve(""));
 }
}

// ======================================================================
// 207: Regular expression capture extraction / scenario 9
// Extract maximal ASCII-letter runs, retaining words of length >=9. Preserve case/order. Digits/punctuation split runs.
// Hint: Regex.Matches supplies Match objects; project Value explicitly.
// Practice: --practice 207; reference: --verify 207
static class E207 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 207");
 }
 public static string[] Reference(string text) {
  return Regex.Matches(text, @"[A-Za-z]+").Select(m => m.Value).Where(word => word.Length >= 9).ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaaaaaaa" }, Solve("xxxxxxxx1aaaaaaaaa"));
  Check.Equal(new string[] {  }, Solve("123--"));
  Check.Equal(new string[] {  }, Solve(""));
 }
}

// ======================================================================
// 208: Regular expression capture extraction / scenario 10
// Extract maximal ASCII-letter runs, retaining words of length >=10. Preserve case/order. Digits/punctuation split runs.
// Hint: Regex.Matches supplies Match objects; project Value explicitly.
// Practice: --practice 208; reference: --verify 208
static class E208 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 208");
 }
 public static string[] Reference(string text) {
  return Regex.Matches(text, @"[A-Za-z]+").Select(m => m.Value).Where(word => word.Length >= 10).ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaaaaaaaa" }, Solve("xxxxxxxxx1aaaaaaaaaa"));
  Check.Equal(new string[] {  }, Solve("123--"));
  Check.Equal(new string[] {  }, Solve(""));
 }
}

// ======================================================================
// 209: Regular expression capture extraction / scenario 11
// Extract maximal ASCII-letter runs, retaining words of length >=11. Preserve case/order. Digits/punctuation split runs.
// Hint: Regex.Matches supplies Match objects; project Value explicitly.
// Practice: --practice 209; reference: --verify 209
static class E209 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 209");
 }
 public static string[] Reference(string text) {
  return Regex.Matches(text, @"[A-Za-z]+").Select(m => m.Value).Where(word => word.Length >= 11).ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaaaaaaaaa" }, Solve("xxxxxxxxxx1aaaaaaaaaaa"));
  Check.Equal(new string[] {  }, Solve("123--"));
  Check.Equal(new string[] {  }, Solve(""));
 }
}

// ======================================================================
// 210: JSON property selection / scenario 1
// Parse JSON; return int32 property 'field0' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.
// Hint: JsonElement values depend on document lifetime; return a copied int, not the element.
// Practice: --practice 210; reference: --verify 210
static class E210 {

 public static int? Practice(string json) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 210");
 }
 public static int? Reference(string json) {
  using var doc = JsonDocument.Parse(json); if(doc.RootElement.ValueKind != JsonValueKind.Object) return null; if(!doc.RootElement.TryGetProperty("field0", out var property) || property.ValueKind != JsonValueKind.Number || !property.TryGetInt32(out var n)) return null; return n;
 }
 private static int? Solve(string json) => Check.PracticeMode ? Practice(json) : Reference(json);
 public static void Verify() {
  Check.Equal((int?)7, Solve("{\"field0\":7}"));
  Check.Equal((int?)null, Solve("{\"field0\":\"7\"}"));
  Check.Equal((int?)null, Solve("[]"));
  Check.Throws<JsonException>(() => { Solve("{"); });
 }
}

// ======================================================================
// 211: JSON property selection / scenario 2
// Parse JSON; return int32 property 'field1' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.
// Hint: JsonElement values depend on document lifetime; return a copied int, not the element.
// Practice: --practice 211; reference: --verify 211
static class E211 {

 public static int? Practice(string json) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 211");
 }
 public static int? Reference(string json) {
  using var doc = JsonDocument.Parse(json); if(doc.RootElement.ValueKind != JsonValueKind.Object) return null; if(!doc.RootElement.TryGetProperty("field1", out var property) || property.ValueKind != JsonValueKind.Number || !property.TryGetInt32(out var n)) return null; return n;
 }
 private static int? Solve(string json) => Check.PracticeMode ? Practice(json) : Reference(json);
 public static void Verify() {
  Check.Equal((int?)7, Solve("{\"field1\":7}"));
  Check.Equal((int?)null, Solve("{\"field1\":\"7\"}"));
  Check.Equal((int?)null, Solve("[]"));
  Check.Throws<JsonException>(() => { Solve("{"); });
 }
}

// ======================================================================
// 212: JSON property selection / scenario 3
// Parse JSON; return int32 property 'field2' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.
// Hint: JsonElement values depend on document lifetime; return a copied int, not the element.
// Practice: --practice 212; reference: --verify 212
static class E212 {

 public static int? Practice(string json) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 212");
 }
 public static int? Reference(string json) {
  using var doc = JsonDocument.Parse(json); if(doc.RootElement.ValueKind != JsonValueKind.Object) return null; if(!doc.RootElement.TryGetProperty("field2", out var property) || property.ValueKind != JsonValueKind.Number || !property.TryGetInt32(out var n)) return null; return n;
 }
 private static int? Solve(string json) => Check.PracticeMode ? Practice(json) : Reference(json);
 public static void Verify() {
  Check.Equal((int?)7, Solve("{\"field2\":7}"));
  Check.Equal((int?)null, Solve("{\"field2\":\"7\"}"));
  Check.Equal((int?)null, Solve("[]"));
  Check.Throws<JsonException>(() => { Solve("{"); });
 }
}

// ======================================================================
// 213: JSON property selection / scenario 4
// Parse JSON; return int32 property 'field3' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.
// Hint: JsonElement values depend on document lifetime; return a copied int, not the element.
// Practice: --practice 213; reference: --verify 213
static class E213 {

 public static int? Practice(string json) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 213");
 }
 public static int? Reference(string json) {
  using var doc = JsonDocument.Parse(json); if(doc.RootElement.ValueKind != JsonValueKind.Object) return null; if(!doc.RootElement.TryGetProperty("field3", out var property) || property.ValueKind != JsonValueKind.Number || !property.TryGetInt32(out var n)) return null; return n;
 }
 private static int? Solve(string json) => Check.PracticeMode ? Practice(json) : Reference(json);
 public static void Verify() {
  Check.Equal((int?)7, Solve("{\"field3\":7}"));
  Check.Equal((int?)null, Solve("{\"field3\":\"7\"}"));
  Check.Equal((int?)null, Solve("[]"));
  Check.Throws<JsonException>(() => { Solve("{"); });
 }
}

// ======================================================================
// 214: JSON property selection / scenario 5
// Parse JSON; return int32 property 'field4' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.
// Hint: JsonElement values depend on document lifetime; return a copied int, not the element.
// Practice: --practice 214; reference: --verify 214
static class E214 {

 public static int? Practice(string json) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 214");
 }
 public static int? Reference(string json) {
  using var doc = JsonDocument.Parse(json); if(doc.RootElement.ValueKind != JsonValueKind.Object) return null; if(!doc.RootElement.TryGetProperty("field4", out var property) || property.ValueKind != JsonValueKind.Number || !property.TryGetInt32(out var n)) return null; return n;
 }
 private static int? Solve(string json) => Check.PracticeMode ? Practice(json) : Reference(json);
 public static void Verify() {
  Check.Equal((int?)7, Solve("{\"field4\":7}"));
  Check.Equal((int?)null, Solve("{\"field4\":\"7\"}"));
  Check.Equal((int?)null, Solve("[]"));
  Check.Throws<JsonException>(() => { Solve("{"); });
 }
}

// ======================================================================
// 215: JSON property selection / scenario 6
// Parse JSON; return int32 property 'field5' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.
// Hint: JsonElement values depend on document lifetime; return a copied int, not the element.
// Practice: --practice 215; reference: --verify 215
static class E215 {

 public static int? Practice(string json) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 215");
 }
 public static int? Reference(string json) {
  using var doc = JsonDocument.Parse(json); if(doc.RootElement.ValueKind != JsonValueKind.Object) return null; if(!doc.RootElement.TryGetProperty("field5", out var property) || property.ValueKind != JsonValueKind.Number || !property.TryGetInt32(out var n)) return null; return n;
 }
 private static int? Solve(string json) => Check.PracticeMode ? Practice(json) : Reference(json);
 public static void Verify() {
  Check.Equal((int?)7, Solve("{\"field5\":7}"));
  Check.Equal((int?)null, Solve("{\"field5\":\"7\"}"));
  Check.Equal((int?)null, Solve("[]"));
  Check.Throws<JsonException>(() => { Solve("{"); });
 }
}

// ======================================================================
// 216: JSON property selection / scenario 7
// Parse JSON; return int32 property 'field6' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.
// Hint: JsonElement values depend on document lifetime; return a copied int, not the element.
// Practice: --practice 216; reference: --verify 216
static class E216 {

 public static int? Practice(string json) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 216");
 }
 public static int? Reference(string json) {
  using var doc = JsonDocument.Parse(json); if(doc.RootElement.ValueKind != JsonValueKind.Object) return null; if(!doc.RootElement.TryGetProperty("field6", out var property) || property.ValueKind != JsonValueKind.Number || !property.TryGetInt32(out var n)) return null; return n;
 }
 private static int? Solve(string json) => Check.PracticeMode ? Practice(json) : Reference(json);
 public static void Verify() {
  Check.Equal((int?)7, Solve("{\"field6\":7}"));
  Check.Equal((int?)null, Solve("{\"field6\":\"7\"}"));
  Check.Equal((int?)null, Solve("[]"));
  Check.Throws<JsonException>(() => { Solve("{"); });
 }
}

// ======================================================================
// 217: JSON property selection / scenario 8
// Parse JSON; return int32 property 'field7' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.
// Hint: JsonElement values depend on document lifetime; return a copied int, not the element.
// Practice: --practice 217; reference: --verify 217
static class E217 {

 public static int? Practice(string json) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 217");
 }
 public static int? Reference(string json) {
  using var doc = JsonDocument.Parse(json); if(doc.RootElement.ValueKind != JsonValueKind.Object) return null; if(!doc.RootElement.TryGetProperty("field7", out var property) || property.ValueKind != JsonValueKind.Number || !property.TryGetInt32(out var n)) return null; return n;
 }
 private static int? Solve(string json) => Check.PracticeMode ? Practice(json) : Reference(json);
 public static void Verify() {
  Check.Equal((int?)7, Solve("{\"field7\":7}"));
  Check.Equal((int?)null, Solve("{\"field7\":\"7\"}"));
  Check.Equal((int?)null, Solve("[]"));
  Check.Throws<JsonException>(() => { Solve("{"); });
 }
}

// ======================================================================
// 218: JSON property selection / scenario 9
// Parse JSON; return int32 property 'field8' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.
// Hint: JsonElement values depend on document lifetime; return a copied int, not the element.
// Practice: --practice 218; reference: --verify 218
static class E218 {

 public static int? Practice(string json) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 218");
 }
 public static int? Reference(string json) {
  using var doc = JsonDocument.Parse(json); if(doc.RootElement.ValueKind != JsonValueKind.Object) return null; if(!doc.RootElement.TryGetProperty("field8", out var property) || property.ValueKind != JsonValueKind.Number || !property.TryGetInt32(out var n)) return null; return n;
 }
 private static int? Solve(string json) => Check.PracticeMode ? Practice(json) : Reference(json);
 public static void Verify() {
  Check.Equal((int?)7, Solve("{\"field8\":7}"));
  Check.Equal((int?)null, Solve("{\"field8\":\"7\"}"));
  Check.Equal((int?)null, Solve("[]"));
  Check.Throws<JsonException>(() => { Solve("{"); });
 }
}

// ======================================================================
// 219: JSON property selection / scenario 10
// Parse JSON; return int32 property 'field9' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.
// Hint: JsonElement values depend on document lifetime; return a copied int, not the element.
// Practice: --practice 219; reference: --verify 219
static class E219 {

 public static int? Practice(string json) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 219");
 }
 public static int? Reference(string json) {
  using var doc = JsonDocument.Parse(json); if(doc.RootElement.ValueKind != JsonValueKind.Object) return null; if(!doc.RootElement.TryGetProperty("field9", out var property) || property.ValueKind != JsonValueKind.Number || !property.TryGetInt32(out var n)) return null; return n;
 }
 private static int? Solve(string json) => Check.PracticeMode ? Practice(json) : Reference(json);
 public static void Verify() {
  Check.Equal((int?)7, Solve("{\"field9\":7}"));
  Check.Equal((int?)null, Solve("{\"field9\":\"7\"}"));
  Check.Equal((int?)null, Solve("[]"));
  Check.Throws<JsonException>(() => { Solve("{"); });
 }
}

// ======================================================================
// 220: JSON property selection / scenario 11
// Parse JSON; return int32 property 'field10' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.
// Hint: JsonElement values depend on document lifetime; return a copied int, not the element.
// Practice: --practice 220; reference: --verify 220
static class E220 {

 public static int? Practice(string json) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 220");
 }
 public static int? Reference(string json) {
  using var doc = JsonDocument.Parse(json); if(doc.RootElement.ValueKind != JsonValueKind.Object) return null; if(!doc.RootElement.TryGetProperty("field10", out var property) || property.ValueKind != JsonValueKind.Number || !property.TryGetInt32(out var n)) return null; return n;
 }
 private static int? Solve(string json) => Check.PracticeMode ? Practice(json) : Reference(json);
 public static void Verify() {
  Check.Equal((int?)7, Solve("{\"field10\":7}"));
  Check.Equal((int?)null, Solve("{\"field10\":\"7\"}"));
  Check.Equal((int?)null, Solve("[]"));
  Check.Throws<JsonException>(() => { Solve("{"); });
 }
}

// ======================================================================
// 221: DateOnly calendar arithmetic / scenario 1
// Add1 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.
// Hint: DateOnly.AddDays handles calendar transitions.
// Practice: --practice 221; reference: --verify 221
static class E221 {

 public static DateOnly Practice(DateOnly date) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 221");
 }
 public static DateOnly Reference(DateOnly date) {
  return date.AddDays(1);
 }
 private static DateOnly Solve(DateOnly date) => Check.PracticeMode ? Practice(date) : Reference(date);
 public static void Verify() {
  Check.Equal(new DateOnly(2024, 3, 1), Solve(new DateOnly(2024, 2, 29)));
  Check.Equal(new DateOnly(2025, 1, 1), Solve(new DateOnly(2024, 12, 31)));
  Check.Equal(new DateOnly(2024, 1, 2), Solve(new DateOnly(2024, 1, 1)));
 }
}

// ======================================================================
// 222: DateOnly calendar arithmetic / scenario 2
// Add2 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.
// Hint: DateOnly.AddDays handles calendar transitions.
// Practice: --practice 222; reference: --verify 222
static class E222 {

 public static DateOnly Practice(DateOnly date) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 222");
 }
 public static DateOnly Reference(DateOnly date) {
  return date.AddDays(2);
 }
 private static DateOnly Solve(DateOnly date) => Check.PracticeMode ? Practice(date) : Reference(date);
 public static void Verify() {
  Check.Equal(new DateOnly(2024, 3, 2), Solve(new DateOnly(2024, 2, 29)));
  Check.Equal(new DateOnly(2025, 1, 2), Solve(new DateOnly(2024, 12, 31)));
  Check.Equal(new DateOnly(2024, 1, 3), Solve(new DateOnly(2024, 1, 1)));
 }
}

// ======================================================================
// 223: DateOnly calendar arithmetic / scenario 3
// Add3 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.
// Hint: DateOnly.AddDays handles calendar transitions.
// Practice: --practice 223; reference: --verify 223
static class E223 {

 public static DateOnly Practice(DateOnly date) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 223");
 }
 public static DateOnly Reference(DateOnly date) {
  return date.AddDays(3);
 }
 private static DateOnly Solve(DateOnly date) => Check.PracticeMode ? Practice(date) : Reference(date);
 public static void Verify() {
  Check.Equal(new DateOnly(2024, 3, 3), Solve(new DateOnly(2024, 2, 29)));
  Check.Equal(new DateOnly(2025, 1, 3), Solve(new DateOnly(2024, 12, 31)));
  Check.Equal(new DateOnly(2024, 1, 4), Solve(new DateOnly(2024, 1, 1)));
 }
}

// ======================================================================
// 224: DateOnly calendar arithmetic / scenario 4
// Add4 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.
// Hint: DateOnly.AddDays handles calendar transitions.
// Practice: --practice 224; reference: --verify 224
static class E224 {

 public static DateOnly Practice(DateOnly date) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 224");
 }
 public static DateOnly Reference(DateOnly date) {
  return date.AddDays(4);
 }
 private static DateOnly Solve(DateOnly date) => Check.PracticeMode ? Practice(date) : Reference(date);
 public static void Verify() {
  Check.Equal(new DateOnly(2024, 3, 4), Solve(new DateOnly(2024, 2, 29)));
  Check.Equal(new DateOnly(2025, 1, 4), Solve(new DateOnly(2024, 12, 31)));
  Check.Equal(new DateOnly(2024, 1, 5), Solve(new DateOnly(2024, 1, 1)));
 }
}

// ======================================================================
// 225: DateOnly calendar arithmetic / scenario 5
// Add5 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.
// Hint: DateOnly.AddDays handles calendar transitions.
// Practice: --practice 225; reference: --verify 225
static class E225 {

 public static DateOnly Practice(DateOnly date) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 225");
 }
 public static DateOnly Reference(DateOnly date) {
  return date.AddDays(5);
 }
 private static DateOnly Solve(DateOnly date) => Check.PracticeMode ? Practice(date) : Reference(date);
 public static void Verify() {
  Check.Equal(new DateOnly(2024, 3, 5), Solve(new DateOnly(2024, 2, 29)));
  Check.Equal(new DateOnly(2025, 1, 5), Solve(new DateOnly(2024, 12, 31)));
  Check.Equal(new DateOnly(2024, 1, 6), Solve(new DateOnly(2024, 1, 1)));
 }
}

// ======================================================================
// 226: DateOnly calendar arithmetic / scenario 6
// Add6 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.
// Hint: DateOnly.AddDays handles calendar transitions.
// Practice: --practice 226; reference: --verify 226
static class E226 {

 public static DateOnly Practice(DateOnly date) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 226");
 }
 public static DateOnly Reference(DateOnly date) {
  return date.AddDays(6);
 }
 private static DateOnly Solve(DateOnly date) => Check.PracticeMode ? Practice(date) : Reference(date);
 public static void Verify() {
  Check.Equal(new DateOnly(2024, 3, 6), Solve(new DateOnly(2024, 2, 29)));
  Check.Equal(new DateOnly(2025, 1, 6), Solve(new DateOnly(2024, 12, 31)));
  Check.Equal(new DateOnly(2024, 1, 7), Solve(new DateOnly(2024, 1, 1)));
 }
}

// ======================================================================
// 227: DateOnly calendar arithmetic / scenario 7
// Add7 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.
// Hint: DateOnly.AddDays handles calendar transitions.
// Practice: --practice 227; reference: --verify 227
static class E227 {

 public static DateOnly Practice(DateOnly date) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 227");
 }
 public static DateOnly Reference(DateOnly date) {
  return date.AddDays(7);
 }
 private static DateOnly Solve(DateOnly date) => Check.PracticeMode ? Practice(date) : Reference(date);
 public static void Verify() {
  Check.Equal(new DateOnly(2024, 3, 7), Solve(new DateOnly(2024, 2, 29)));
  Check.Equal(new DateOnly(2025, 1, 7), Solve(new DateOnly(2024, 12, 31)));
  Check.Equal(new DateOnly(2024, 1, 8), Solve(new DateOnly(2024, 1, 1)));
 }
}

// ======================================================================
// 228: DateOnly calendar arithmetic / scenario 8
// Add8 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.
// Hint: DateOnly.AddDays handles calendar transitions.
// Practice: --practice 228; reference: --verify 228
static class E228 {

 public static DateOnly Practice(DateOnly date) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 228");
 }
 public static DateOnly Reference(DateOnly date) {
  return date.AddDays(8);
 }
 private static DateOnly Solve(DateOnly date) => Check.PracticeMode ? Practice(date) : Reference(date);
 public static void Verify() {
  Check.Equal(new DateOnly(2024, 3, 8), Solve(new DateOnly(2024, 2, 29)));
  Check.Equal(new DateOnly(2025, 1, 8), Solve(new DateOnly(2024, 12, 31)));
  Check.Equal(new DateOnly(2024, 1, 9), Solve(new DateOnly(2024, 1, 1)));
 }
}

// ======================================================================
// 229: DateOnly calendar arithmetic / scenario 9
// Add9 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.
// Hint: DateOnly.AddDays handles calendar transitions.
// Practice: --practice 229; reference: --verify 229
static class E229 {

 public static DateOnly Practice(DateOnly date) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 229");
 }
 public static DateOnly Reference(DateOnly date) {
  return date.AddDays(9);
 }
 private static DateOnly Solve(DateOnly date) => Check.PracticeMode ? Practice(date) : Reference(date);
 public static void Verify() {
  Check.Equal(new DateOnly(2024, 3, 9), Solve(new DateOnly(2024, 2, 29)));
  Check.Equal(new DateOnly(2025, 1, 9), Solve(new DateOnly(2024, 12, 31)));
  Check.Equal(new DateOnly(2024, 1, 10), Solve(new DateOnly(2024, 1, 1)));
 }
}

// ======================================================================
// 230: DateOnly calendar arithmetic / scenario 10
// Add10 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.
// Hint: DateOnly.AddDays handles calendar transitions.
// Practice: --practice 230; reference: --verify 230
static class E230 {

 public static DateOnly Practice(DateOnly date) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 230");
 }
 public static DateOnly Reference(DateOnly date) {
  return date.AddDays(10);
 }
 private static DateOnly Solve(DateOnly date) => Check.PracticeMode ? Practice(date) : Reference(date);
 public static void Verify() {
  Check.Equal(new DateOnly(2024, 3, 10), Solve(new DateOnly(2024, 2, 29)));
  Check.Equal(new DateOnly(2025, 1, 10), Solve(new DateOnly(2024, 12, 31)));
  Check.Equal(new DateOnly(2024, 1, 11), Solve(new DateOnly(2024, 1, 1)));
 }
}

// ======================================================================
// 231: DateOnly calendar arithmetic / scenario 11
// Add11 calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.
// Hint: DateOnly.AddDays handles calendar transitions.
// Practice: --practice 231; reference: --verify 231
static class E231 {

 public static DateOnly Practice(DateOnly date) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 231");
 }
 public static DateOnly Reference(DateOnly date) {
  return date.AddDays(11);
 }
 private static DateOnly Solve(DateOnly date) => Check.PracticeMode ? Practice(date) : Reference(date);
 public static void Verify() {
  Check.Equal(new DateOnly(2024, 3, 11), Solve(new DateOnly(2024, 2, 29)));
  Check.Equal(new DateOnly(2025, 1, 11), Solve(new DateOnly(2024, 12, 31)));
  Check.Equal(new DateOnly(2024, 1, 12), Solve(new DateOnly(2024, 1, 1)));
 }
}

// ======================================================================
// 232: TimeOnly wraparound / scenario 1
// Add15 minutes and wrap at midnight. Return TimeOnly, ignoring date.
// Hint: TimeOnly handles the24-hour wrap automatically.
// Practice: --practice 232; reference: --verify 232
static class E232 {

 public static TimeOnly Practice(TimeOnly time) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 232");
 }
 public static TimeOnly Reference(TimeOnly time) {
  return time.AddMinutes(15);
 }
 private static TimeOnly Solve(TimeOnly time) => Check.PracticeMode ? Practice(time) : Reference(time);
 public static void Verify() {
  Check.Equal(new TimeOnly(0, 15), Solve(new TimeOnly(0, 0)));
  Check.Equal(new TimeOnly(0, 5), Solve(new TimeOnly(23, 50)));
  Check.Equal(new TimeOnly(12, 15), Solve(new TimeOnly(12, 0)));
 }
}

// ======================================================================
// 233: TimeOnly wraparound / scenario 2
// Add30 minutes and wrap at midnight. Return TimeOnly, ignoring date.
// Hint: TimeOnly handles the24-hour wrap automatically.
// Practice: --practice 233; reference: --verify 233
static class E233 {

 public static TimeOnly Practice(TimeOnly time) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 233");
 }
 public static TimeOnly Reference(TimeOnly time) {
  return time.AddMinutes(30);
 }
 private static TimeOnly Solve(TimeOnly time) => Check.PracticeMode ? Practice(time) : Reference(time);
 public static void Verify() {
  Check.Equal(new TimeOnly(0, 30), Solve(new TimeOnly(0, 0)));
  Check.Equal(new TimeOnly(0, 20), Solve(new TimeOnly(23, 50)));
  Check.Equal(new TimeOnly(12, 30), Solve(new TimeOnly(12, 0)));
 }
}

// ======================================================================
// 234: TimeOnly wraparound / scenario 3
// Add45 minutes and wrap at midnight. Return TimeOnly, ignoring date.
// Hint: TimeOnly handles the24-hour wrap automatically.
// Practice: --practice 234; reference: --verify 234
static class E234 {

 public static TimeOnly Practice(TimeOnly time) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 234");
 }
 public static TimeOnly Reference(TimeOnly time) {
  return time.AddMinutes(45);
 }
 private static TimeOnly Solve(TimeOnly time) => Check.PracticeMode ? Practice(time) : Reference(time);
 public static void Verify() {
  Check.Equal(new TimeOnly(0, 45), Solve(new TimeOnly(0, 0)));
  Check.Equal(new TimeOnly(0, 35), Solve(new TimeOnly(23, 50)));
  Check.Equal(new TimeOnly(12, 45), Solve(new TimeOnly(12, 0)));
 }
}

// ======================================================================
// 235: TimeOnly wraparound / scenario 4
// Add60 minutes and wrap at midnight. Return TimeOnly, ignoring date.
// Hint: TimeOnly handles the24-hour wrap automatically.
// Practice: --practice 235; reference: --verify 235
static class E235 {

 public static TimeOnly Practice(TimeOnly time) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 235");
 }
 public static TimeOnly Reference(TimeOnly time) {
  return time.AddMinutes(60);
 }
 private static TimeOnly Solve(TimeOnly time) => Check.PracticeMode ? Practice(time) : Reference(time);
 public static void Verify() {
  Check.Equal(new TimeOnly(1, 0), Solve(new TimeOnly(0, 0)));
  Check.Equal(new TimeOnly(0, 50), Solve(new TimeOnly(23, 50)));
  Check.Equal(new TimeOnly(13, 0), Solve(new TimeOnly(12, 0)));
 }
}

// ======================================================================
// 236: TimeOnly wraparound / scenario 5
// Add75 minutes and wrap at midnight. Return TimeOnly, ignoring date.
// Hint: TimeOnly handles the24-hour wrap automatically.
// Practice: --practice 236; reference: --verify 236
static class E236 {

 public static TimeOnly Practice(TimeOnly time) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 236");
 }
 public static TimeOnly Reference(TimeOnly time) {
  return time.AddMinutes(75);
 }
 private static TimeOnly Solve(TimeOnly time) => Check.PracticeMode ? Practice(time) : Reference(time);
 public static void Verify() {
  Check.Equal(new TimeOnly(1, 15), Solve(new TimeOnly(0, 0)));
  Check.Equal(new TimeOnly(1, 5), Solve(new TimeOnly(23, 50)));
  Check.Equal(new TimeOnly(13, 15), Solve(new TimeOnly(12, 0)));
 }
}

// ======================================================================
// 237: TimeOnly wraparound / scenario 6
// Add90 minutes and wrap at midnight. Return TimeOnly, ignoring date.
// Hint: TimeOnly handles the24-hour wrap automatically.
// Practice: --practice 237; reference: --verify 237
static class E237 {

 public static TimeOnly Practice(TimeOnly time) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 237");
 }
 public static TimeOnly Reference(TimeOnly time) {
  return time.AddMinutes(90);
 }
 private static TimeOnly Solve(TimeOnly time) => Check.PracticeMode ? Practice(time) : Reference(time);
 public static void Verify() {
  Check.Equal(new TimeOnly(1, 30), Solve(new TimeOnly(0, 0)));
  Check.Equal(new TimeOnly(1, 20), Solve(new TimeOnly(23, 50)));
  Check.Equal(new TimeOnly(13, 30), Solve(new TimeOnly(12, 0)));
 }
}

// ======================================================================
// 238: TimeOnly wraparound / scenario 7
// Add105 minutes and wrap at midnight. Return TimeOnly, ignoring date.
// Hint: TimeOnly handles the24-hour wrap automatically.
// Practice: --practice 238; reference: --verify 238
static class E238 {

 public static TimeOnly Practice(TimeOnly time) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 238");
 }
 public static TimeOnly Reference(TimeOnly time) {
  return time.AddMinutes(105);
 }
 private static TimeOnly Solve(TimeOnly time) => Check.PracticeMode ? Practice(time) : Reference(time);
 public static void Verify() {
  Check.Equal(new TimeOnly(1, 45), Solve(new TimeOnly(0, 0)));
  Check.Equal(new TimeOnly(1, 35), Solve(new TimeOnly(23, 50)));
  Check.Equal(new TimeOnly(13, 45), Solve(new TimeOnly(12, 0)));
 }
}

// ======================================================================
// 239: TimeOnly wraparound / scenario 8
// Add120 minutes and wrap at midnight. Return TimeOnly, ignoring date.
// Hint: TimeOnly handles the24-hour wrap automatically.
// Practice: --practice 239; reference: --verify 239
static class E239 {

 public static TimeOnly Practice(TimeOnly time) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 239");
 }
 public static TimeOnly Reference(TimeOnly time) {
  return time.AddMinutes(120);
 }
 private static TimeOnly Solve(TimeOnly time) => Check.PracticeMode ? Practice(time) : Reference(time);
 public static void Verify() {
  Check.Equal(new TimeOnly(2, 0), Solve(new TimeOnly(0, 0)));
  Check.Equal(new TimeOnly(1, 50), Solve(new TimeOnly(23, 50)));
  Check.Equal(new TimeOnly(14, 0), Solve(new TimeOnly(12, 0)));
 }
}

// ======================================================================
// 240: TimeOnly wraparound / scenario 9
// Add135 minutes and wrap at midnight. Return TimeOnly, ignoring date.
// Hint: TimeOnly handles the24-hour wrap automatically.
// Practice: --practice 240; reference: --verify 240
static class E240 {

 public static TimeOnly Practice(TimeOnly time) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 240");
 }
 public static TimeOnly Reference(TimeOnly time) {
  return time.AddMinutes(135);
 }
 private static TimeOnly Solve(TimeOnly time) => Check.PracticeMode ? Practice(time) : Reference(time);
 public static void Verify() {
  Check.Equal(new TimeOnly(2, 15), Solve(new TimeOnly(0, 0)));
  Check.Equal(new TimeOnly(2, 5), Solve(new TimeOnly(23, 50)));
  Check.Equal(new TimeOnly(14, 15), Solve(new TimeOnly(12, 0)));
 }
}

// ======================================================================
// 241: TimeOnly wraparound / scenario 10
// Add150 minutes and wrap at midnight. Return TimeOnly, ignoring date.
// Hint: TimeOnly handles the24-hour wrap automatically.
// Practice: --practice 241; reference: --verify 241
static class E241 {

 public static TimeOnly Practice(TimeOnly time) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 241");
 }
 public static TimeOnly Reference(TimeOnly time) {
  return time.AddMinutes(150);
 }
 private static TimeOnly Solve(TimeOnly time) => Check.PracticeMode ? Practice(time) : Reference(time);
 public static void Verify() {
  Check.Equal(new TimeOnly(2, 30), Solve(new TimeOnly(0, 0)));
  Check.Equal(new TimeOnly(2, 20), Solve(new TimeOnly(23, 50)));
  Check.Equal(new TimeOnly(14, 30), Solve(new TimeOnly(12, 0)));
 }
}

// ======================================================================
// 242: TimeOnly wraparound / scenario 11
// Add165 minutes and wrap at midnight. Return TimeOnly, ignoring date.
// Hint: TimeOnly handles the24-hour wrap automatically.
// Practice: --practice 242; reference: --verify 242
static class E242 {

 public static TimeOnly Practice(TimeOnly time) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 242");
 }
 public static TimeOnly Reference(TimeOnly time) {
  return time.AddMinutes(165);
 }
 private static TimeOnly Solve(TimeOnly time) => Check.PracticeMode ? Practice(time) : Reference(time);
 public static void Verify() {
  Check.Equal(new TimeOnly(2, 45), Solve(new TimeOnly(0, 0)));
  Check.Equal(new TimeOnly(2, 35), Solve(new TimeOnly(23, 50)));
  Check.Equal(new TimeOnly(14, 45), Solve(new TimeOnly(12, 0)));
 }
}

// ======================================================================
// 243: DateTimeOffset instant comparison / scenario 1
// Return true when elapsed real time from start to end is at least1 minutes. Offsets may differ; compare instants, not clock-face hours.
// Hint: DateTimeOffset subtraction normalizes offsets.
// Practice: --practice 243; reference: --verify 243
static class E243 {

 public static bool Practice(DateTimeOffset start, DateTimeOffset end) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 243");
 }
 public static bool Reference(DateTimeOffset start, DateTimeOffset end) {
  return end - start >= TimeSpan.FromMinutes(1);
 }
 private static bool Solve(DateTimeOffset start, DateTimeOffset end) => Check.PracticeMode ? Practice(start, end) : Reference(start, end);
 public static void Verify() {
  Check.Equal(true, Solve(DateTimeOffset.Parse("2024-01-01T00:00:00Z"), DateTimeOffset.Parse("2024-01-01T00:01:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T01:00:00+01:00"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T00:01:00Z"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
 }
}

// ======================================================================
// 244: DateTimeOffset instant comparison / scenario 2
// Return true when elapsed real time from start to end is at least2 minutes. Offsets may differ; compare instants, not clock-face hours.
// Hint: DateTimeOffset subtraction normalizes offsets.
// Practice: --practice 244; reference: --verify 244
static class E244 {

 public static bool Practice(DateTimeOffset start, DateTimeOffset end) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 244");
 }
 public static bool Reference(DateTimeOffset start, DateTimeOffset end) {
  return end - start >= TimeSpan.FromMinutes(2);
 }
 private static bool Solve(DateTimeOffset start, DateTimeOffset end) => Check.PracticeMode ? Practice(start, end) : Reference(start, end);
 public static void Verify() {
  Check.Equal(true, Solve(DateTimeOffset.Parse("2024-01-01T00:00:00Z"), DateTimeOffset.Parse("2024-01-01T00:02:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T01:00:00+01:00"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T00:01:00Z"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
 }
}

// ======================================================================
// 245: DateTimeOffset instant comparison / scenario 3
// Return true when elapsed real time from start to end is at least3 minutes. Offsets may differ; compare instants, not clock-face hours.
// Hint: DateTimeOffset subtraction normalizes offsets.
// Practice: --practice 245; reference: --verify 245
static class E245 {

 public static bool Practice(DateTimeOffset start, DateTimeOffset end) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 245");
 }
 public static bool Reference(DateTimeOffset start, DateTimeOffset end) {
  return end - start >= TimeSpan.FromMinutes(3);
 }
 private static bool Solve(DateTimeOffset start, DateTimeOffset end) => Check.PracticeMode ? Practice(start, end) : Reference(start, end);
 public static void Verify() {
  Check.Equal(true, Solve(DateTimeOffset.Parse("2024-01-01T00:00:00Z"), DateTimeOffset.Parse("2024-01-01T00:03:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T01:00:00+01:00"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T00:01:00Z"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
 }
}

// ======================================================================
// 246: DateTimeOffset instant comparison / scenario 4
// Return true when elapsed real time from start to end is at least4 minutes. Offsets may differ; compare instants, not clock-face hours.
// Hint: DateTimeOffset subtraction normalizes offsets.
// Practice: --practice 246; reference: --verify 246
static class E246 {

 public static bool Practice(DateTimeOffset start, DateTimeOffset end) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 246");
 }
 public static bool Reference(DateTimeOffset start, DateTimeOffset end) {
  return end - start >= TimeSpan.FromMinutes(4);
 }
 private static bool Solve(DateTimeOffset start, DateTimeOffset end) => Check.PracticeMode ? Practice(start, end) : Reference(start, end);
 public static void Verify() {
  Check.Equal(true, Solve(DateTimeOffset.Parse("2024-01-01T00:00:00Z"), DateTimeOffset.Parse("2024-01-01T00:04:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T01:00:00+01:00"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T00:01:00Z"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
 }
}

// ======================================================================
// 247: DateTimeOffset instant comparison / scenario 5
// Return true when elapsed real time from start to end is at least5 minutes. Offsets may differ; compare instants, not clock-face hours.
// Hint: DateTimeOffset subtraction normalizes offsets.
// Practice: --practice 247; reference: --verify 247
static class E247 {

 public static bool Practice(DateTimeOffset start, DateTimeOffset end) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 247");
 }
 public static bool Reference(DateTimeOffset start, DateTimeOffset end) {
  return end - start >= TimeSpan.FromMinutes(5);
 }
 private static bool Solve(DateTimeOffset start, DateTimeOffset end) => Check.PracticeMode ? Practice(start, end) : Reference(start, end);
 public static void Verify() {
  Check.Equal(true, Solve(DateTimeOffset.Parse("2024-01-01T00:00:00Z"), DateTimeOffset.Parse("2024-01-01T00:05:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T01:00:00+01:00"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T00:01:00Z"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
 }
}

// ======================================================================
// 248: DateTimeOffset instant comparison / scenario 6
// Return true when elapsed real time from start to end is at least6 minutes. Offsets may differ; compare instants, not clock-face hours.
// Hint: DateTimeOffset subtraction normalizes offsets.
// Practice: --practice 248; reference: --verify 248
static class E248 {

 public static bool Practice(DateTimeOffset start, DateTimeOffset end) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 248");
 }
 public static bool Reference(DateTimeOffset start, DateTimeOffset end) {
  return end - start >= TimeSpan.FromMinutes(6);
 }
 private static bool Solve(DateTimeOffset start, DateTimeOffset end) => Check.PracticeMode ? Practice(start, end) : Reference(start, end);
 public static void Verify() {
  Check.Equal(true, Solve(DateTimeOffset.Parse("2024-01-01T00:00:00Z"), DateTimeOffset.Parse("2024-01-01T00:06:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T01:00:00+01:00"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T00:01:00Z"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
 }
}

// ======================================================================
// 249: DateTimeOffset instant comparison / scenario 7
// Return true when elapsed real time from start to end is at least7 minutes. Offsets may differ; compare instants, not clock-face hours.
// Hint: DateTimeOffset subtraction normalizes offsets.
// Practice: --practice 249; reference: --verify 249
static class E249 {

 public static bool Practice(DateTimeOffset start, DateTimeOffset end) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 249");
 }
 public static bool Reference(DateTimeOffset start, DateTimeOffset end) {
  return end - start >= TimeSpan.FromMinutes(7);
 }
 private static bool Solve(DateTimeOffset start, DateTimeOffset end) => Check.PracticeMode ? Practice(start, end) : Reference(start, end);
 public static void Verify() {
  Check.Equal(true, Solve(DateTimeOffset.Parse("2024-01-01T00:00:00Z"), DateTimeOffset.Parse("2024-01-01T00:07:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T01:00:00+01:00"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T00:01:00Z"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
 }
}

// ======================================================================
// 250: DateTimeOffset instant comparison / scenario 8
// Return true when elapsed real time from start to end is at least8 minutes. Offsets may differ; compare instants, not clock-face hours.
// Hint: DateTimeOffset subtraction normalizes offsets.
// Practice: --practice 250; reference: --verify 250
static class E250 {

 public static bool Practice(DateTimeOffset start, DateTimeOffset end) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 250");
 }
 public static bool Reference(DateTimeOffset start, DateTimeOffset end) {
  return end - start >= TimeSpan.FromMinutes(8);
 }
 private static bool Solve(DateTimeOffset start, DateTimeOffset end) => Check.PracticeMode ? Practice(start, end) : Reference(start, end);
 public static void Verify() {
  Check.Equal(true, Solve(DateTimeOffset.Parse("2024-01-01T00:00:00Z"), DateTimeOffset.Parse("2024-01-01T00:08:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T01:00:00+01:00"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T00:01:00Z"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
 }
}

// ======================================================================
// 251: DateTimeOffset instant comparison / scenario 9
// Return true when elapsed real time from start to end is at least9 minutes. Offsets may differ; compare instants, not clock-face hours.
// Hint: DateTimeOffset subtraction normalizes offsets.
// Practice: --practice 251; reference: --verify 251
static class E251 {

 public static bool Practice(DateTimeOffset start, DateTimeOffset end) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 251");
 }
 public static bool Reference(DateTimeOffset start, DateTimeOffset end) {
  return end - start >= TimeSpan.FromMinutes(9);
 }
 private static bool Solve(DateTimeOffset start, DateTimeOffset end) => Check.PracticeMode ? Practice(start, end) : Reference(start, end);
 public static void Verify() {
  Check.Equal(true, Solve(DateTimeOffset.Parse("2024-01-01T00:00:00Z"), DateTimeOffset.Parse("2024-01-01T00:09:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T01:00:00+01:00"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T00:01:00Z"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
 }
}

// ======================================================================
// 252: DateTimeOffset instant comparison / scenario 10
// Return true when elapsed real time from start to end is at least10 minutes. Offsets may differ; compare instants, not clock-face hours.
// Hint: DateTimeOffset subtraction normalizes offsets.
// Practice: --practice 252; reference: --verify 252
static class E252 {

 public static bool Practice(DateTimeOffset start, DateTimeOffset end) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 252");
 }
 public static bool Reference(DateTimeOffset start, DateTimeOffset end) {
  return end - start >= TimeSpan.FromMinutes(10);
 }
 private static bool Solve(DateTimeOffset start, DateTimeOffset end) => Check.PracticeMode ? Practice(start, end) : Reference(start, end);
 public static void Verify() {
  Check.Equal(true, Solve(DateTimeOffset.Parse("2024-01-01T00:00:00Z"), DateTimeOffset.Parse("2024-01-01T00:10:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T01:00:00+01:00"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T00:01:00Z"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
 }
}

// ======================================================================
// 253: DateTimeOffset instant comparison / scenario 11
// Return true when elapsed real time from start to end is at least11 minutes. Offsets may differ; compare instants, not clock-face hours.
// Hint: DateTimeOffset subtraction normalizes offsets.
// Practice: --practice 253; reference: --verify 253
static class E253 {

 public static bool Practice(DateTimeOffset start, DateTimeOffset end) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 253");
 }
 public static bool Reference(DateTimeOffset start, DateTimeOffset end) {
  return end - start >= TimeSpan.FromMinutes(11);
 }
 private static bool Solve(DateTimeOffset start, DateTimeOffset end) => Check.PracticeMode ? Practice(start, end) : Reference(start, end);
 public static void Verify() {
  Check.Equal(true, Solve(DateTimeOffset.Parse("2024-01-01T00:00:00Z"), DateTimeOffset.Parse("2024-01-01T00:11:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T01:00:00+01:00"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
  Check.Equal(false, Solve(DateTimeOffset.Parse("2024-01-01T00:01:00Z"), DateTimeOffset.Parse("2024-01-01T00:00:00Z")));
 }
}

// ======================================================================
// 254: BigInteger factorials / scenario 1
// Return n! using BigInteger for 0<=n<=10; reject other inputs. 0!=1.
// Hint: An int or long factorial overflows quickly.
// Practice: --practice 254; reference: --verify 254
static class E254 {

 public static BigInteger Practice(int n) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 254");
 }
 public static BigInteger Reference(int n) {
  if(n < 0 || n > 10) throw new ArgumentOutOfRangeException(nameof(n)); BigInteger result=BigInteger.One; for(int i=2;i<=n;i++) result*=i; return result;
 }
 private static BigInteger Solve(int n) => Check.PracticeMode ? Practice(n) : Reference(n);
 public static void Verify() {
  Check.Equal(BigInteger.One, Solve(0));
  Check.Equal(new BigInteger(120), Solve(5));
  Check.Equal(new BigInteger(3628800), Solve(10));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(11); });
 }
}

// ======================================================================
// 255: BigInteger factorials / scenario 2
// Return n! using BigInteger for 0<=n<=11; reject other inputs. 0!=1.
// Hint: An int or long factorial overflows quickly.
// Practice: --practice 255; reference: --verify 255
static class E255 {

 public static BigInteger Practice(int n) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 255");
 }
 public static BigInteger Reference(int n) {
  if(n < 0 || n > 11) throw new ArgumentOutOfRangeException(nameof(n)); BigInteger result=BigInteger.One; for(int i=2;i<=n;i++) result*=i; return result;
 }
 private static BigInteger Solve(int n) => Check.PracticeMode ? Practice(n) : Reference(n);
 public static void Verify() {
  Check.Equal(BigInteger.One, Solve(0));
  Check.Equal(new BigInteger(120), Solve(5));
  Check.Equal(new BigInteger(3628800), Solve(10));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(12); });
 }
}

// ======================================================================
// 256: BigInteger factorials / scenario 3
// Return n! using BigInteger for 0<=n<=12; reject other inputs. 0!=1.
// Hint: An int or long factorial overflows quickly.
// Practice: --practice 256; reference: --verify 256
static class E256 {

 public static BigInteger Practice(int n) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 256");
 }
 public static BigInteger Reference(int n) {
  if(n < 0 || n > 12) throw new ArgumentOutOfRangeException(nameof(n)); BigInteger result=BigInteger.One; for(int i=2;i<=n;i++) result*=i; return result;
 }
 private static BigInteger Solve(int n) => Check.PracticeMode ? Practice(n) : Reference(n);
 public static void Verify() {
  Check.Equal(BigInteger.One, Solve(0));
  Check.Equal(new BigInteger(120), Solve(5));
  Check.Equal(new BigInteger(3628800), Solve(10));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(13); });
 }
}

// ======================================================================
// 257: BigInteger factorials / scenario 4
// Return n! using BigInteger for 0<=n<=13; reject other inputs. 0!=1.
// Hint: An int or long factorial overflows quickly.
// Practice: --practice 257; reference: --verify 257
static class E257 {

 public static BigInteger Practice(int n) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 257");
 }
 public static BigInteger Reference(int n) {
  if(n < 0 || n > 13) throw new ArgumentOutOfRangeException(nameof(n)); BigInteger result=BigInteger.One; for(int i=2;i<=n;i++) result*=i; return result;
 }
 private static BigInteger Solve(int n) => Check.PracticeMode ? Practice(n) : Reference(n);
 public static void Verify() {
  Check.Equal(BigInteger.One, Solve(0));
  Check.Equal(new BigInteger(120), Solve(5));
  Check.Equal(new BigInteger(3628800), Solve(10));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(14); });
 }
}

// ======================================================================
// 258: BigInteger factorials / scenario 5
// Return n! using BigInteger for 0<=n<=14; reject other inputs. 0!=1.
// Hint: An int or long factorial overflows quickly.
// Practice: --practice 258; reference: --verify 258
static class E258 {

 public static BigInteger Practice(int n) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 258");
 }
 public static BigInteger Reference(int n) {
  if(n < 0 || n > 14) throw new ArgumentOutOfRangeException(nameof(n)); BigInteger result=BigInteger.One; for(int i=2;i<=n;i++) result*=i; return result;
 }
 private static BigInteger Solve(int n) => Check.PracticeMode ? Practice(n) : Reference(n);
 public static void Verify() {
  Check.Equal(BigInteger.One, Solve(0));
  Check.Equal(new BigInteger(120), Solve(5));
  Check.Equal(new BigInteger(3628800), Solve(10));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(15); });
 }
}

// ======================================================================
// 259: BigInteger factorials / scenario 6
// Return n! using BigInteger for 0<=n<=15; reject other inputs. 0!=1.
// Hint: An int or long factorial overflows quickly.
// Practice: --practice 259; reference: --verify 259
static class E259 {

 public static BigInteger Practice(int n) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 259");
 }
 public static BigInteger Reference(int n) {
  if(n < 0 || n > 15) throw new ArgumentOutOfRangeException(nameof(n)); BigInteger result=BigInteger.One; for(int i=2;i<=n;i++) result*=i; return result;
 }
 private static BigInteger Solve(int n) => Check.PracticeMode ? Practice(n) : Reference(n);
 public static void Verify() {
  Check.Equal(BigInteger.One, Solve(0));
  Check.Equal(new BigInteger(120), Solve(5));
  Check.Equal(new BigInteger(3628800), Solve(10));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(16); });
 }
}

// ======================================================================
// 260: BigInteger factorials / scenario 7
// Return n! using BigInteger for 0<=n<=16; reject other inputs. 0!=1.
// Hint: An int or long factorial overflows quickly.
// Practice: --practice 260; reference: --verify 260
static class E260 {

 public static BigInteger Practice(int n) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 260");
 }
 public static BigInteger Reference(int n) {
  if(n < 0 || n > 16) throw new ArgumentOutOfRangeException(nameof(n)); BigInteger result=BigInteger.One; for(int i=2;i<=n;i++) result*=i; return result;
 }
 private static BigInteger Solve(int n) => Check.PracticeMode ? Practice(n) : Reference(n);
 public static void Verify() {
  Check.Equal(BigInteger.One, Solve(0));
  Check.Equal(new BigInteger(120), Solve(5));
  Check.Equal(new BigInteger(3628800), Solve(10));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(17); });
 }
}

// ======================================================================
// 261: BigInteger factorials / scenario 8
// Return n! using BigInteger for 0<=n<=17; reject other inputs. 0!=1.
// Hint: An int or long factorial overflows quickly.
// Practice: --practice 261; reference: --verify 261
static class E261 {

 public static BigInteger Practice(int n) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 261");
 }
 public static BigInteger Reference(int n) {
  if(n < 0 || n > 17) throw new ArgumentOutOfRangeException(nameof(n)); BigInteger result=BigInteger.One; for(int i=2;i<=n;i++) result*=i; return result;
 }
 private static BigInteger Solve(int n) => Check.PracticeMode ? Practice(n) : Reference(n);
 public static void Verify() {
  Check.Equal(BigInteger.One, Solve(0));
  Check.Equal(new BigInteger(120), Solve(5));
  Check.Equal(new BigInteger(3628800), Solve(10));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(18); });
 }
}

// ======================================================================
// 262: BigInteger factorials / scenario 9
// Return n! using BigInteger for 0<=n<=18; reject other inputs. 0!=1.
// Hint: An int or long factorial overflows quickly.
// Practice: --practice 262; reference: --verify 262
static class E262 {

 public static BigInteger Practice(int n) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 262");
 }
 public static BigInteger Reference(int n) {
  if(n < 0 || n > 18) throw new ArgumentOutOfRangeException(nameof(n)); BigInteger result=BigInteger.One; for(int i=2;i<=n;i++) result*=i; return result;
 }
 private static BigInteger Solve(int n) => Check.PracticeMode ? Practice(n) : Reference(n);
 public static void Verify() {
  Check.Equal(BigInteger.One, Solve(0));
  Check.Equal(new BigInteger(120), Solve(5));
  Check.Equal(new BigInteger(3628800), Solve(10));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(19); });
 }
}

// ======================================================================
// 263: BigInteger factorials / scenario 10
// Return n! using BigInteger for 0<=n<=19; reject other inputs. 0!=1.
// Hint: An int or long factorial overflows quickly.
// Practice: --practice 263; reference: --verify 263
static class E263 {

 public static BigInteger Practice(int n) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 263");
 }
 public static BigInteger Reference(int n) {
  if(n < 0 || n > 19) throw new ArgumentOutOfRangeException(nameof(n)); BigInteger result=BigInteger.One; for(int i=2;i<=n;i++) result*=i; return result;
 }
 private static BigInteger Solve(int n) => Check.PracticeMode ? Practice(n) : Reference(n);
 public static void Verify() {
  Check.Equal(BigInteger.One, Solve(0));
  Check.Equal(new BigInteger(120), Solve(5));
  Check.Equal(new BigInteger(3628800), Solve(10));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(20); });
 }
}

// ======================================================================
// 264: BigInteger factorials / scenario 11
// Return n! using BigInteger for 0<=n<=20; reject other inputs. 0!=1.
// Hint: An int or long factorial overflows quickly.
// Practice: --practice 264; reference: --verify 264
static class E264 {

 public static BigInteger Practice(int n) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 264");
 }
 public static BigInteger Reference(int n) {
  if(n < 0 || n > 20) throw new ArgumentOutOfRangeException(nameof(n)); BigInteger result=BigInteger.One; for(int i=2;i<=n;i++) result*=i; return result;
 }
 private static BigInteger Solve(int n) => Check.PracticeMode ? Practice(n) : Reference(n);
 public static void Verify() {
  Check.Equal(BigInteger.One, Solve(0));
  Check.Equal(new BigInteger(120), Solve(5));
  Check.Equal(new BigInteger(3628800), Solve(10));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(21); });
 }
}

// ======================================================================
// 265: Checked integer multiplication / scenario 1
// Multiply int32 by2; throw OverflowException rather than wrap when out of range.
// Hint: checked changes integral arithmetic overflow behavior.
// Practice: --practice 265; reference: --verify 265
static class E265 {

 public static int Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 265");
 }
 public static int Reference(int value) {
  return checked(value * 2);
 }
 private static int Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(6, Solve(3));
  Check.Equal(-2, Solve(-1));
  Check.Equal(0, Solve(0));
  Check.Throws<OverflowException>(() => { Solve(int.MaxValue); });
 }
}

// ======================================================================
// 266: Checked integer multiplication / scenario 2
// Multiply int32 by3; throw OverflowException rather than wrap when out of range.
// Hint: checked changes integral arithmetic overflow behavior.
// Practice: --practice 266; reference: --verify 266
static class E266 {

 public static int Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 266");
 }
 public static int Reference(int value) {
  return checked(value * 3);
 }
 private static int Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(9, Solve(3));
  Check.Equal(-3, Solve(-1));
  Check.Equal(0, Solve(0));
  Check.Throws<OverflowException>(() => { Solve(int.MaxValue); });
 }
}

// ======================================================================
// 267: Checked integer multiplication / scenario 3
// Multiply int32 by4; throw OverflowException rather than wrap when out of range.
// Hint: checked changes integral arithmetic overflow behavior.
// Practice: --practice 267; reference: --verify 267
static class E267 {

 public static int Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 267");
 }
 public static int Reference(int value) {
  return checked(value * 4);
 }
 private static int Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(12, Solve(3));
  Check.Equal(-4, Solve(-1));
  Check.Equal(0, Solve(0));
  Check.Throws<OverflowException>(() => { Solve(int.MaxValue); });
 }
}

// ======================================================================
// 268: Checked integer multiplication / scenario 4
// Multiply int32 by5; throw OverflowException rather than wrap when out of range.
// Hint: checked changes integral arithmetic overflow behavior.
// Practice: --practice 268; reference: --verify 268
static class E268 {

 public static int Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 268");
 }
 public static int Reference(int value) {
  return checked(value * 5);
 }
 private static int Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(15, Solve(3));
  Check.Equal(-5, Solve(-1));
  Check.Equal(0, Solve(0));
  Check.Throws<OverflowException>(() => { Solve(int.MaxValue); });
 }
}

// ======================================================================
// 269: Checked integer multiplication / scenario 5
// Multiply int32 by6; throw OverflowException rather than wrap when out of range.
// Hint: checked changes integral arithmetic overflow behavior.
// Practice: --practice 269; reference: --verify 269
static class E269 {

 public static int Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 269");
 }
 public static int Reference(int value) {
  return checked(value * 6);
 }
 private static int Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(18, Solve(3));
  Check.Equal(-6, Solve(-1));
  Check.Equal(0, Solve(0));
  Check.Throws<OverflowException>(() => { Solve(int.MaxValue); });
 }
}

// ======================================================================
// 270: Checked integer multiplication / scenario 6
// Multiply int32 by7; throw OverflowException rather than wrap when out of range.
// Hint: checked changes integral arithmetic overflow behavior.
// Practice: --practice 270; reference: --verify 270
static class E270 {

 public static int Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 270");
 }
 public static int Reference(int value) {
  return checked(value * 7);
 }
 private static int Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(21, Solve(3));
  Check.Equal(-7, Solve(-1));
  Check.Equal(0, Solve(0));
  Check.Throws<OverflowException>(() => { Solve(int.MaxValue); });
 }
}

// ======================================================================
// 271: Checked integer multiplication / scenario 7
// Multiply int32 by8; throw OverflowException rather than wrap when out of range.
// Hint: checked changes integral arithmetic overflow behavior.
// Practice: --practice 271; reference: --verify 271
static class E271 {

 public static int Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 271");
 }
 public static int Reference(int value) {
  return checked(value * 8);
 }
 private static int Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(24, Solve(3));
  Check.Equal(-8, Solve(-1));
  Check.Equal(0, Solve(0));
  Check.Throws<OverflowException>(() => { Solve(int.MaxValue); });
 }
}

// ======================================================================
// 272: Checked integer multiplication / scenario 8
// Multiply int32 by9; throw OverflowException rather than wrap when out of range.
// Hint: checked changes integral arithmetic overflow behavior.
// Practice: --practice 272; reference: --verify 272
static class E272 {

 public static int Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 272");
 }
 public static int Reference(int value) {
  return checked(value * 9);
 }
 private static int Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(27, Solve(3));
  Check.Equal(-9, Solve(-1));
  Check.Equal(0, Solve(0));
  Check.Throws<OverflowException>(() => { Solve(int.MaxValue); });
 }
}

// ======================================================================
// 273: Checked integer multiplication / scenario 9
// Multiply int32 by10; throw OverflowException rather than wrap when out of range.
// Hint: checked changes integral arithmetic overflow behavior.
// Practice: --practice 273; reference: --verify 273
static class E273 {

 public static int Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 273");
 }
 public static int Reference(int value) {
  return checked(value * 10);
 }
 private static int Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(30, Solve(3));
  Check.Equal(-10, Solve(-1));
  Check.Equal(0, Solve(0));
  Check.Throws<OverflowException>(() => { Solve(int.MaxValue); });
 }
}

// ======================================================================
// 274: Checked integer multiplication / scenario 10
// Multiply int32 by11; throw OverflowException rather than wrap when out of range.
// Hint: checked changes integral arithmetic overflow behavior.
// Practice: --practice 274; reference: --verify 274
static class E274 {

 public static int Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 274");
 }
 public static int Reference(int value) {
  return checked(value * 11);
 }
 private static int Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(33, Solve(3));
  Check.Equal(-11, Solve(-1));
  Check.Equal(0, Solve(0));
  Check.Throws<OverflowException>(() => { Solve(int.MaxValue); });
 }
}

// ======================================================================
// 275: Checked integer multiplication / scenario 11
// Multiply int32 by12; throw OverflowException rather than wrap when out of range.
// Hint: checked changes integral arithmetic overflow behavior.
// Practice: --practice 275; reference: --verify 275
static class E275 {

 public static int Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 275");
 }
 public static int Reference(int value) {
  return checked(value * 12);
 }
 private static int Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal(36, Solve(3));
  Check.Equal(-12, Solve(-1));
  Check.Equal(0, Solve(0));
  Check.Throws<OverflowException>(() => { Solve(int.MaxValue); });
 }
}

// ======================================================================
// 276: Binary bit masks / scenario 1
// Set or clear bit0 of a uint according to enabled, preserving every other bit.
// Hint: Set with OR, clear with AND of the complemented mask.
// Practice: --practice 276; reference: --verify 276
static class E276 {

 public static uint Practice(uint value, bool enabled) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 276");
 }
 public static uint Reference(uint value, bool enabled) {
  uint mask = 1u << 0; return enabled ? value | mask : value & ~mask;
 }
 private static uint Solve(uint value, bool enabled) => Check.PracticeMode ? Practice(value, enabled) : Reference(value, enabled);
 public static void Verify() {
  Check.Equal(1u, Solve(0u, true));
  Check.Equal(0u, Solve(1u, false));
  Check.Equal(4294967294u, Solve(uint.MaxValue, false));
  Check.Equal(uint.MaxValue, Solve(uint.MaxValue, true));
 }
}

// ======================================================================
// 277: Binary bit masks / scenario 2
// Set or clear bit1 of a uint according to enabled, preserving every other bit.
// Hint: Set with OR, clear with AND of the complemented mask.
// Practice: --practice 277; reference: --verify 277
static class E277 {

 public static uint Practice(uint value, bool enabled) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 277");
 }
 public static uint Reference(uint value, bool enabled) {
  uint mask = 1u << 1; return enabled ? value | mask : value & ~mask;
 }
 private static uint Solve(uint value, bool enabled) => Check.PracticeMode ? Practice(value, enabled) : Reference(value, enabled);
 public static void Verify() {
  Check.Equal(2u, Solve(0u, true));
  Check.Equal(0u, Solve(2u, false));
  Check.Equal(4294967293u, Solve(uint.MaxValue, false));
  Check.Equal(uint.MaxValue, Solve(uint.MaxValue, true));
 }
}

// ======================================================================
// 278: Binary bit masks / scenario 3
// Set or clear bit2 of a uint according to enabled, preserving every other bit.
// Hint: Set with OR, clear with AND of the complemented mask.
// Practice: --practice 278; reference: --verify 278
static class E278 {

 public static uint Practice(uint value, bool enabled) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 278");
 }
 public static uint Reference(uint value, bool enabled) {
  uint mask = 1u << 2; return enabled ? value | mask : value & ~mask;
 }
 private static uint Solve(uint value, bool enabled) => Check.PracticeMode ? Practice(value, enabled) : Reference(value, enabled);
 public static void Verify() {
  Check.Equal(4u, Solve(0u, true));
  Check.Equal(0u, Solve(4u, false));
  Check.Equal(4294967291u, Solve(uint.MaxValue, false));
  Check.Equal(uint.MaxValue, Solve(uint.MaxValue, true));
 }
}

// ======================================================================
// 279: Binary bit masks / scenario 4
// Set or clear bit3 of a uint according to enabled, preserving every other bit.
// Hint: Set with OR, clear with AND of the complemented mask.
// Practice: --practice 279; reference: --verify 279
static class E279 {

 public static uint Practice(uint value, bool enabled) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 279");
 }
 public static uint Reference(uint value, bool enabled) {
  uint mask = 1u << 3; return enabled ? value | mask : value & ~mask;
 }
 private static uint Solve(uint value, bool enabled) => Check.PracticeMode ? Practice(value, enabled) : Reference(value, enabled);
 public static void Verify() {
  Check.Equal(8u, Solve(0u, true));
  Check.Equal(0u, Solve(8u, false));
  Check.Equal(4294967287u, Solve(uint.MaxValue, false));
  Check.Equal(uint.MaxValue, Solve(uint.MaxValue, true));
 }
}

// ======================================================================
// 280: Binary bit masks / scenario 5
// Set or clear bit4 of a uint according to enabled, preserving every other bit.
// Hint: Set with OR, clear with AND of the complemented mask.
// Practice: --practice 280; reference: --verify 280
static class E280 {

 public static uint Practice(uint value, bool enabled) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 280");
 }
 public static uint Reference(uint value, bool enabled) {
  uint mask = 1u << 4; return enabled ? value | mask : value & ~mask;
 }
 private static uint Solve(uint value, bool enabled) => Check.PracticeMode ? Practice(value, enabled) : Reference(value, enabled);
 public static void Verify() {
  Check.Equal(16u, Solve(0u, true));
  Check.Equal(0u, Solve(16u, false));
  Check.Equal(4294967279u, Solve(uint.MaxValue, false));
  Check.Equal(uint.MaxValue, Solve(uint.MaxValue, true));
 }
}

// ======================================================================
// 281: Binary bit masks / scenario 6
// Set or clear bit5 of a uint according to enabled, preserving every other bit.
// Hint: Set with OR, clear with AND of the complemented mask.
// Practice: --practice 281; reference: --verify 281
static class E281 {

 public static uint Practice(uint value, bool enabled) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 281");
 }
 public static uint Reference(uint value, bool enabled) {
  uint mask = 1u << 5; return enabled ? value | mask : value & ~mask;
 }
 private static uint Solve(uint value, bool enabled) => Check.PracticeMode ? Practice(value, enabled) : Reference(value, enabled);
 public static void Verify() {
  Check.Equal(32u, Solve(0u, true));
  Check.Equal(0u, Solve(32u, false));
  Check.Equal(4294967263u, Solve(uint.MaxValue, false));
  Check.Equal(uint.MaxValue, Solve(uint.MaxValue, true));
 }
}

// ======================================================================
// 282: Binary bit masks / scenario 7
// Set or clear bit6 of a uint according to enabled, preserving every other bit.
// Hint: Set with OR, clear with AND of the complemented mask.
// Practice: --practice 282; reference: --verify 282
static class E282 {

 public static uint Practice(uint value, bool enabled) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 282");
 }
 public static uint Reference(uint value, bool enabled) {
  uint mask = 1u << 6; return enabled ? value | mask : value & ~mask;
 }
 private static uint Solve(uint value, bool enabled) => Check.PracticeMode ? Practice(value, enabled) : Reference(value, enabled);
 public static void Verify() {
  Check.Equal(64u, Solve(0u, true));
  Check.Equal(0u, Solve(64u, false));
  Check.Equal(4294967231u, Solve(uint.MaxValue, false));
  Check.Equal(uint.MaxValue, Solve(uint.MaxValue, true));
 }
}

// ======================================================================
// 283: Binary bit masks / scenario 8
// Set or clear bit7 of a uint according to enabled, preserving every other bit.
// Hint: Set with OR, clear with AND of the complemented mask.
// Practice: --practice 283; reference: --verify 283
static class E283 {

 public static uint Practice(uint value, bool enabled) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 283");
 }
 public static uint Reference(uint value, bool enabled) {
  uint mask = 1u << 7; return enabled ? value | mask : value & ~mask;
 }
 private static uint Solve(uint value, bool enabled) => Check.PracticeMode ? Practice(value, enabled) : Reference(value, enabled);
 public static void Verify() {
  Check.Equal(128u, Solve(0u, true));
  Check.Equal(0u, Solve(128u, false));
  Check.Equal(4294967167u, Solve(uint.MaxValue, false));
  Check.Equal(uint.MaxValue, Solve(uint.MaxValue, true));
 }
}

// ======================================================================
// 284: Binary bit masks / scenario 9
// Set or clear bit8 of a uint according to enabled, preserving every other bit.
// Hint: Set with OR, clear with AND of the complemented mask.
// Practice: --practice 284; reference: --verify 284
static class E284 {

 public static uint Practice(uint value, bool enabled) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 284");
 }
 public static uint Reference(uint value, bool enabled) {
  uint mask = 1u << 8; return enabled ? value | mask : value & ~mask;
 }
 private static uint Solve(uint value, bool enabled) => Check.PracticeMode ? Practice(value, enabled) : Reference(value, enabled);
 public static void Verify() {
  Check.Equal(256u, Solve(0u, true));
  Check.Equal(0u, Solve(256u, false));
  Check.Equal(4294967039u, Solve(uint.MaxValue, false));
  Check.Equal(uint.MaxValue, Solve(uint.MaxValue, true));
 }
}

// ======================================================================
// 285: Binary bit masks / scenario 10
// Set or clear bit9 of a uint according to enabled, preserving every other bit.
// Hint: Set with OR, clear with AND of the complemented mask.
// Practice: --practice 285; reference: --verify 285
static class E285 {

 public static uint Practice(uint value, bool enabled) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 285");
 }
 public static uint Reference(uint value, bool enabled) {
  uint mask = 1u << 9; return enabled ? value | mask : value & ~mask;
 }
 private static uint Solve(uint value, bool enabled) => Check.PracticeMode ? Practice(value, enabled) : Reference(value, enabled);
 public static void Verify() {
  Check.Equal(512u, Solve(0u, true));
  Check.Equal(0u, Solve(512u, false));
  Check.Equal(4294966783u, Solve(uint.MaxValue, false));
  Check.Equal(uint.MaxValue, Solve(uint.MaxValue, true));
 }
}

// ======================================================================
// 286: Binary bit masks / scenario 11
// Set or clear bit10 of a uint according to enabled, preserving every other bit.
// Hint: Set with OR, clear with AND of the complemented mask.
// Practice: --practice 286; reference: --verify 286
static class E286 {

 public static uint Practice(uint value, bool enabled) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 286");
 }
 public static uint Reference(uint value, bool enabled) {
  uint mask = 1u << 10; return enabled ? value | mask : value & ~mask;
 }
 private static uint Solve(uint value, bool enabled) => Check.PracticeMode ? Practice(value, enabled) : Reference(value, enabled);
 public static void Verify() {
  Check.Equal(1024u, Solve(0u, true));
  Check.Equal(0u, Solve(1024u, false));
  Check.Equal(4294966271u, Solve(uint.MaxValue, false));
  Check.Equal(uint.MaxValue, Solve(uint.MaxValue, true));
 }
}

// ======================================================================
// 287: Little-endian binary encoding / scenario 1
// Read a signed little-endian int32 beginning at offset0. Reject buffers shorter than4. Do not mutate input.
// Hint: BinaryPrimitives makes endianness explicit and independent of hardware.
// Practice: --practice 287; reference: --verify 287
static class E287 {

 public static int Practice(byte[] buffer) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 287");
 }
 public static int Reference(byte[] buffer) {
  if(buffer.Length < 4) throw new ArgumentException("Buffer too short"); return BinaryPrimitives.ReadInt32LittleEndian(buffer.AsSpan(0, 4));
 }
 private static int Solve(byte[] buffer) => Check.PracticeMode ? Practice(buffer) : Reference(buffer);
 public static void Verify() {
  Check.Equal(16909060, Solve(new byte[] { 4,3,2,1 }));
  Check.Equal(-1, Solve(Enumerable.Repeat((byte)255, 4).ToArray()));
  Check.Throws<ArgumentException>(() => { Solve(Array.Empty<byte>()); });
 }
}

// ======================================================================
// 288: Little-endian binary encoding / scenario 2
// Read a signed little-endian int32 beginning at offset1. Reject buffers shorter than5. Do not mutate input.
// Hint: BinaryPrimitives makes endianness explicit and independent of hardware.
// Practice: --practice 288; reference: --verify 288
static class E288 {

 public static int Practice(byte[] buffer) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 288");
 }
 public static int Reference(byte[] buffer) {
  if(buffer.Length < 5) throw new ArgumentException("Buffer too short"); return BinaryPrimitives.ReadInt32LittleEndian(buffer.AsSpan(1, 4));
 }
 private static int Solve(byte[] buffer) => Check.PracticeMode ? Practice(buffer) : Reference(buffer);
 public static void Verify() {
  Check.Equal(16909060, Solve(new byte[] { 0,4,3,2,1 }));
  Check.Equal(-1, Solve(Enumerable.Repeat((byte)255, 5).ToArray()));
  Check.Throws<ArgumentException>(() => { Solve(Array.Empty<byte>()); });
 }
}

// ======================================================================
// 289: Little-endian binary encoding / scenario 3
// Read a signed little-endian int32 beginning at offset2. Reject buffers shorter than6. Do not mutate input.
// Hint: BinaryPrimitives makes endianness explicit and independent of hardware.
// Practice: --practice 289; reference: --verify 289
static class E289 {

 public static int Practice(byte[] buffer) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 289");
 }
 public static int Reference(byte[] buffer) {
  if(buffer.Length < 6) throw new ArgumentException("Buffer too short"); return BinaryPrimitives.ReadInt32LittleEndian(buffer.AsSpan(2, 4));
 }
 private static int Solve(byte[] buffer) => Check.PracticeMode ? Practice(buffer) : Reference(buffer);
 public static void Verify() {
  Check.Equal(16909060, Solve(new byte[] { 0,0,4,3,2,1 }));
  Check.Equal(-1, Solve(Enumerable.Repeat((byte)255, 6).ToArray()));
  Check.Throws<ArgumentException>(() => { Solve(Array.Empty<byte>()); });
 }
}

// ======================================================================
// 290: Little-endian binary encoding / scenario 4
// Read a signed little-endian int32 beginning at offset3. Reject buffers shorter than7. Do not mutate input.
// Hint: BinaryPrimitives makes endianness explicit and independent of hardware.
// Practice: --practice 290; reference: --verify 290
static class E290 {

 public static int Practice(byte[] buffer) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 290");
 }
 public static int Reference(byte[] buffer) {
  if(buffer.Length < 7) throw new ArgumentException("Buffer too short"); return BinaryPrimitives.ReadInt32LittleEndian(buffer.AsSpan(3, 4));
 }
 private static int Solve(byte[] buffer) => Check.PracticeMode ? Practice(buffer) : Reference(buffer);
 public static void Verify() {
  Check.Equal(16909060, Solve(new byte[] { 0,0,0,4,3,2,1 }));
  Check.Equal(-1, Solve(Enumerable.Repeat((byte)255, 7).ToArray()));
  Check.Throws<ArgumentException>(() => { Solve(Array.Empty<byte>()); });
 }
}

// ======================================================================
// 291: Little-endian binary encoding / scenario 5
// Read a signed little-endian int32 beginning at offset4. Reject buffers shorter than8. Do not mutate input.
// Hint: BinaryPrimitives makes endianness explicit and independent of hardware.
// Practice: --practice 291; reference: --verify 291
static class E291 {

 public static int Practice(byte[] buffer) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 291");
 }
 public static int Reference(byte[] buffer) {
  if(buffer.Length < 8) throw new ArgumentException("Buffer too short"); return BinaryPrimitives.ReadInt32LittleEndian(buffer.AsSpan(4, 4));
 }
 private static int Solve(byte[] buffer) => Check.PracticeMode ? Practice(buffer) : Reference(buffer);
 public static void Verify() {
  Check.Equal(16909060, Solve(new byte[] { 0,0,0,0,4,3,2,1 }));
  Check.Equal(-1, Solve(Enumerable.Repeat((byte)255, 8).ToArray()));
  Check.Throws<ArgumentException>(() => { Solve(Array.Empty<byte>()); });
 }
}

// ======================================================================
// 292: Little-endian binary encoding / scenario 6
// Read a signed little-endian int32 beginning at offset5. Reject buffers shorter than9. Do not mutate input.
// Hint: BinaryPrimitives makes endianness explicit and independent of hardware.
// Practice: --practice 292; reference: --verify 292
static class E292 {

 public static int Practice(byte[] buffer) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 292");
 }
 public static int Reference(byte[] buffer) {
  if(buffer.Length < 9) throw new ArgumentException("Buffer too short"); return BinaryPrimitives.ReadInt32LittleEndian(buffer.AsSpan(5, 4));
 }
 private static int Solve(byte[] buffer) => Check.PracticeMode ? Practice(buffer) : Reference(buffer);
 public static void Verify() {
  Check.Equal(16909060, Solve(new byte[] { 0,0,0,0,0,4,3,2,1 }));
  Check.Equal(-1, Solve(Enumerable.Repeat((byte)255, 9).ToArray()));
  Check.Throws<ArgumentException>(() => { Solve(Array.Empty<byte>()); });
 }
}

// ======================================================================
// 293: Little-endian binary encoding / scenario 7
// Read a signed little-endian int32 beginning at offset6. Reject buffers shorter than10. Do not mutate input.
// Hint: BinaryPrimitives makes endianness explicit and independent of hardware.
// Practice: --practice 293; reference: --verify 293
static class E293 {

 public static int Practice(byte[] buffer) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 293");
 }
 public static int Reference(byte[] buffer) {
  if(buffer.Length < 10) throw new ArgumentException("Buffer too short"); return BinaryPrimitives.ReadInt32LittleEndian(buffer.AsSpan(6, 4));
 }
 private static int Solve(byte[] buffer) => Check.PracticeMode ? Practice(buffer) : Reference(buffer);
 public static void Verify() {
  Check.Equal(16909060, Solve(new byte[] { 0,0,0,0,0,0,4,3,2,1 }));
  Check.Equal(-1, Solve(Enumerable.Repeat((byte)255, 10).ToArray()));
  Check.Throws<ArgumentException>(() => { Solve(Array.Empty<byte>()); });
 }
}

// ======================================================================
// 294: Little-endian binary encoding / scenario 8
// Read a signed little-endian int32 beginning at offset7. Reject buffers shorter than11. Do not mutate input.
// Hint: BinaryPrimitives makes endianness explicit and independent of hardware.
// Practice: --practice 294; reference: --verify 294
static class E294 {

 public static int Practice(byte[] buffer) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 294");
 }
 public static int Reference(byte[] buffer) {
  if(buffer.Length < 11) throw new ArgumentException("Buffer too short"); return BinaryPrimitives.ReadInt32LittleEndian(buffer.AsSpan(7, 4));
 }
 private static int Solve(byte[] buffer) => Check.PracticeMode ? Practice(buffer) : Reference(buffer);
 public static void Verify() {
  Check.Equal(16909060, Solve(new byte[] { 0,0,0,0,0,0,0,4,3,2,1 }));
  Check.Equal(-1, Solve(Enumerable.Repeat((byte)255, 11).ToArray()));
  Check.Throws<ArgumentException>(() => { Solve(Array.Empty<byte>()); });
 }
}

// ======================================================================
// 295: Little-endian binary encoding / scenario 9
// Read a signed little-endian int32 beginning at offset8. Reject buffers shorter than12. Do not mutate input.
// Hint: BinaryPrimitives makes endianness explicit and independent of hardware.
// Practice: --practice 295; reference: --verify 295
static class E295 {

 public static int Practice(byte[] buffer) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 295");
 }
 public static int Reference(byte[] buffer) {
  if(buffer.Length < 12) throw new ArgumentException("Buffer too short"); return BinaryPrimitives.ReadInt32LittleEndian(buffer.AsSpan(8, 4));
 }
 private static int Solve(byte[] buffer) => Check.PracticeMode ? Practice(buffer) : Reference(buffer);
 public static void Verify() {
  Check.Equal(16909060, Solve(new byte[] { 0,0,0,0,0,0,0,0,4,3,2,1 }));
  Check.Equal(-1, Solve(Enumerable.Repeat((byte)255, 12).ToArray()));
  Check.Throws<ArgumentException>(() => { Solve(Array.Empty<byte>()); });
 }
}

// ======================================================================
// 296: Little-endian binary encoding / scenario 10
// Read a signed little-endian int32 beginning at offset9. Reject buffers shorter than13. Do not mutate input.
// Hint: BinaryPrimitives makes endianness explicit and independent of hardware.
// Practice: --practice 296; reference: --verify 296
static class E296 {

 public static int Practice(byte[] buffer) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 296");
 }
 public static int Reference(byte[] buffer) {
  if(buffer.Length < 13) throw new ArgumentException("Buffer too short"); return BinaryPrimitives.ReadInt32LittleEndian(buffer.AsSpan(9, 4));
 }
 private static int Solve(byte[] buffer) => Check.PracticeMode ? Practice(buffer) : Reference(buffer);
 public static void Verify() {
  Check.Equal(16909060, Solve(new byte[] { 0,0,0,0,0,0,0,0,0,4,3,2,1 }));
  Check.Equal(-1, Solve(Enumerable.Repeat((byte)255, 13).ToArray()));
  Check.Throws<ArgumentException>(() => { Solve(Array.Empty<byte>()); });
 }
}

// ======================================================================
// 297: Little-endian binary encoding / scenario 11
// Read a signed little-endian int32 beginning at offset10. Reject buffers shorter than14. Do not mutate input.
// Hint: BinaryPrimitives makes endianness explicit and independent of hardware.
// Practice: --practice 297; reference: --verify 297
static class E297 {

 public static int Practice(byte[] buffer) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 297");
 }
 public static int Reference(byte[] buffer) {
  if(buffer.Length < 14) throw new ArgumentException("Buffer too short"); return BinaryPrimitives.ReadInt32LittleEndian(buffer.AsSpan(10, 4));
 }
 private static int Solve(byte[] buffer) => Check.PracticeMode ? Practice(buffer) : Reference(buffer);
 public static void Verify() {
  Check.Equal(16909060, Solve(new byte[] { 0,0,0,0,0,0,0,0,0,0,4,3,2,1 }));
  Check.Equal(-1, Solve(Enumerable.Repeat((byte)255, 14).ToArray()));
  Check.Throws<ArgumentException>(() => { Solve(Array.Empty<byte>()); });
 }
}

// ======================================================================
// 298: Queue bounded-buffer policies / scenario 1
// Keep only the newest1 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.
// Hint: Evict before enqueueing when at capacity.
// Practice: --practice 298; reference: --verify 298
static class E298 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 298");
 }
 public static int[] Reference(IEnumerable<int> values) {
  var queue=new Queue<int>(); foreach(var value in values){ if(queue.Count == 1) queue.Dequeue(); queue.Enqueue(value); } return queue.ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { 2 }, Solve(Enumerable.Range(1, 2)));
  Check.Equal(new int[] { 7 }, Solve(new[] { 7 }));
 }
}

// ======================================================================
// 299: Queue bounded-buffer policies / scenario 2
// Keep only the newest2 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.
// Hint: Evict before enqueueing when at capacity.
// Practice: --practice 299; reference: --verify 299
static class E299 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 299");
 }
 public static int[] Reference(IEnumerable<int> values) {
  var queue=new Queue<int>(); foreach(var value in values){ if(queue.Count == 2) queue.Dequeue(); queue.Enqueue(value); } return queue.ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { 2, 3 }, Solve(Enumerable.Range(1, 3)));
  Check.Equal(new int[] { 7 }, Solve(new[] { 7 }));
 }
}

// ======================================================================
// 300: Queue bounded-buffer policies / scenario 3
// Keep only the newest3 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.
// Hint: Evict before enqueueing when at capacity.
// Practice: --practice 300; reference: --verify 300
static class E300 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 300");
 }
 public static int[] Reference(IEnumerable<int> values) {
  var queue=new Queue<int>(); foreach(var value in values){ if(queue.Count == 3) queue.Dequeue(); queue.Enqueue(value); } return queue.ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { 2, 3, 4 }, Solve(Enumerable.Range(1, 4)));
  Check.Equal(new int[] { 7 }, Solve(new[] { 7 }));
 }
}

// ======================================================================
// 301: Queue bounded-buffer policies / scenario 4
// Keep only the newest4 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.
// Hint: Evict before enqueueing when at capacity.
// Practice: --practice 301; reference: --verify 301
static class E301 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 301");
 }
 public static int[] Reference(IEnumerable<int> values) {
  var queue=new Queue<int>(); foreach(var value in values){ if(queue.Count == 4) queue.Dequeue(); queue.Enqueue(value); } return queue.ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { 2, 3, 4, 5 }, Solve(Enumerable.Range(1, 5)));
  Check.Equal(new int[] { 7 }, Solve(new[] { 7 }));
 }
}

// ======================================================================
// 302: Queue bounded-buffer policies / scenario 5
// Keep only the newest5 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.
// Hint: Evict before enqueueing when at capacity.
// Practice: --practice 302; reference: --verify 302
static class E302 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 302");
 }
 public static int[] Reference(IEnumerable<int> values) {
  var queue=new Queue<int>(); foreach(var value in values){ if(queue.Count == 5) queue.Dequeue(); queue.Enqueue(value); } return queue.ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { 2, 3, 4, 5, 6 }, Solve(Enumerable.Range(1, 6)));
  Check.Equal(new int[] { 7 }, Solve(new[] { 7 }));
 }
}

// ======================================================================
// 303: Queue bounded-buffer policies / scenario 6
// Keep only the newest6 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.
// Hint: Evict before enqueueing when at capacity.
// Practice: --practice 303; reference: --verify 303
static class E303 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 303");
 }
 public static int[] Reference(IEnumerable<int> values) {
  var queue=new Queue<int>(); foreach(var value in values){ if(queue.Count == 6) queue.Dequeue(); queue.Enqueue(value); } return queue.ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { 2, 3, 4, 5, 6, 7 }, Solve(Enumerable.Range(1, 7)));
  Check.Equal(new int[] { 7 }, Solve(new[] { 7 }));
 }
}

// ======================================================================
// 304: Queue bounded-buffer policies / scenario 7
// Keep only the newest7 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.
// Hint: Evict before enqueueing when at capacity.
// Practice: --practice 304; reference: --verify 304
static class E304 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 304");
 }
 public static int[] Reference(IEnumerable<int> values) {
  var queue=new Queue<int>(); foreach(var value in values){ if(queue.Count == 7) queue.Dequeue(); queue.Enqueue(value); } return queue.ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { 2, 3, 4, 5, 6, 7, 8 }, Solve(Enumerable.Range(1, 8)));
  Check.Equal(new int[] { 7 }, Solve(new[] { 7 }));
 }
}

// ======================================================================
// 305: Queue bounded-buffer policies / scenario 8
// Keep only the newest8 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.
// Hint: Evict before enqueueing when at capacity.
// Practice: --practice 305; reference: --verify 305
static class E305 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 305");
 }
 public static int[] Reference(IEnumerable<int> values) {
  var queue=new Queue<int>(); foreach(var value in values){ if(queue.Count == 8) queue.Dequeue(); queue.Enqueue(value); } return queue.ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { 2, 3, 4, 5, 6, 7, 8, 9 }, Solve(Enumerable.Range(1, 9)));
  Check.Equal(new int[] { 7 }, Solve(new[] { 7 }));
 }
}

// ======================================================================
// 306: Queue bounded-buffer policies / scenario 9
// Keep only the newest9 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.
// Hint: Evict before enqueueing when at capacity.
// Practice: --practice 306; reference: --verify 306
static class E306 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 306");
 }
 public static int[] Reference(IEnumerable<int> values) {
  var queue=new Queue<int>(); foreach(var value in values){ if(queue.Count == 9) queue.Dequeue(); queue.Enqueue(value); } return queue.ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { 2, 3, 4, 5, 6, 7, 8, 9, 10 }, Solve(Enumerable.Range(1, 10)));
  Check.Equal(new int[] { 7 }, Solve(new[] { 7 }));
 }
}

// ======================================================================
// 307: Queue bounded-buffer policies / scenario 10
// Keep only the newest10 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.
// Hint: Evict before enqueueing when at capacity.
// Practice: --practice 307; reference: --verify 307
static class E307 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 307");
 }
 public static int[] Reference(IEnumerable<int> values) {
  var queue=new Queue<int>(); foreach(var value in values){ if(queue.Count == 10) queue.Dequeue(); queue.Enqueue(value); } return queue.ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 }, Solve(Enumerable.Range(1, 11)));
  Check.Equal(new int[] { 7 }, Solve(new[] { 7 }));
 }
}

// ======================================================================
// 308: Queue bounded-buffer policies / scenario 11
// Keep only the newest11 integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.
// Hint: Evict before enqueueing when at capacity.
// Practice: --practice 308; reference: --verify 308
static class E308 {

 public static int[] Practice(IEnumerable<int> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 308");
 }
 public static int[] Reference(IEnumerable<int> values) {
  var queue=new Queue<int>(); foreach(var value in values){ if(queue.Count == 11) queue.Dequeue(); queue.Enqueue(value); } return queue.ToArray();
 }
 private static int[] Solve(IEnumerable<int> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()));
  Check.Equal(new int[] { 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 }, Solve(Enumerable.Range(1, 12)));
  Check.Equal(new int[] { 7 }, Solve(new[] { 7 }));
 }
}

// ======================================================================
// 309: Stack-based delimiter validation / scenario 1
// Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds1, even if balanced.
// Hint: Compare each closer to the most recent opener, and check leftovers.
// Practice: --practice 309; reference: --verify 309
static class E309 {

 public static bool Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 309");
 }
 public static bool Reference(string text) {
  var stack=new Stack<char>(); foreach(var c in text){if(c is '(' or '[' or '{'){stack.Push(c);if(stack.Count>1)return false;}else if(c is ')' or ']' or '}'){if(stack.Count==0)return false;char open=stack.Pop();if((c==')'&&open!='(')||(c==']'&&open!='[')||(c=='}'&&open!='{'))return false;}} return stack.Count==0;
 }
 private static bool Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(true, Solve("(x)"));
  Check.Equal(false, Solve("([)]"));
  Check.Equal(true, Solve(""));
  Check.Equal(false, Solve("(())"));
 }
}

// ======================================================================
// 310: Stack-based delimiter validation / scenario 2
// Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds2, even if balanced.
// Hint: Compare each closer to the most recent opener, and check leftovers.
// Practice: --practice 310; reference: --verify 310
static class E310 {

 public static bool Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 310");
 }
 public static bool Reference(string text) {
  var stack=new Stack<char>(); foreach(var c in text){if(c is '(' or '[' or '{'){stack.Push(c);if(stack.Count>2)return false;}else if(c is ')' or ']' or '}'){if(stack.Count==0)return false;char open=stack.Pop();if((c==')'&&open!='(')||(c==']'&&open!='[')||(c=='}'&&open!='{'))return false;}} return stack.Count==0;
 }
 private static bool Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(true, Solve("(x)"));
  Check.Equal(false, Solve("([)]"));
  Check.Equal(true, Solve(""));
  Check.Equal(false, Solve("((()))"));
 }
}

// ======================================================================
// 311: Stack-based delimiter validation / scenario 3
// Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds3, even if balanced.
// Hint: Compare each closer to the most recent opener, and check leftovers.
// Practice: --practice 311; reference: --verify 311
static class E311 {

 public static bool Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 311");
 }
 public static bool Reference(string text) {
  var stack=new Stack<char>(); foreach(var c in text){if(c is '(' or '[' or '{'){stack.Push(c);if(stack.Count>3)return false;}else if(c is ')' or ']' or '}'){if(stack.Count==0)return false;char open=stack.Pop();if((c==')'&&open!='(')||(c==']'&&open!='[')||(c=='}'&&open!='{'))return false;}} return stack.Count==0;
 }
 private static bool Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(true, Solve("(x)"));
  Check.Equal(false, Solve("([)]"));
  Check.Equal(true, Solve(""));
  Check.Equal(false, Solve("(((())))"));
 }
}

// ======================================================================
// 312: Stack-based delimiter validation / scenario 4
// Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds4, even if balanced.
// Hint: Compare each closer to the most recent opener, and check leftovers.
// Practice: --practice 312; reference: --verify 312
static class E312 {

 public static bool Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 312");
 }
 public static bool Reference(string text) {
  var stack=new Stack<char>(); foreach(var c in text){if(c is '(' or '[' or '{'){stack.Push(c);if(stack.Count>4)return false;}else if(c is ')' or ']' or '}'){if(stack.Count==0)return false;char open=stack.Pop();if((c==')'&&open!='(')||(c==']'&&open!='[')||(c=='}'&&open!='{'))return false;}} return stack.Count==0;
 }
 private static bool Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(true, Solve("(x)"));
  Check.Equal(false, Solve("([)]"));
  Check.Equal(true, Solve(""));
  Check.Equal(false, Solve("((((()))))"));
 }
}

// ======================================================================
// 313: Stack-based delimiter validation / scenario 5
// Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds5, even if balanced.
// Hint: Compare each closer to the most recent opener, and check leftovers.
// Practice: --practice 313; reference: --verify 313
static class E313 {

 public static bool Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 313");
 }
 public static bool Reference(string text) {
  var stack=new Stack<char>(); foreach(var c in text){if(c is '(' or '[' or '{'){stack.Push(c);if(stack.Count>5)return false;}else if(c is ')' or ']' or '}'){if(stack.Count==0)return false;char open=stack.Pop();if((c==')'&&open!='(')||(c==']'&&open!='[')||(c=='}'&&open!='{'))return false;}} return stack.Count==0;
 }
 private static bool Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(true, Solve("(x)"));
  Check.Equal(false, Solve("([)]"));
  Check.Equal(true, Solve(""));
  Check.Equal(false, Solve("(((((())))))"));
 }
}

// ======================================================================
// 314: Stack-based delimiter validation / scenario 6
// Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds6, even if balanced.
// Hint: Compare each closer to the most recent opener, and check leftovers.
// Practice: --practice 314; reference: --verify 314
static class E314 {

 public static bool Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 314");
 }
 public static bool Reference(string text) {
  var stack=new Stack<char>(); foreach(var c in text){if(c is '(' or '[' or '{'){stack.Push(c);if(stack.Count>6)return false;}else if(c is ')' or ']' or '}'){if(stack.Count==0)return false;char open=stack.Pop();if((c==')'&&open!='(')||(c==']'&&open!='[')||(c=='}'&&open!='{'))return false;}} return stack.Count==0;
 }
 private static bool Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(true, Solve("(x)"));
  Check.Equal(false, Solve("([)]"));
  Check.Equal(true, Solve(""));
  Check.Equal(false, Solve("((((((()))))))"));
 }
}

// ======================================================================
// 315: Stack-based delimiter validation / scenario 7
// Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds7, even if balanced.
// Hint: Compare each closer to the most recent opener, and check leftovers.
// Practice: --practice 315; reference: --verify 315
static class E315 {

 public static bool Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 315");
 }
 public static bool Reference(string text) {
  var stack=new Stack<char>(); foreach(var c in text){if(c is '(' or '[' or '{'){stack.Push(c);if(stack.Count>7)return false;}else if(c is ')' or ']' or '}'){if(stack.Count==0)return false;char open=stack.Pop();if((c==')'&&open!='(')||(c==']'&&open!='[')||(c=='}'&&open!='{'))return false;}} return stack.Count==0;
 }
 private static bool Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(true, Solve("(x)"));
  Check.Equal(false, Solve("([)]"));
  Check.Equal(true, Solve(""));
  Check.Equal(false, Solve("(((((((())))))))"));
 }
}

// ======================================================================
// 316: Stack-based delimiter validation / scenario 8
// Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds8, even if balanced.
// Hint: Compare each closer to the most recent opener, and check leftovers.
// Practice: --practice 316; reference: --verify 316
static class E316 {

 public static bool Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 316");
 }
 public static bool Reference(string text) {
  var stack=new Stack<char>(); foreach(var c in text){if(c is '(' or '[' or '{'){stack.Push(c);if(stack.Count>8)return false;}else if(c is ')' or ']' or '}'){if(stack.Count==0)return false;char open=stack.Pop();if((c==')'&&open!='(')||(c==']'&&open!='[')||(c=='}'&&open!='{'))return false;}} return stack.Count==0;
 }
 private static bool Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(true, Solve("(x)"));
  Check.Equal(false, Solve("([)]"));
  Check.Equal(true, Solve(""));
  Check.Equal(false, Solve("((((((((()))))))))"));
 }
}

// ======================================================================
// 317: Stack-based delimiter validation / scenario 9
// Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds9, even if balanced.
// Hint: Compare each closer to the most recent opener, and check leftovers.
// Practice: --practice 317; reference: --verify 317
static class E317 {

 public static bool Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 317");
 }
 public static bool Reference(string text) {
  var stack=new Stack<char>(); foreach(var c in text){if(c is '(' or '[' or '{'){stack.Push(c);if(stack.Count>9)return false;}else if(c is ')' or ']' or '}'){if(stack.Count==0)return false;char open=stack.Pop();if((c==')'&&open!='(')||(c==']'&&open!='[')||(c=='}'&&open!='{'))return false;}} return stack.Count==0;
 }
 private static bool Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(true, Solve("(x)"));
  Check.Equal(false, Solve("([)]"));
  Check.Equal(true, Solve(""));
  Check.Equal(false, Solve("(((((((((())))))))))"));
 }
}

// ======================================================================
// 318: Stack-based delimiter validation / scenario 10
// Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds10, even if balanced.
// Hint: Compare each closer to the most recent opener, and check leftovers.
// Practice: --practice 318; reference: --verify 318
static class E318 {

 public static bool Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 318");
 }
 public static bool Reference(string text) {
  var stack=new Stack<char>(); foreach(var c in text){if(c is '(' or '[' or '{'){stack.Push(c);if(stack.Count>10)return false;}else if(c is ')' or ']' or '}'){if(stack.Count==0)return false;char open=stack.Pop();if((c==')'&&open!='(')||(c==']'&&open!='[')||(c=='}'&&open!='{'))return false;}} return stack.Count==0;
 }
 private static bool Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(true, Solve("(x)"));
  Check.Equal(false, Solve("([)]"));
  Check.Equal(true, Solve(""));
  Check.Equal(false, Solve("((((((((((()))))))))))"));
 }
}

// ======================================================================
// 319: Stack-based delimiter validation / scenario 11
// Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds11, even if balanced.
// Hint: Compare each closer to the most recent opener, and check leftovers.
// Practice: --practice 319; reference: --verify 319
static class E319 {

 public static bool Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 319");
 }
 public static bool Reference(string text) {
  var stack=new Stack<char>(); foreach(var c in text){if(c is '(' or '[' or '{'){stack.Push(c);if(stack.Count>11)return false;}else if(c is ')' or ']' or '}'){if(stack.Count==0)return false;char open=stack.Pop();if((c==')'&&open!='(')||(c==']'&&open!='[')||(c=='}'&&open!='{'))return false;}} return stack.Count==0;
 }
 private static bool Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(true, Solve("(x)"));
  Check.Equal(false, Solve("([)]"));
  Check.Equal(true, Solve(""));
  Check.Equal(false, Solve("(((((((((((())))))))))))"));
 }
}

// ======================================================================
// 320: PriorityQueue stable scheduling / scenario 1
// Return names of up to1 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.
// Hint: PriorityQueue does not promise stable equal-priority ordering.
// Practice: --practice 320; reference: --verify 320
static class E320 {
public sealed record Job(string Name,int Priority);
 public static string[] Practice(Job[] jobs) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 320");
 }
 public static string[] Reference(Job[] jobs) {
  var queue=new PriorityQueue<Job,(int Priority,int Index)>(); for(int i=0;i<jobs.Length;i++)queue.Enqueue(jobs[i],(jobs[i].Priority,i));var result=new List<string>();while(queue.Count>0&&result.Count<1)result.Add(queue.Dequeue().Name);return result.ToArray();
 }
 private static string[] Solve(Job[] jobs) => Check.PracticeMode ? Practice(jobs) : Reference(jobs);
 public static void Verify() {
  Check.Equal(new string[] { "b" }, Solve(new[] { new Job("a",2), new Job("b",1), new Job("c",1) }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<Job>()));
  Check.Equal(new string[] { "x" }, Solve(new[] { new Job("x",0) }));
 }
}

// ======================================================================
// 321: PriorityQueue stable scheduling / scenario 2
// Return names of up to2 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.
// Hint: PriorityQueue does not promise stable equal-priority ordering.
// Practice: --practice 321; reference: --verify 321
static class E321 {
public sealed record Job(string Name,int Priority);
 public static string[] Practice(Job[] jobs) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 321");
 }
 public static string[] Reference(Job[] jobs) {
  var queue=new PriorityQueue<Job,(int Priority,int Index)>(); for(int i=0;i<jobs.Length;i++)queue.Enqueue(jobs[i],(jobs[i].Priority,i));var result=new List<string>();while(queue.Count>0&&result.Count<2)result.Add(queue.Dequeue().Name);return result.ToArray();
 }
 private static string[] Solve(Job[] jobs) => Check.PracticeMode ? Practice(jobs) : Reference(jobs);
 public static void Verify() {
  Check.Equal(new string[] { "b", "c" }, Solve(new[] { new Job("a",2), new Job("b",1), new Job("c",1) }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<Job>()));
  Check.Equal(new string[] { "x" }, Solve(new[] { new Job("x",0) }));
 }
}

// ======================================================================
// 322: PriorityQueue stable scheduling / scenario 3
// Return names of up to3 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.
// Hint: PriorityQueue does not promise stable equal-priority ordering.
// Practice: --practice 322; reference: --verify 322
static class E322 {
public sealed record Job(string Name,int Priority);
 public static string[] Practice(Job[] jobs) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 322");
 }
 public static string[] Reference(Job[] jobs) {
  var queue=new PriorityQueue<Job,(int Priority,int Index)>(); for(int i=0;i<jobs.Length;i++)queue.Enqueue(jobs[i],(jobs[i].Priority,i));var result=new List<string>();while(queue.Count>0&&result.Count<3)result.Add(queue.Dequeue().Name);return result.ToArray();
 }
 private static string[] Solve(Job[] jobs) => Check.PracticeMode ? Practice(jobs) : Reference(jobs);
 public static void Verify() {
  Check.Equal(new string[] { "b", "c", "a" }, Solve(new[] { new Job("a",2), new Job("b",1), new Job("c",1) }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<Job>()));
  Check.Equal(new string[] { "x" }, Solve(new[] { new Job("x",0) }));
 }
}

// ======================================================================
// 323: PriorityQueue stable scheduling / scenario 4
// Return names of up to4 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.
// Hint: PriorityQueue does not promise stable equal-priority ordering.
// Practice: --practice 323; reference: --verify 323
static class E323 {
public sealed record Job(string Name,int Priority);
 public static string[] Practice(Job[] jobs) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 323");
 }
 public static string[] Reference(Job[] jobs) {
  var queue=new PriorityQueue<Job,(int Priority,int Index)>(); for(int i=0;i<jobs.Length;i++)queue.Enqueue(jobs[i],(jobs[i].Priority,i));var result=new List<string>();while(queue.Count>0&&result.Count<4)result.Add(queue.Dequeue().Name);return result.ToArray();
 }
 private static string[] Solve(Job[] jobs) => Check.PracticeMode ? Practice(jobs) : Reference(jobs);
 public static void Verify() {
  Check.Equal(new string[] { "b", "c", "a" }, Solve(new[] { new Job("a",2), new Job("b",1), new Job("c",1) }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<Job>()));
  Check.Equal(new string[] { "x" }, Solve(new[] { new Job("x",0) }));
 }
}

// ======================================================================
// 324: PriorityQueue stable scheduling / scenario 5
// Return names of up to5 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.
// Hint: PriorityQueue does not promise stable equal-priority ordering.
// Practice: --practice 324; reference: --verify 324
static class E324 {
public sealed record Job(string Name,int Priority);
 public static string[] Practice(Job[] jobs) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 324");
 }
 public static string[] Reference(Job[] jobs) {
  var queue=new PriorityQueue<Job,(int Priority,int Index)>(); for(int i=0;i<jobs.Length;i++)queue.Enqueue(jobs[i],(jobs[i].Priority,i));var result=new List<string>();while(queue.Count>0&&result.Count<5)result.Add(queue.Dequeue().Name);return result.ToArray();
 }
 private static string[] Solve(Job[] jobs) => Check.PracticeMode ? Practice(jobs) : Reference(jobs);
 public static void Verify() {
  Check.Equal(new string[] { "b", "c", "a" }, Solve(new[] { new Job("a",2), new Job("b",1), new Job("c",1) }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<Job>()));
  Check.Equal(new string[] { "x" }, Solve(new[] { new Job("x",0) }));
 }
}

// ======================================================================
// 325: PriorityQueue stable scheduling / scenario 6
// Return names of up to6 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.
// Hint: PriorityQueue does not promise stable equal-priority ordering.
// Practice: --practice 325; reference: --verify 325
static class E325 {
public sealed record Job(string Name,int Priority);
 public static string[] Practice(Job[] jobs) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 325");
 }
 public static string[] Reference(Job[] jobs) {
  var queue=new PriorityQueue<Job,(int Priority,int Index)>(); for(int i=0;i<jobs.Length;i++)queue.Enqueue(jobs[i],(jobs[i].Priority,i));var result=new List<string>();while(queue.Count>0&&result.Count<6)result.Add(queue.Dequeue().Name);return result.ToArray();
 }
 private static string[] Solve(Job[] jobs) => Check.PracticeMode ? Practice(jobs) : Reference(jobs);
 public static void Verify() {
  Check.Equal(new string[] { "b", "c", "a" }, Solve(new[] { new Job("a",2), new Job("b",1), new Job("c",1) }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<Job>()));
  Check.Equal(new string[] { "x" }, Solve(new[] { new Job("x",0) }));
 }
}

// ======================================================================
// 326: PriorityQueue stable scheduling / scenario 7
// Return names of up to7 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.
// Hint: PriorityQueue does not promise stable equal-priority ordering.
// Practice: --practice 326; reference: --verify 326
static class E326 {
public sealed record Job(string Name,int Priority);
 public static string[] Practice(Job[] jobs) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 326");
 }
 public static string[] Reference(Job[] jobs) {
  var queue=new PriorityQueue<Job,(int Priority,int Index)>(); for(int i=0;i<jobs.Length;i++)queue.Enqueue(jobs[i],(jobs[i].Priority,i));var result=new List<string>();while(queue.Count>0&&result.Count<7)result.Add(queue.Dequeue().Name);return result.ToArray();
 }
 private static string[] Solve(Job[] jobs) => Check.PracticeMode ? Practice(jobs) : Reference(jobs);
 public static void Verify() {
  Check.Equal(new string[] { "b", "c", "a" }, Solve(new[] { new Job("a",2), new Job("b",1), new Job("c",1) }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<Job>()));
  Check.Equal(new string[] { "x" }, Solve(new[] { new Job("x",0) }));
 }
}

// ======================================================================
// 327: PriorityQueue stable scheduling / scenario 8
// Return names of up to8 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.
// Hint: PriorityQueue does not promise stable equal-priority ordering.
// Practice: --practice 327; reference: --verify 327
static class E327 {
public sealed record Job(string Name,int Priority);
 public static string[] Practice(Job[] jobs) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 327");
 }
 public static string[] Reference(Job[] jobs) {
  var queue=new PriorityQueue<Job,(int Priority,int Index)>(); for(int i=0;i<jobs.Length;i++)queue.Enqueue(jobs[i],(jobs[i].Priority,i));var result=new List<string>();while(queue.Count>0&&result.Count<8)result.Add(queue.Dequeue().Name);return result.ToArray();
 }
 private static string[] Solve(Job[] jobs) => Check.PracticeMode ? Practice(jobs) : Reference(jobs);
 public static void Verify() {
  Check.Equal(new string[] { "b", "c", "a" }, Solve(new[] { new Job("a",2), new Job("b",1), new Job("c",1) }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<Job>()));
  Check.Equal(new string[] { "x" }, Solve(new[] { new Job("x",0) }));
 }
}

// ======================================================================
// 328: PriorityQueue stable scheduling / scenario 9
// Return names of up to9 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.
// Hint: PriorityQueue does not promise stable equal-priority ordering.
// Practice: --practice 328; reference: --verify 328
static class E328 {
public sealed record Job(string Name,int Priority);
 public static string[] Practice(Job[] jobs) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 328");
 }
 public static string[] Reference(Job[] jobs) {
  var queue=new PriorityQueue<Job,(int Priority,int Index)>(); for(int i=0;i<jobs.Length;i++)queue.Enqueue(jobs[i],(jobs[i].Priority,i));var result=new List<string>();while(queue.Count>0&&result.Count<9)result.Add(queue.Dequeue().Name);return result.ToArray();
 }
 private static string[] Solve(Job[] jobs) => Check.PracticeMode ? Practice(jobs) : Reference(jobs);
 public static void Verify() {
  Check.Equal(new string[] { "b", "c", "a" }, Solve(new[] { new Job("a",2), new Job("b",1), new Job("c",1) }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<Job>()));
  Check.Equal(new string[] { "x" }, Solve(new[] { new Job("x",0) }));
 }
}

// ======================================================================
// 329: PriorityQueue stable scheduling / scenario 10
// Return names of up to10 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.
// Hint: PriorityQueue does not promise stable equal-priority ordering.
// Practice: --practice 329; reference: --verify 329
static class E329 {
public sealed record Job(string Name,int Priority);
 public static string[] Practice(Job[] jobs) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 329");
 }
 public static string[] Reference(Job[] jobs) {
  var queue=new PriorityQueue<Job,(int Priority,int Index)>(); for(int i=0;i<jobs.Length;i++)queue.Enqueue(jobs[i],(jobs[i].Priority,i));var result=new List<string>();while(queue.Count>0&&result.Count<10)result.Add(queue.Dequeue().Name);return result.ToArray();
 }
 private static string[] Solve(Job[] jobs) => Check.PracticeMode ? Practice(jobs) : Reference(jobs);
 public static void Verify() {
  Check.Equal(new string[] { "b", "c", "a" }, Solve(new[] { new Job("a",2), new Job("b",1), new Job("c",1) }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<Job>()));
  Check.Equal(new string[] { "x" }, Solve(new[] { new Job("x",0) }));
 }
}

// ======================================================================
// 330: PriorityQueue stable scheduling / scenario 11
// Return names of up to11 jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.
// Hint: PriorityQueue does not promise stable equal-priority ordering.
// Practice: --practice 330; reference: --verify 330
static class E330 {
public sealed record Job(string Name,int Priority);
 public static string[] Practice(Job[] jobs) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 330");
 }
 public static string[] Reference(Job[] jobs) {
  var queue=new PriorityQueue<Job,(int Priority,int Index)>(); for(int i=0;i<jobs.Length;i++)queue.Enqueue(jobs[i],(jobs[i].Priority,i));var result=new List<string>();while(queue.Count>0&&result.Count<11)result.Add(queue.Dequeue().Name);return result.ToArray();
 }
 private static string[] Solve(Job[] jobs) => Check.PracticeMode ? Practice(jobs) : Reference(jobs);
 public static void Verify() {
  Check.Equal(new string[] { "b", "c", "a" }, Solve(new[] { new Job("a",2), new Job("b",1), new Job("c",1) }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<Job>()));
  Check.Equal(new string[] { "x" }, Solve(new[] { new Job("x",0) }));
 }
}

// ======================================================================
// 331: Set algebra with comparer / scenario 1
// Perform intersection with ordinal case-sensitive comparison.  Return ordinal-sorted distinct values.
// Hint: HashSet mutates itself, so construct a new set from caller data.
// Practice: --practice 331; reference: --verify 331
static class E331 {

 public static string[] Practice(string[] left, string[] right) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 331");
 }
 public static string[] Reference(string[] left, string[] right) {
  var set = new HashSet<string>(left, StringComparer.Ordinal); set.IntersectWith(right); return set.Select(s=>s).Order(StringComparer.Ordinal).ToArray();
 }
 private static string[] Solve(string[] left, string[] right) => Check.PracticeMode ? Practice(left, right) : Reference(left, right);
 public static void Verify() {
  Check.Equal(new string[] { "b" }, Solve(new[] { "a", "b", "b" }, new[] { "b", "c" }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),Array.Empty<string>()));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),new[] { "X" }));
 }
}

// ======================================================================
// 332: Set algebra with comparer / scenario 2
// Perform union with ordinal case-insensitive comparison. Lowercase output. Return ordinal-sorted distinct values.
// Hint: HashSet mutates itself, so construct a new set from caller data.
// Practice: --practice 332; reference: --verify 332
static class E332 {

 public static string[] Practice(string[] left, string[] right) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 332");
 }
 public static string[] Reference(string[] left, string[] right) {
  var set = new HashSet<string>(left, StringComparer.OrdinalIgnoreCase); set.UnionWith(right); return set.Select(s=>s.ToLowerInvariant()).Order(StringComparer.Ordinal).ToArray();
 }
 private static string[] Solve(string[] left, string[] right) => Check.PracticeMode ? Practice(left, right) : Reference(left, right);
 public static void Verify() {
  Check.Equal(new string[] { "a", "b", "c" }, Solve(new[] { "a", "b", "b" }, new[] { "b", "c" }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),Array.Empty<string>()));
  Check.Equal(new string[] { "x" }, Solve(Array.Empty<string>(),new[] { "X" }));
 }
}

// ======================================================================
// 333: Set algebra with comparer / scenario 3
// Perform left difference with ordinal case-sensitive comparison.  Return ordinal-sorted distinct values.
// Hint: HashSet mutates itself, so construct a new set from caller data.
// Practice: --practice 333; reference: --verify 333
static class E333 {

 public static string[] Practice(string[] left, string[] right) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 333");
 }
 public static string[] Reference(string[] left, string[] right) {
  var set = new HashSet<string>(left, StringComparer.Ordinal); set.ExceptWith(right); return set.Select(s=>s).Order(StringComparer.Ordinal).ToArray();
 }
 private static string[] Solve(string[] left, string[] right) => Check.PracticeMode ? Practice(left, right) : Reference(left, right);
 public static void Verify() {
  Check.Equal(new string[] { "a" }, Solve(new[] { "a", "b", "b" }, new[] { "b", "c" }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),Array.Empty<string>()));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),new[] { "X" }));
 }
}

// ======================================================================
// 334: Set algebra with comparer / scenario 4
// Perform symmetric difference with ordinal case-insensitive comparison. Lowercase output. Return ordinal-sorted distinct values.
// Hint: HashSet mutates itself, so construct a new set from caller data.
// Practice: --practice 334; reference: --verify 334
static class E334 {

 public static string[] Practice(string[] left, string[] right) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 334");
 }
 public static string[] Reference(string[] left, string[] right) {
  var set = new HashSet<string>(left, StringComparer.OrdinalIgnoreCase); set.SymmetricExceptWith(right); return set.Select(s=>s.ToLowerInvariant()).Order(StringComparer.Ordinal).ToArray();
 }
 private static string[] Solve(string[] left, string[] right) => Check.PracticeMode ? Practice(left, right) : Reference(left, right);
 public static void Verify() {
  Check.Equal(new string[] { "a", "c" }, Solve(new[] { "a", "b", "b" }, new[] { "b", "c" }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),Array.Empty<string>()));
  Check.Equal(new string[] { "x" }, Solve(Array.Empty<string>(),new[] { "X" }));
 }
}

// ======================================================================
// 335: Set algebra with comparer / scenario 5
// Perform intersection with ordinal case-sensitive comparison.  Return ordinal-sorted distinct values.
// Hint: HashSet mutates itself, so construct a new set from caller data.
// Practice: --practice 335; reference: --verify 335
static class E335 {

 public static string[] Practice(string[] left, string[] right) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 335");
 }
 public static string[] Reference(string[] left, string[] right) {
  var set = new HashSet<string>(left, StringComparer.Ordinal); set.IntersectWith(right); return set.Select(s=>s).Order(StringComparer.Ordinal).ToArray();
 }
 private static string[] Solve(string[] left, string[] right) => Check.PracticeMode ? Practice(left, right) : Reference(left, right);
 public static void Verify() {
  Check.Equal(new string[] { "b" }, Solve(new[] { "a", "b", "b" }, new[] { "b", "c" }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),Array.Empty<string>()));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),new[] { "X" }));
 }
}

// ======================================================================
// 336: Set algebra with comparer / scenario 6
// Perform union with ordinal case-insensitive comparison. Lowercase output. Return ordinal-sorted distinct values.
// Hint: HashSet mutates itself, so construct a new set from caller data.
// Practice: --practice 336; reference: --verify 336
static class E336 {

 public static string[] Practice(string[] left, string[] right) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 336");
 }
 public static string[] Reference(string[] left, string[] right) {
  var set = new HashSet<string>(left, StringComparer.OrdinalIgnoreCase); set.UnionWith(right); return set.Select(s=>s.ToLowerInvariant()).Order(StringComparer.Ordinal).ToArray();
 }
 private static string[] Solve(string[] left, string[] right) => Check.PracticeMode ? Practice(left, right) : Reference(left, right);
 public static void Verify() {
  Check.Equal(new string[] { "a", "b", "c" }, Solve(new[] { "a", "b", "b" }, new[] { "b", "c" }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),Array.Empty<string>()));
  Check.Equal(new string[] { "x" }, Solve(Array.Empty<string>(),new[] { "X" }));
 }
}

// ======================================================================
// 337: Set algebra with comparer / scenario 7
// Perform left difference with ordinal case-sensitive comparison.  Return ordinal-sorted distinct values.
// Hint: HashSet mutates itself, so construct a new set from caller data.
// Practice: --practice 337; reference: --verify 337
static class E337 {

 public static string[] Practice(string[] left, string[] right) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 337");
 }
 public static string[] Reference(string[] left, string[] right) {
  var set = new HashSet<string>(left, StringComparer.Ordinal); set.ExceptWith(right); return set.Select(s=>s).Order(StringComparer.Ordinal).ToArray();
 }
 private static string[] Solve(string[] left, string[] right) => Check.PracticeMode ? Practice(left, right) : Reference(left, right);
 public static void Verify() {
  Check.Equal(new string[] { "a" }, Solve(new[] { "a", "b", "b" }, new[] { "b", "c" }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),Array.Empty<string>()));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),new[] { "X" }));
 }
}

// ======================================================================
// 338: Set algebra with comparer / scenario 8
// Perform symmetric difference with ordinal case-insensitive comparison. Lowercase output. Return ordinal-sorted distinct values.
// Hint: HashSet mutates itself, so construct a new set from caller data.
// Practice: --practice 338; reference: --verify 338
static class E338 {

 public static string[] Practice(string[] left, string[] right) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 338");
 }
 public static string[] Reference(string[] left, string[] right) {
  var set = new HashSet<string>(left, StringComparer.OrdinalIgnoreCase); set.SymmetricExceptWith(right); return set.Select(s=>s.ToLowerInvariant()).Order(StringComparer.Ordinal).ToArray();
 }
 private static string[] Solve(string[] left, string[] right) => Check.PracticeMode ? Practice(left, right) : Reference(left, right);
 public static void Verify() {
  Check.Equal(new string[] { "a", "c" }, Solve(new[] { "a", "b", "b" }, new[] { "b", "c" }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),Array.Empty<string>()));
  Check.Equal(new string[] { "x" }, Solve(Array.Empty<string>(),new[] { "X" }));
 }
}

// ======================================================================
// 339: Set algebra with comparer / scenario 9
// Perform intersection with ordinal case-sensitive comparison.  Return ordinal-sorted distinct values.
// Hint: HashSet mutates itself, so construct a new set from caller data.
// Practice: --practice 339; reference: --verify 339
static class E339 {

 public static string[] Practice(string[] left, string[] right) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 339");
 }
 public static string[] Reference(string[] left, string[] right) {
  var set = new HashSet<string>(left, StringComparer.Ordinal); set.IntersectWith(right); return set.Select(s=>s).Order(StringComparer.Ordinal).ToArray();
 }
 private static string[] Solve(string[] left, string[] right) => Check.PracticeMode ? Practice(left, right) : Reference(left, right);
 public static void Verify() {
  Check.Equal(new string[] { "b" }, Solve(new[] { "a", "b", "b" }, new[] { "b", "c" }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),Array.Empty<string>()));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),new[] { "X" }));
 }
}

// ======================================================================
// 340: Set algebra with comparer / scenario 10
// Perform union with ordinal case-insensitive comparison. Lowercase output. Return ordinal-sorted distinct values.
// Hint: HashSet mutates itself, so construct a new set from caller data.
// Practice: --practice 340; reference: --verify 340
static class E340 {

 public static string[] Practice(string[] left, string[] right) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 340");
 }
 public static string[] Reference(string[] left, string[] right) {
  var set = new HashSet<string>(left, StringComparer.OrdinalIgnoreCase); set.UnionWith(right); return set.Select(s=>s.ToLowerInvariant()).Order(StringComparer.Ordinal).ToArray();
 }
 private static string[] Solve(string[] left, string[] right) => Check.PracticeMode ? Practice(left, right) : Reference(left, right);
 public static void Verify() {
  Check.Equal(new string[] { "a", "b", "c" }, Solve(new[] { "a", "b", "b" }, new[] { "b", "c" }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),Array.Empty<string>()));
  Check.Equal(new string[] { "x" }, Solve(Array.Empty<string>(),new[] { "X" }));
 }
}

// ======================================================================
// 341: Set algebra with comparer / scenario 11
// Perform left difference with ordinal case-sensitive comparison.  Return ordinal-sorted distinct values.
// Hint: HashSet mutates itself, so construct a new set from caller data.
// Practice: --practice 341; reference: --verify 341
static class E341 {

 public static string[] Practice(string[] left, string[] right) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 341");
 }
 public static string[] Reference(string[] left, string[] right) {
  var set = new HashSet<string>(left, StringComparer.Ordinal); set.ExceptWith(right); return set.Select(s=>s).Order(StringComparer.Ordinal).ToArray();
 }
 private static string[] Solve(string[] left, string[] right) => Check.PracticeMode ? Practice(left, right) : Reference(left, right);
 public static void Verify() {
  Check.Equal(new string[] { "a" }, Solve(new[] { "a", "b", "b" }, new[] { "b", "c" }));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),Array.Empty<string>()));
  Check.Equal(new string[] {  }, Solve(Array.Empty<string>(),new[] { "X" }));
 }
}

// ======================================================================
// 342: GroupBy record summaries / scenario 1
// Group Row(Team,Points), retain groups of at least1 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.
// Hint: A group key and an aggregate are separate projection fields.
// Practice: --practice 342; reference: --verify 342
static class E342 {
public sealed record Row(string Team,int Points); public sealed record Summary(string Team,int Count,long Total);
 public static Summary[] Practice(Row[] rows) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 342");
 }
 public static Summary[] Reference(Row[] rows) {
  return rows.GroupBy(r=>r.Team,StringComparer.Ordinal).Select(g=>new Summary(g.Key,g.Count(),g.Sum(r=>(long)r.Points))).Where(s=>s.Count>=1).OrderBy(s=>s.Team,StringComparer.Ordinal).ToArray();
 }
 private static Summary[] Solve(Row[] rows) => Check.PracticeMode ? Practice(rows) : Reference(rows);
 public static void Verify() {
  Check.Equal(Array.Empty<Summary>(), Solve(Array.Empty<Row>()));
  Check.Equal(new[] { new Summary("a", 1, 2L) }, Solve(Enumerable.Repeat(new Row("a",2), 1).ToArray()));
  Check.Equal(Array.Empty<Summary>(), Solve(Enumerable.Repeat(new Row("x",1), 0).ToArray()));
 }
}

// ======================================================================
// 343: GroupBy record summaries / scenario 2
// Group Row(Team,Points), retain groups of at least2 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.
// Hint: A group key and an aggregate are separate projection fields.
// Practice: --practice 343; reference: --verify 343
static class E343 {
public sealed record Row(string Team,int Points); public sealed record Summary(string Team,int Count,long Total);
 public static Summary[] Practice(Row[] rows) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 343");
 }
 public static Summary[] Reference(Row[] rows) {
  return rows.GroupBy(r=>r.Team,StringComparer.Ordinal).Select(g=>new Summary(g.Key,g.Count(),g.Sum(r=>(long)r.Points))).Where(s=>s.Count>=2).OrderBy(s=>s.Team,StringComparer.Ordinal).ToArray();
 }
 private static Summary[] Solve(Row[] rows) => Check.PracticeMode ? Practice(rows) : Reference(rows);
 public static void Verify() {
  Check.Equal(Array.Empty<Summary>(), Solve(Array.Empty<Row>()));
  Check.Equal(new[] { new Summary("a", 2, 4L) }, Solve(Enumerable.Repeat(new Row("a",2), 2).ToArray()));
  Check.Equal(Array.Empty<Summary>(), Solve(Enumerable.Repeat(new Row("x",1), 1).ToArray()));
 }
}

// ======================================================================
// 344: GroupBy record summaries / scenario 3
// Group Row(Team,Points), retain groups of at least3 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.
// Hint: A group key and an aggregate are separate projection fields.
// Practice: --practice 344; reference: --verify 344
static class E344 {
public sealed record Row(string Team,int Points); public sealed record Summary(string Team,int Count,long Total);
 public static Summary[] Practice(Row[] rows) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 344");
 }
 public static Summary[] Reference(Row[] rows) {
  return rows.GroupBy(r=>r.Team,StringComparer.Ordinal).Select(g=>new Summary(g.Key,g.Count(),g.Sum(r=>(long)r.Points))).Where(s=>s.Count>=3).OrderBy(s=>s.Team,StringComparer.Ordinal).ToArray();
 }
 private static Summary[] Solve(Row[] rows) => Check.PracticeMode ? Practice(rows) : Reference(rows);
 public static void Verify() {
  Check.Equal(Array.Empty<Summary>(), Solve(Array.Empty<Row>()));
  Check.Equal(new[] { new Summary("a", 3, 6L) }, Solve(Enumerable.Repeat(new Row("a",2), 3).ToArray()));
  Check.Equal(Array.Empty<Summary>(), Solve(Enumerable.Repeat(new Row("x",1), 2).ToArray()));
 }
}

// ======================================================================
// 345: GroupBy record summaries / scenario 4
// Group Row(Team,Points), retain groups of at least4 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.
// Hint: A group key and an aggregate are separate projection fields.
// Practice: --practice 345; reference: --verify 345
static class E345 {
public sealed record Row(string Team,int Points); public sealed record Summary(string Team,int Count,long Total);
 public static Summary[] Practice(Row[] rows) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 345");
 }
 public static Summary[] Reference(Row[] rows) {
  return rows.GroupBy(r=>r.Team,StringComparer.Ordinal).Select(g=>new Summary(g.Key,g.Count(),g.Sum(r=>(long)r.Points))).Where(s=>s.Count>=4).OrderBy(s=>s.Team,StringComparer.Ordinal).ToArray();
 }
 private static Summary[] Solve(Row[] rows) => Check.PracticeMode ? Practice(rows) : Reference(rows);
 public static void Verify() {
  Check.Equal(Array.Empty<Summary>(), Solve(Array.Empty<Row>()));
  Check.Equal(new[] { new Summary("a", 4, 8L) }, Solve(Enumerable.Repeat(new Row("a",2), 4).ToArray()));
  Check.Equal(Array.Empty<Summary>(), Solve(Enumerable.Repeat(new Row("x",1), 3).ToArray()));
 }
}

// ======================================================================
// 346: GroupBy record summaries / scenario 5
// Group Row(Team,Points), retain groups of at least5 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.
// Hint: A group key and an aggregate are separate projection fields.
// Practice: --practice 346; reference: --verify 346
static class E346 {
public sealed record Row(string Team,int Points); public sealed record Summary(string Team,int Count,long Total);
 public static Summary[] Practice(Row[] rows) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 346");
 }
 public static Summary[] Reference(Row[] rows) {
  return rows.GroupBy(r=>r.Team,StringComparer.Ordinal).Select(g=>new Summary(g.Key,g.Count(),g.Sum(r=>(long)r.Points))).Where(s=>s.Count>=5).OrderBy(s=>s.Team,StringComparer.Ordinal).ToArray();
 }
 private static Summary[] Solve(Row[] rows) => Check.PracticeMode ? Practice(rows) : Reference(rows);
 public static void Verify() {
  Check.Equal(Array.Empty<Summary>(), Solve(Array.Empty<Row>()));
  Check.Equal(new[] { new Summary("a", 5, 10L) }, Solve(Enumerable.Repeat(new Row("a",2), 5).ToArray()));
  Check.Equal(Array.Empty<Summary>(), Solve(Enumerable.Repeat(new Row("x",1), 4).ToArray()));
 }
}

// ======================================================================
// 347: GroupBy record summaries / scenario 6
// Group Row(Team,Points), retain groups of at least6 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.
// Hint: A group key and an aggregate are separate projection fields.
// Practice: --practice 347; reference: --verify 347
static class E347 {
public sealed record Row(string Team,int Points); public sealed record Summary(string Team,int Count,long Total);
 public static Summary[] Practice(Row[] rows) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 347");
 }
 public static Summary[] Reference(Row[] rows) {
  return rows.GroupBy(r=>r.Team,StringComparer.Ordinal).Select(g=>new Summary(g.Key,g.Count(),g.Sum(r=>(long)r.Points))).Where(s=>s.Count>=6).OrderBy(s=>s.Team,StringComparer.Ordinal).ToArray();
 }
 private static Summary[] Solve(Row[] rows) => Check.PracticeMode ? Practice(rows) : Reference(rows);
 public static void Verify() {
  Check.Equal(Array.Empty<Summary>(), Solve(Array.Empty<Row>()));
  Check.Equal(new[] { new Summary("a", 6, 12L) }, Solve(Enumerable.Repeat(new Row("a",2), 6).ToArray()));
  Check.Equal(Array.Empty<Summary>(), Solve(Enumerable.Repeat(new Row("x",1), 5).ToArray()));
 }
}

// ======================================================================
// 348: GroupBy record summaries / scenario 7
// Group Row(Team,Points), retain groups of at least7 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.
// Hint: A group key and an aggregate are separate projection fields.
// Practice: --practice 348; reference: --verify 348
static class E348 {
public sealed record Row(string Team,int Points); public sealed record Summary(string Team,int Count,long Total);
 public static Summary[] Practice(Row[] rows) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 348");
 }
 public static Summary[] Reference(Row[] rows) {
  return rows.GroupBy(r=>r.Team,StringComparer.Ordinal).Select(g=>new Summary(g.Key,g.Count(),g.Sum(r=>(long)r.Points))).Where(s=>s.Count>=7).OrderBy(s=>s.Team,StringComparer.Ordinal).ToArray();
 }
 private static Summary[] Solve(Row[] rows) => Check.PracticeMode ? Practice(rows) : Reference(rows);
 public static void Verify() {
  Check.Equal(Array.Empty<Summary>(), Solve(Array.Empty<Row>()));
  Check.Equal(new[] { new Summary("a", 7, 14L) }, Solve(Enumerable.Repeat(new Row("a",2), 7).ToArray()));
  Check.Equal(Array.Empty<Summary>(), Solve(Enumerable.Repeat(new Row("x",1), 6).ToArray()));
 }
}

// ======================================================================
// 349: GroupBy record summaries / scenario 8
// Group Row(Team,Points), retain groups of at least8 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.
// Hint: A group key and an aggregate are separate projection fields.
// Practice: --practice 349; reference: --verify 349
static class E349 {
public sealed record Row(string Team,int Points); public sealed record Summary(string Team,int Count,long Total);
 public static Summary[] Practice(Row[] rows) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 349");
 }
 public static Summary[] Reference(Row[] rows) {
  return rows.GroupBy(r=>r.Team,StringComparer.Ordinal).Select(g=>new Summary(g.Key,g.Count(),g.Sum(r=>(long)r.Points))).Where(s=>s.Count>=8).OrderBy(s=>s.Team,StringComparer.Ordinal).ToArray();
 }
 private static Summary[] Solve(Row[] rows) => Check.PracticeMode ? Practice(rows) : Reference(rows);
 public static void Verify() {
  Check.Equal(Array.Empty<Summary>(), Solve(Array.Empty<Row>()));
  Check.Equal(new[] { new Summary("a", 8, 16L) }, Solve(Enumerable.Repeat(new Row("a",2), 8).ToArray()));
  Check.Equal(Array.Empty<Summary>(), Solve(Enumerable.Repeat(new Row("x",1), 7).ToArray()));
 }
}

// ======================================================================
// 350: GroupBy record summaries / scenario 9
// Group Row(Team,Points), retain groups of at least9 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.
// Hint: A group key and an aggregate are separate projection fields.
// Practice: --practice 350; reference: --verify 350
static class E350 {
public sealed record Row(string Team,int Points); public sealed record Summary(string Team,int Count,long Total);
 public static Summary[] Practice(Row[] rows) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 350");
 }
 public static Summary[] Reference(Row[] rows) {
  return rows.GroupBy(r=>r.Team,StringComparer.Ordinal).Select(g=>new Summary(g.Key,g.Count(),g.Sum(r=>(long)r.Points))).Where(s=>s.Count>=9).OrderBy(s=>s.Team,StringComparer.Ordinal).ToArray();
 }
 private static Summary[] Solve(Row[] rows) => Check.PracticeMode ? Practice(rows) : Reference(rows);
 public static void Verify() {
  Check.Equal(Array.Empty<Summary>(), Solve(Array.Empty<Row>()));
  Check.Equal(new[] { new Summary("a", 9, 18L) }, Solve(Enumerable.Repeat(new Row("a",2), 9).ToArray()));
  Check.Equal(Array.Empty<Summary>(), Solve(Enumerable.Repeat(new Row("x",1), 8).ToArray()));
 }
}

// ======================================================================
// 351: GroupBy record summaries / scenario 10
// Group Row(Team,Points), retain groups of at least10 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.
// Hint: A group key and an aggregate are separate projection fields.
// Practice: --practice 351; reference: --verify 351
static class E351 {
public sealed record Row(string Team,int Points); public sealed record Summary(string Team,int Count,long Total);
 public static Summary[] Practice(Row[] rows) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 351");
 }
 public static Summary[] Reference(Row[] rows) {
  return rows.GroupBy(r=>r.Team,StringComparer.Ordinal).Select(g=>new Summary(g.Key,g.Count(),g.Sum(r=>(long)r.Points))).Where(s=>s.Count>=10).OrderBy(s=>s.Team,StringComparer.Ordinal).ToArray();
 }
 private static Summary[] Solve(Row[] rows) => Check.PracticeMode ? Practice(rows) : Reference(rows);
 public static void Verify() {
  Check.Equal(Array.Empty<Summary>(), Solve(Array.Empty<Row>()));
  Check.Equal(new[] { new Summary("a", 10, 20L) }, Solve(Enumerable.Repeat(new Row("a",2), 10).ToArray()));
  Check.Equal(Array.Empty<Summary>(), Solve(Enumerable.Repeat(new Row("x",1), 9).ToArray()));
 }
}

// ======================================================================
// 352: GroupBy record summaries / scenario 11
// Group Row(Team,Points), retain groups of at least11 rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.
// Hint: A group key and an aggregate are separate projection fields.
// Practice: --practice 352; reference: --verify 352
static class E352 {
public sealed record Row(string Team,int Points); public sealed record Summary(string Team,int Count,long Total);
 public static Summary[] Practice(Row[] rows) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 352");
 }
 public static Summary[] Reference(Row[] rows) {
  return rows.GroupBy(r=>r.Team,StringComparer.Ordinal).Select(g=>new Summary(g.Key,g.Count(),g.Sum(r=>(long)r.Points))).Where(s=>s.Count>=11).OrderBy(s=>s.Team,StringComparer.Ordinal).ToArray();
 }
 private static Summary[] Solve(Row[] rows) => Check.PracticeMode ? Practice(rows) : Reference(rows);
 public static void Verify() {
  Check.Equal(Array.Empty<Summary>(), Solve(Array.Empty<Row>()));
  Check.Equal(new[] { new Summary("a", 11, 22L) }, Solve(Enumerable.Repeat(new Row("a",2), 11).ToArray()));
  Check.Equal(Array.Empty<Summary>(), Solve(Enumerable.Repeat(new Row("x",1), 10).ToArray()));
 }
}

// ======================================================================
// 353: Dictionary joins / scenario 1
// Inner join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched are omitted. Scenario1.
// Hint: TryGetValue distinguishes a missing team without exceptions.
// Practice: --practice 353; reference: --verify 353
static class E353 {
public sealed record Person(string Name,int TeamId); public sealed record Team(int Id,string Name); public sealed record Joined(string Name,string? Team);
 public static Joined[] Practice(Person[] people, Team[] teams) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 353");
 }
 public static Joined[] Reference(Person[] people, Team[] teams) {
  var lookup=teams.ToDictionary(t=>t.Id);var result=new List<Joined>();foreach(var person in people){if(lookup.TryGetValue(person.TeamId,out var team))result.Add(new Joined(person.Name,team.Name));}return result.ToArray();
 }
 private static Joined[] Solve(Person[] people, Team[] teams) => Check.PracticeMode ? Practice(people, teams) : Reference(people, teams);
 public static void Verify() {
  Check.Equal(new[] { new Joined("Ada","Red") }, Solve(new[] { new Person("Ada",1),new Person("Bo",9) },new[] { new Team(1,"Red") }));
  Check.Equal(Array.Empty<Joined>(), Solve(Array.Empty<Person>(),Array.Empty<Team>()));
  Check.Equal(Array.Empty<Joined>(), Solve(new[] { new Person("X",0) },Array.Empty<Team>()));
 }
}

// ======================================================================
// 354: Dictionary joins / scenario 2
// Left join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched get null team. Scenario2.
// Hint: TryGetValue distinguishes a missing team without exceptions.
// Practice: --practice 354; reference: --verify 354
static class E354 {
public sealed record Person(string Name,int TeamId); public sealed record Team(int Id,string Name); public sealed record Joined(string Name,string? Team);
 public static Joined[] Practice(Person[] people, Team[] teams) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 354");
 }
 public static Joined[] Reference(Person[] people, Team[] teams) {
  var lookup=teams.ToDictionary(t=>t.Id);var result=new List<Joined>();foreach(var person in people){if(lookup.TryGetValue(person.TeamId,out var team))result.Add(new Joined(person.Name,team.Name));else result.Add(new Joined(person.Name,null));}return result.ToArray();
 }
 private static Joined[] Solve(Person[] people, Team[] teams) => Check.PracticeMode ? Practice(people, teams) : Reference(people, teams);
 public static void Verify() {
  Check.Equal(new[] { new Joined("Ada","Red"), new Joined("Bo",null) }, Solve(new[] { new Person("Ada",1),new Person("Bo",9) },new[] { new Team(1,"Red") }));
  Check.Equal(Array.Empty<Joined>(), Solve(Array.Empty<Person>(),Array.Empty<Team>()));
  Check.Equal(new[] { new Joined("X",null) }, Solve(new[] { new Person("X",0) },Array.Empty<Team>()));
 }
}

// ======================================================================
// 355: Dictionary joins / scenario 3
// Inner join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched are omitted. Scenario3.
// Hint: TryGetValue distinguishes a missing team without exceptions.
// Practice: --practice 355; reference: --verify 355
static class E355 {
public sealed record Person(string Name,int TeamId); public sealed record Team(int Id,string Name); public sealed record Joined(string Name,string? Team);
 public static Joined[] Practice(Person[] people, Team[] teams) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 355");
 }
 public static Joined[] Reference(Person[] people, Team[] teams) {
  var lookup=teams.ToDictionary(t=>t.Id);var result=new List<Joined>();foreach(var person in people){if(lookup.TryGetValue(person.TeamId,out var team))result.Add(new Joined(person.Name,team.Name));}return result.ToArray();
 }
 private static Joined[] Solve(Person[] people, Team[] teams) => Check.PracticeMode ? Practice(people, teams) : Reference(people, teams);
 public static void Verify() {
  Check.Equal(new[] { new Joined("Ada","Red") }, Solve(new[] { new Person("Ada",1),new Person("Bo",9) },new[] { new Team(1,"Red") }));
  Check.Equal(Array.Empty<Joined>(), Solve(Array.Empty<Person>(),Array.Empty<Team>()));
  Check.Equal(Array.Empty<Joined>(), Solve(new[] { new Person("X",0) },Array.Empty<Team>()));
 }
}

// ======================================================================
// 356: Dictionary joins / scenario 4
// Left join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched get null team. Scenario4.
// Hint: TryGetValue distinguishes a missing team without exceptions.
// Practice: --practice 356; reference: --verify 356
static class E356 {
public sealed record Person(string Name,int TeamId); public sealed record Team(int Id,string Name); public sealed record Joined(string Name,string? Team);
 public static Joined[] Practice(Person[] people, Team[] teams) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 356");
 }
 public static Joined[] Reference(Person[] people, Team[] teams) {
  var lookup=teams.ToDictionary(t=>t.Id);var result=new List<Joined>();foreach(var person in people){if(lookup.TryGetValue(person.TeamId,out var team))result.Add(new Joined(person.Name,team.Name));else result.Add(new Joined(person.Name,null));}return result.ToArray();
 }
 private static Joined[] Solve(Person[] people, Team[] teams) => Check.PracticeMode ? Practice(people, teams) : Reference(people, teams);
 public static void Verify() {
  Check.Equal(new[] { new Joined("Ada","Red"), new Joined("Bo",null) }, Solve(new[] { new Person("Ada",1),new Person("Bo",9) },new[] { new Team(1,"Red") }));
  Check.Equal(Array.Empty<Joined>(), Solve(Array.Empty<Person>(),Array.Empty<Team>()));
  Check.Equal(new[] { new Joined("X",null) }, Solve(new[] { new Person("X",0) },Array.Empty<Team>()));
 }
}

// ======================================================================
// 357: Dictionary joins / scenario 5
// Inner join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched are omitted. Scenario5.
// Hint: TryGetValue distinguishes a missing team without exceptions.
// Practice: --practice 357; reference: --verify 357
static class E357 {
public sealed record Person(string Name,int TeamId); public sealed record Team(int Id,string Name); public sealed record Joined(string Name,string? Team);
 public static Joined[] Practice(Person[] people, Team[] teams) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 357");
 }
 public static Joined[] Reference(Person[] people, Team[] teams) {
  var lookup=teams.ToDictionary(t=>t.Id);var result=new List<Joined>();foreach(var person in people){if(lookup.TryGetValue(person.TeamId,out var team))result.Add(new Joined(person.Name,team.Name));}return result.ToArray();
 }
 private static Joined[] Solve(Person[] people, Team[] teams) => Check.PracticeMode ? Practice(people, teams) : Reference(people, teams);
 public static void Verify() {
  Check.Equal(new[] { new Joined("Ada","Red") }, Solve(new[] { new Person("Ada",1),new Person("Bo",9) },new[] { new Team(1,"Red") }));
  Check.Equal(Array.Empty<Joined>(), Solve(Array.Empty<Person>(),Array.Empty<Team>()));
  Check.Equal(Array.Empty<Joined>(), Solve(new[] { new Person("X",0) },Array.Empty<Team>()));
 }
}

// ======================================================================
// 358: Dictionary joins / scenario 6
// Left join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched get null team. Scenario6.
// Hint: TryGetValue distinguishes a missing team without exceptions.
// Practice: --practice 358; reference: --verify 358
static class E358 {
public sealed record Person(string Name,int TeamId); public sealed record Team(int Id,string Name); public sealed record Joined(string Name,string? Team);
 public static Joined[] Practice(Person[] people, Team[] teams) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 358");
 }
 public static Joined[] Reference(Person[] people, Team[] teams) {
  var lookup=teams.ToDictionary(t=>t.Id);var result=new List<Joined>();foreach(var person in people){if(lookup.TryGetValue(person.TeamId,out var team))result.Add(new Joined(person.Name,team.Name));else result.Add(new Joined(person.Name,null));}return result.ToArray();
 }
 private static Joined[] Solve(Person[] people, Team[] teams) => Check.PracticeMode ? Practice(people, teams) : Reference(people, teams);
 public static void Verify() {
  Check.Equal(new[] { new Joined("Ada","Red"), new Joined("Bo",null) }, Solve(new[] { new Person("Ada",1),new Person("Bo",9) },new[] { new Team(1,"Red") }));
  Check.Equal(Array.Empty<Joined>(), Solve(Array.Empty<Person>(),Array.Empty<Team>()));
  Check.Equal(new[] { new Joined("X",null) }, Solve(new[] { new Person("X",0) },Array.Empty<Team>()));
 }
}

// ======================================================================
// 359: Dictionary joins / scenario 7
// Inner join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched are omitted. Scenario7.
// Hint: TryGetValue distinguishes a missing team without exceptions.
// Practice: --practice 359; reference: --verify 359
static class E359 {
public sealed record Person(string Name,int TeamId); public sealed record Team(int Id,string Name); public sealed record Joined(string Name,string? Team);
 public static Joined[] Practice(Person[] people, Team[] teams) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 359");
 }
 public static Joined[] Reference(Person[] people, Team[] teams) {
  var lookup=teams.ToDictionary(t=>t.Id);var result=new List<Joined>();foreach(var person in people){if(lookup.TryGetValue(person.TeamId,out var team))result.Add(new Joined(person.Name,team.Name));}return result.ToArray();
 }
 private static Joined[] Solve(Person[] people, Team[] teams) => Check.PracticeMode ? Practice(people, teams) : Reference(people, teams);
 public static void Verify() {
  Check.Equal(new[] { new Joined("Ada","Red") }, Solve(new[] { new Person("Ada",1),new Person("Bo",9) },new[] { new Team(1,"Red") }));
  Check.Equal(Array.Empty<Joined>(), Solve(Array.Empty<Person>(),Array.Empty<Team>()));
  Check.Equal(Array.Empty<Joined>(), Solve(new[] { new Person("X",0) },Array.Empty<Team>()));
 }
}

// ======================================================================
// 360: Dictionary joins / scenario 8
// Left join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched get null team. Scenario8.
// Hint: TryGetValue distinguishes a missing team without exceptions.
// Practice: --practice 360; reference: --verify 360
static class E360 {
public sealed record Person(string Name,int TeamId); public sealed record Team(int Id,string Name); public sealed record Joined(string Name,string? Team);
 public static Joined[] Practice(Person[] people, Team[] teams) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 360");
 }
 public static Joined[] Reference(Person[] people, Team[] teams) {
  var lookup=teams.ToDictionary(t=>t.Id);var result=new List<Joined>();foreach(var person in people){if(lookup.TryGetValue(person.TeamId,out var team))result.Add(new Joined(person.Name,team.Name));else result.Add(new Joined(person.Name,null));}return result.ToArray();
 }
 private static Joined[] Solve(Person[] people, Team[] teams) => Check.PracticeMode ? Practice(people, teams) : Reference(people, teams);
 public static void Verify() {
  Check.Equal(new[] { new Joined("Ada","Red"), new Joined("Bo",null) }, Solve(new[] { new Person("Ada",1),new Person("Bo",9) },new[] { new Team(1,"Red") }));
  Check.Equal(Array.Empty<Joined>(), Solve(Array.Empty<Person>(),Array.Empty<Team>()));
  Check.Equal(new[] { new Joined("X",null) }, Solve(new[] { new Person("X",0) },Array.Empty<Team>()));
 }
}

// ======================================================================
// 361: Dictionary joins / scenario 9
// Inner join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched are omitted. Scenario9.
// Hint: TryGetValue distinguishes a missing team without exceptions.
// Practice: --practice 361; reference: --verify 361
static class E361 {
public sealed record Person(string Name,int TeamId); public sealed record Team(int Id,string Name); public sealed record Joined(string Name,string? Team);
 public static Joined[] Practice(Person[] people, Team[] teams) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 361");
 }
 public static Joined[] Reference(Person[] people, Team[] teams) {
  var lookup=teams.ToDictionary(t=>t.Id);var result=new List<Joined>();foreach(var person in people){if(lookup.TryGetValue(person.TeamId,out var team))result.Add(new Joined(person.Name,team.Name));}return result.ToArray();
 }
 private static Joined[] Solve(Person[] people, Team[] teams) => Check.PracticeMode ? Practice(people, teams) : Reference(people, teams);
 public static void Verify() {
  Check.Equal(new[] { new Joined("Ada","Red") }, Solve(new[] { new Person("Ada",1),new Person("Bo",9) },new[] { new Team(1,"Red") }));
  Check.Equal(Array.Empty<Joined>(), Solve(Array.Empty<Person>(),Array.Empty<Team>()));
  Check.Equal(Array.Empty<Joined>(), Solve(new[] { new Person("X",0) },Array.Empty<Team>()));
 }
}

// ======================================================================
// 362: Dictionary joins / scenario 10
// Left join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched get null team. Scenario10.
// Hint: TryGetValue distinguishes a missing team without exceptions.
// Practice: --practice 362; reference: --verify 362
static class E362 {
public sealed record Person(string Name,int TeamId); public sealed record Team(int Id,string Name); public sealed record Joined(string Name,string? Team);
 public static Joined[] Practice(Person[] people, Team[] teams) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 362");
 }
 public static Joined[] Reference(Person[] people, Team[] teams) {
  var lookup=teams.ToDictionary(t=>t.Id);var result=new List<Joined>();foreach(var person in people){if(lookup.TryGetValue(person.TeamId,out var team))result.Add(new Joined(person.Name,team.Name));else result.Add(new Joined(person.Name,null));}return result.ToArray();
 }
 private static Joined[] Solve(Person[] people, Team[] teams) => Check.PracticeMode ? Practice(people, teams) : Reference(people, teams);
 public static void Verify() {
  Check.Equal(new[] { new Joined("Ada","Red"), new Joined("Bo",null) }, Solve(new[] { new Person("Ada",1),new Person("Bo",9) },new[] { new Team(1,"Red") }));
  Check.Equal(Array.Empty<Joined>(), Solve(Array.Empty<Person>(),Array.Empty<Team>()));
  Check.Equal(new[] { new Joined("X",null) }, Solve(new[] { new Person("X",0) },Array.Empty<Team>()));
 }
}

// ======================================================================
// 363: Dictionary joins / scenario 11
// Inner join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched are omitted. Scenario11.
// Hint: TryGetValue distinguishes a missing team without exceptions.
// Practice: --practice 363; reference: --verify 363
static class E363 {
public sealed record Person(string Name,int TeamId); public sealed record Team(int Id,string Name); public sealed record Joined(string Name,string? Team);
 public static Joined[] Practice(Person[] people, Team[] teams) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 363");
 }
 public static Joined[] Reference(Person[] people, Team[] teams) {
  var lookup=teams.ToDictionary(t=>t.Id);var result=new List<Joined>();foreach(var person in people){if(lookup.TryGetValue(person.TeamId,out var team))result.Add(new Joined(person.Name,team.Name));}return result.ToArray();
 }
 private static Joined[] Solve(Person[] people, Team[] teams) => Check.PracticeMode ? Practice(people, teams) : Reference(people, teams);
 public static void Verify() {
  Check.Equal(new[] { new Joined("Ada","Red") }, Solve(new[] { new Person("Ada",1),new Person("Bo",9) },new[] { new Team(1,"Red") }));
  Check.Equal(Array.Empty<Joined>(), Solve(Array.Empty<Person>(),Array.Empty<Team>()));
  Check.Equal(Array.Empty<Joined>(), Solve(new[] { new Person("X",0) },Array.Empty<Team>()));
 }
}

// ======================================================================
// 364: Tuple interval merging / scenario 1
// Merge overlapping valid intervals, including merely touching endpoints. Return sorted named tuples without mutating input. Scenario1.
// Hint: ValueTuple is a value type; replace the last tuple rather than mutating a copy.
// Practice: --practice 364; reference: --verify 364
static class E364 {

 public static (int Start,int End)[] Practice((int Start,int End)[] intervals) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 364");
 }
 public static (int Start,int End)[] Reference((int Start,int End)[] intervals) {
  var sorted=intervals.OrderBy(p=>p.Start).ThenBy(p=>p.End).ToArray();var result=new List<(int Start,int End)>();foreach(var item in sorted){if(result.Count>0&&item.Start <= result[^1].End){var last=result[^1];result[^1]=(last.Start,Math.Max(last.End,item.End));}else result.Add(item);}return result.ToArray();
 }
 private static (int Start,int End)[] Solve((int Start,int End)[] intervals) => Check.PracticeMode ? Practice(intervals) : Reference(intervals);
 public static void Verify() {
  Check.Equal(new[] { (1,5) }, Solve(new[] { (3,5),(1,3) }));
  Check.Equal(new[] { (1,7) }, Solve(new[] { (1,5),(2,7) }));
  Check.Equal(Array.Empty<(int,int)>(), Solve(Array.Empty<(int,int)>()));
 }
}

// ======================================================================
// 365: Tuple interval merging / scenario 2
// Merge overlapping valid intervals, excluding merely touching endpoints. Return sorted named tuples without mutating input. Scenario2.
// Hint: ValueTuple is a value type; replace the last tuple rather than mutating a copy.
// Practice: --practice 365; reference: --verify 365
static class E365 {

 public static (int Start,int End)[] Practice((int Start,int End)[] intervals) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 365");
 }
 public static (int Start,int End)[] Reference((int Start,int End)[] intervals) {
  var sorted=intervals.OrderBy(p=>p.Start).ThenBy(p=>p.End).ToArray();var result=new List<(int Start,int End)>();foreach(var item in sorted){if(result.Count>0&&item.Start < result[^1].End){var last=result[^1];result[^1]=(last.Start,Math.Max(last.End,item.End));}else result.Add(item);}return result.ToArray();
 }
 private static (int Start,int End)[] Solve((int Start,int End)[] intervals) => Check.PracticeMode ? Practice(intervals) : Reference(intervals);
 public static void Verify() {
  Check.Equal(new[] { (1,3),(3,5) }, Solve(new[] { (3,5),(1,3) }));
  Check.Equal(new[] { (1,7) }, Solve(new[] { (1,5),(2,7) }));
  Check.Equal(Array.Empty<(int,int)>(), Solve(Array.Empty<(int,int)>()));
 }
}

// ======================================================================
// 366: Tuple interval merging / scenario 3
// Merge overlapping valid intervals, including merely touching endpoints. Return sorted named tuples without mutating input. Scenario3.
// Hint: ValueTuple is a value type; replace the last tuple rather than mutating a copy.
// Practice: --practice 366; reference: --verify 366
static class E366 {

 public static (int Start,int End)[] Practice((int Start,int End)[] intervals) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 366");
 }
 public static (int Start,int End)[] Reference((int Start,int End)[] intervals) {
  var sorted=intervals.OrderBy(p=>p.Start).ThenBy(p=>p.End).ToArray();var result=new List<(int Start,int End)>();foreach(var item in sorted){if(result.Count>0&&item.Start <= result[^1].End){var last=result[^1];result[^1]=(last.Start,Math.Max(last.End,item.End));}else result.Add(item);}return result.ToArray();
 }
 private static (int Start,int End)[] Solve((int Start,int End)[] intervals) => Check.PracticeMode ? Practice(intervals) : Reference(intervals);
 public static void Verify() {
  Check.Equal(new[] { (1,5) }, Solve(new[] { (3,5),(1,3) }));
  Check.Equal(new[] { (1,7) }, Solve(new[] { (1,5),(2,7) }));
  Check.Equal(Array.Empty<(int,int)>(), Solve(Array.Empty<(int,int)>()));
 }
}

// ======================================================================
// 367: Tuple interval merging / scenario 4
// Merge overlapping valid intervals, excluding merely touching endpoints. Return sorted named tuples without mutating input. Scenario4.
// Hint: ValueTuple is a value type; replace the last tuple rather than mutating a copy.
// Practice: --practice 367; reference: --verify 367
static class E367 {

 public static (int Start,int End)[] Practice((int Start,int End)[] intervals) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 367");
 }
 public static (int Start,int End)[] Reference((int Start,int End)[] intervals) {
  var sorted=intervals.OrderBy(p=>p.Start).ThenBy(p=>p.End).ToArray();var result=new List<(int Start,int End)>();foreach(var item in sorted){if(result.Count>0&&item.Start < result[^1].End){var last=result[^1];result[^1]=(last.Start,Math.Max(last.End,item.End));}else result.Add(item);}return result.ToArray();
 }
 private static (int Start,int End)[] Solve((int Start,int End)[] intervals) => Check.PracticeMode ? Practice(intervals) : Reference(intervals);
 public static void Verify() {
  Check.Equal(new[] { (1,3),(3,5) }, Solve(new[] { (3,5),(1,3) }));
  Check.Equal(new[] { (1,7) }, Solve(new[] { (1,5),(2,7) }));
  Check.Equal(Array.Empty<(int,int)>(), Solve(Array.Empty<(int,int)>()));
 }
}

// ======================================================================
// 368: Tuple interval merging / scenario 5
// Merge overlapping valid intervals, including merely touching endpoints. Return sorted named tuples without mutating input. Scenario5.
// Hint: ValueTuple is a value type; replace the last tuple rather than mutating a copy.
// Practice: --practice 368; reference: --verify 368
static class E368 {

 public static (int Start,int End)[] Practice((int Start,int End)[] intervals) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 368");
 }
 public static (int Start,int End)[] Reference((int Start,int End)[] intervals) {
  var sorted=intervals.OrderBy(p=>p.Start).ThenBy(p=>p.End).ToArray();var result=new List<(int Start,int End)>();foreach(var item in sorted){if(result.Count>0&&item.Start <= result[^1].End){var last=result[^1];result[^1]=(last.Start,Math.Max(last.End,item.End));}else result.Add(item);}return result.ToArray();
 }
 private static (int Start,int End)[] Solve((int Start,int End)[] intervals) => Check.PracticeMode ? Practice(intervals) : Reference(intervals);
 public static void Verify() {
  Check.Equal(new[] { (1,5) }, Solve(new[] { (3,5),(1,3) }));
  Check.Equal(new[] { (1,7) }, Solve(new[] { (1,5),(2,7) }));
  Check.Equal(Array.Empty<(int,int)>(), Solve(Array.Empty<(int,int)>()));
 }
}

// ======================================================================
// 369: Tuple interval merging / scenario 6
// Merge overlapping valid intervals, excluding merely touching endpoints. Return sorted named tuples without mutating input. Scenario6.
// Hint: ValueTuple is a value type; replace the last tuple rather than mutating a copy.
// Practice: --practice 369; reference: --verify 369
static class E369 {

 public static (int Start,int End)[] Practice((int Start,int End)[] intervals) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 369");
 }
 public static (int Start,int End)[] Reference((int Start,int End)[] intervals) {
  var sorted=intervals.OrderBy(p=>p.Start).ThenBy(p=>p.End).ToArray();var result=new List<(int Start,int End)>();foreach(var item in sorted){if(result.Count>0&&item.Start < result[^1].End){var last=result[^1];result[^1]=(last.Start,Math.Max(last.End,item.End));}else result.Add(item);}return result.ToArray();
 }
 private static (int Start,int End)[] Solve((int Start,int End)[] intervals) => Check.PracticeMode ? Practice(intervals) : Reference(intervals);
 public static void Verify() {
  Check.Equal(new[] { (1,3),(3,5) }, Solve(new[] { (3,5),(1,3) }));
  Check.Equal(new[] { (1,7) }, Solve(new[] { (1,5),(2,7) }));
  Check.Equal(Array.Empty<(int,int)>(), Solve(Array.Empty<(int,int)>()));
 }
}

// ======================================================================
// 370: Tuple interval merging / scenario 7
// Merge overlapping valid intervals, including merely touching endpoints. Return sorted named tuples without mutating input. Scenario7.
// Hint: ValueTuple is a value type; replace the last tuple rather than mutating a copy.
// Practice: --practice 370; reference: --verify 370
static class E370 {

 public static (int Start,int End)[] Practice((int Start,int End)[] intervals) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 370");
 }
 public static (int Start,int End)[] Reference((int Start,int End)[] intervals) {
  var sorted=intervals.OrderBy(p=>p.Start).ThenBy(p=>p.End).ToArray();var result=new List<(int Start,int End)>();foreach(var item in sorted){if(result.Count>0&&item.Start <= result[^1].End){var last=result[^1];result[^1]=(last.Start,Math.Max(last.End,item.End));}else result.Add(item);}return result.ToArray();
 }
 private static (int Start,int End)[] Solve((int Start,int End)[] intervals) => Check.PracticeMode ? Practice(intervals) : Reference(intervals);
 public static void Verify() {
  Check.Equal(new[] { (1,5) }, Solve(new[] { (3,5),(1,3) }));
  Check.Equal(new[] { (1,7) }, Solve(new[] { (1,5),(2,7) }));
  Check.Equal(Array.Empty<(int,int)>(), Solve(Array.Empty<(int,int)>()));
 }
}

// ======================================================================
// 371: Tuple interval merging / scenario 8
// Merge overlapping valid intervals, excluding merely touching endpoints. Return sorted named tuples without mutating input. Scenario8.
// Hint: ValueTuple is a value type; replace the last tuple rather than mutating a copy.
// Practice: --practice 371; reference: --verify 371
static class E371 {

 public static (int Start,int End)[] Practice((int Start,int End)[] intervals) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 371");
 }
 public static (int Start,int End)[] Reference((int Start,int End)[] intervals) {
  var sorted=intervals.OrderBy(p=>p.Start).ThenBy(p=>p.End).ToArray();var result=new List<(int Start,int End)>();foreach(var item in sorted){if(result.Count>0&&item.Start < result[^1].End){var last=result[^1];result[^1]=(last.Start,Math.Max(last.End,item.End));}else result.Add(item);}return result.ToArray();
 }
 private static (int Start,int End)[] Solve((int Start,int End)[] intervals) => Check.PracticeMode ? Practice(intervals) : Reference(intervals);
 public static void Verify() {
  Check.Equal(new[] { (1,3),(3,5) }, Solve(new[] { (3,5),(1,3) }));
  Check.Equal(new[] { (1,7) }, Solve(new[] { (1,5),(2,7) }));
  Check.Equal(Array.Empty<(int,int)>(), Solve(Array.Empty<(int,int)>()));
 }
}

// ======================================================================
// 372: Tuple interval merging / scenario 9
// Merge overlapping valid intervals, including merely touching endpoints. Return sorted named tuples without mutating input. Scenario9.
// Hint: ValueTuple is a value type; replace the last tuple rather than mutating a copy.
// Practice: --practice 372; reference: --verify 372
static class E372 {

 public static (int Start,int End)[] Practice((int Start,int End)[] intervals) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 372");
 }
 public static (int Start,int End)[] Reference((int Start,int End)[] intervals) {
  var sorted=intervals.OrderBy(p=>p.Start).ThenBy(p=>p.End).ToArray();var result=new List<(int Start,int End)>();foreach(var item in sorted){if(result.Count>0&&item.Start <= result[^1].End){var last=result[^1];result[^1]=(last.Start,Math.Max(last.End,item.End));}else result.Add(item);}return result.ToArray();
 }
 private static (int Start,int End)[] Solve((int Start,int End)[] intervals) => Check.PracticeMode ? Practice(intervals) : Reference(intervals);
 public static void Verify() {
  Check.Equal(new[] { (1,5) }, Solve(new[] { (3,5),(1,3) }));
  Check.Equal(new[] { (1,7) }, Solve(new[] { (1,5),(2,7) }));
  Check.Equal(Array.Empty<(int,int)>(), Solve(Array.Empty<(int,int)>()));
 }
}

// ======================================================================
// 373: Tuple interval merging / scenario 10
// Merge overlapping valid intervals, excluding merely touching endpoints. Return sorted named tuples without mutating input. Scenario10.
// Hint: ValueTuple is a value type; replace the last tuple rather than mutating a copy.
// Practice: --practice 373; reference: --verify 373
static class E373 {

 public static (int Start,int End)[] Practice((int Start,int End)[] intervals) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 373");
 }
 public static (int Start,int End)[] Reference((int Start,int End)[] intervals) {
  var sorted=intervals.OrderBy(p=>p.Start).ThenBy(p=>p.End).ToArray();var result=new List<(int Start,int End)>();foreach(var item in sorted){if(result.Count>0&&item.Start < result[^1].End){var last=result[^1];result[^1]=(last.Start,Math.Max(last.End,item.End));}else result.Add(item);}return result.ToArray();
 }
 private static (int Start,int End)[] Solve((int Start,int End)[] intervals) => Check.PracticeMode ? Practice(intervals) : Reference(intervals);
 public static void Verify() {
  Check.Equal(new[] { (1,3),(3,5) }, Solve(new[] { (3,5),(1,3) }));
  Check.Equal(new[] { (1,7) }, Solve(new[] { (1,5),(2,7) }));
  Check.Equal(Array.Empty<(int,int)>(), Solve(Array.Empty<(int,int)>()));
 }
}

// ======================================================================
// 374: Tuple interval merging / scenario 11
// Merge overlapping valid intervals, including merely touching endpoints. Return sorted named tuples without mutating input. Scenario11.
// Hint: ValueTuple is a value type; replace the last tuple rather than mutating a copy.
// Practice: --practice 374; reference: --verify 374
static class E374 {

 public static (int Start,int End)[] Practice((int Start,int End)[] intervals) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 374");
 }
 public static (int Start,int End)[] Reference((int Start,int End)[] intervals) {
  var sorted=intervals.OrderBy(p=>p.Start).ThenBy(p=>p.End).ToArray();var result=new List<(int Start,int End)>();foreach(var item in sorted){if(result.Count>0&&item.Start <= result[^1].End){var last=result[^1];result[^1]=(last.Start,Math.Max(last.End,item.End));}else result.Add(item);}return result.ToArray();
 }
 private static (int Start,int End)[] Solve((int Start,int End)[] intervals) => Check.PracticeMode ? Practice(intervals) : Reference(intervals);
 public static void Verify() {
  Check.Equal(new[] { (1,5) }, Solve(new[] { (3,5),(1,3) }));
  Check.Equal(new[] { (1,7) }, Solve(new[] { (1,5),(2,7) }));
  Check.Equal(Array.Empty<(int,int)>(), Solve(Array.Empty<(int,int)>()));
 }
}

// ======================================================================
// 375: Binary search lower bound / scenario 1
// Find first index with value >=-5 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.
// Hint: Use half-open [lo,hi) search bounds.
// Practice: --practice 375; reference: --verify 375
static class E375 {

 public static int Practice(int[] sorted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 375");
 }
 public static int Reference(int[] sorted) {
  int lo=0,hi=sorted.Length;while(lo<hi){int mid=lo+(hi-lo)/2;if(sorted[mid]<-5)lo=mid+1;else hi=mid;}return lo;
 }
 private static int Solve(int[] sorted) => Check.PracticeMode ? Practice(sorted) : Reference(sorted);
 public static void Verify() {
  Check.Equal(1, Solve(new int[] { -6, -5, -5, -4 }));
  Check.Equal(0, Solve(Array.Empty<int>()));
  Check.Equal(2, Solve(new int[] { -7, -6 }));
 }
}

// ======================================================================
// 376: Binary search lower bound / scenario 2
// Find first index with value >=-4 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.
// Hint: Use half-open [lo,hi) search bounds.
// Practice: --practice 376; reference: --verify 376
static class E376 {

 public static int Practice(int[] sorted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 376");
 }
 public static int Reference(int[] sorted) {
  int lo=0,hi=sorted.Length;while(lo<hi){int mid=lo+(hi-lo)/2;if(sorted[mid]<-4)lo=mid+1;else hi=mid;}return lo;
 }
 private static int Solve(int[] sorted) => Check.PracticeMode ? Practice(sorted) : Reference(sorted);
 public static void Verify() {
  Check.Equal(1, Solve(new int[] { -5, -4, -4, -3 }));
  Check.Equal(0, Solve(Array.Empty<int>()));
  Check.Equal(2, Solve(new int[] { -6, -5 }));
 }
}

// ======================================================================
// 377: Binary search lower bound / scenario 3
// Find first index with value >=-3 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.
// Hint: Use half-open [lo,hi) search bounds.
// Practice: --practice 377; reference: --verify 377
static class E377 {

 public static int Practice(int[] sorted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 377");
 }
 public static int Reference(int[] sorted) {
  int lo=0,hi=sorted.Length;while(lo<hi){int mid=lo+(hi-lo)/2;if(sorted[mid]<-3)lo=mid+1;else hi=mid;}return lo;
 }
 private static int Solve(int[] sorted) => Check.PracticeMode ? Practice(sorted) : Reference(sorted);
 public static void Verify() {
  Check.Equal(1, Solve(new int[] { -4, -3, -3, -2 }));
  Check.Equal(0, Solve(Array.Empty<int>()));
  Check.Equal(2, Solve(new int[] { -5, -4 }));
 }
}

// ======================================================================
// 378: Binary search lower bound / scenario 4
// Find first index with value >=-2 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.
// Hint: Use half-open [lo,hi) search bounds.
// Practice: --practice 378; reference: --verify 378
static class E378 {

 public static int Practice(int[] sorted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 378");
 }
 public static int Reference(int[] sorted) {
  int lo=0,hi=sorted.Length;while(lo<hi){int mid=lo+(hi-lo)/2;if(sorted[mid]<-2)lo=mid+1;else hi=mid;}return lo;
 }
 private static int Solve(int[] sorted) => Check.PracticeMode ? Practice(sorted) : Reference(sorted);
 public static void Verify() {
  Check.Equal(1, Solve(new int[] { -3, -2, -2, -1 }));
  Check.Equal(0, Solve(Array.Empty<int>()));
  Check.Equal(2, Solve(new int[] { -4, -3 }));
 }
}

// ======================================================================
// 379: Binary search lower bound / scenario 5
// Find first index with value >=-1 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.
// Hint: Use half-open [lo,hi) search bounds.
// Practice: --practice 379; reference: --verify 379
static class E379 {

 public static int Practice(int[] sorted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 379");
 }
 public static int Reference(int[] sorted) {
  int lo=0,hi=sorted.Length;while(lo<hi){int mid=lo+(hi-lo)/2;if(sorted[mid]<-1)lo=mid+1;else hi=mid;}return lo;
 }
 private static int Solve(int[] sorted) => Check.PracticeMode ? Practice(sorted) : Reference(sorted);
 public static void Verify() {
  Check.Equal(1, Solve(new int[] { -2, -1, -1, 0 }));
  Check.Equal(0, Solve(Array.Empty<int>()));
  Check.Equal(2, Solve(new int[] { -3, -2 }));
 }
}

// ======================================================================
// 380: Binary search lower bound / scenario 6
// Find first index with value >=0 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.
// Hint: Use half-open [lo,hi) search bounds.
// Practice: --practice 380; reference: --verify 380
static class E380 {

 public static int Practice(int[] sorted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 380");
 }
 public static int Reference(int[] sorted) {
  int lo=0,hi=sorted.Length;while(lo<hi){int mid=lo+(hi-lo)/2;if(sorted[mid]<0)lo=mid+1;else hi=mid;}return lo;
 }
 private static int Solve(int[] sorted) => Check.PracticeMode ? Practice(sorted) : Reference(sorted);
 public static void Verify() {
  Check.Equal(1, Solve(new int[] { -1, 0, 0, 1 }));
  Check.Equal(0, Solve(Array.Empty<int>()));
  Check.Equal(2, Solve(new int[] { -2, -1 }));
 }
}

// ======================================================================
// 381: Binary search lower bound / scenario 7
// Find first index with value >=1 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.
// Hint: Use half-open [lo,hi) search bounds.
// Practice: --practice 381; reference: --verify 381
static class E381 {

 public static int Practice(int[] sorted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 381");
 }
 public static int Reference(int[] sorted) {
  int lo=0,hi=sorted.Length;while(lo<hi){int mid=lo+(hi-lo)/2;if(sorted[mid]<1)lo=mid+1;else hi=mid;}return lo;
 }
 private static int Solve(int[] sorted) => Check.PracticeMode ? Practice(sorted) : Reference(sorted);
 public static void Verify() {
  Check.Equal(1, Solve(new int[] { 0, 1, 1, 2 }));
  Check.Equal(0, Solve(Array.Empty<int>()));
  Check.Equal(2, Solve(new int[] { -1, 0 }));
 }
}

// ======================================================================
// 382: Binary search lower bound / scenario 8
// Find first index with value >=2 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.
// Hint: Use half-open [lo,hi) search bounds.
// Practice: --practice 382; reference: --verify 382
static class E382 {

 public static int Practice(int[] sorted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 382");
 }
 public static int Reference(int[] sorted) {
  int lo=0,hi=sorted.Length;while(lo<hi){int mid=lo+(hi-lo)/2;if(sorted[mid]<2)lo=mid+1;else hi=mid;}return lo;
 }
 private static int Solve(int[] sorted) => Check.PracticeMode ? Practice(sorted) : Reference(sorted);
 public static void Verify() {
  Check.Equal(1, Solve(new int[] { 1, 2, 2, 3 }));
  Check.Equal(0, Solve(Array.Empty<int>()));
  Check.Equal(2, Solve(new int[] { 0, 1 }));
 }
}

// ======================================================================
// 383: Binary search lower bound / scenario 9
// Find first index with value >=3 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.
// Hint: Use half-open [lo,hi) search bounds.
// Practice: --practice 383; reference: --verify 383
static class E383 {

 public static int Practice(int[] sorted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 383");
 }
 public static int Reference(int[] sorted) {
  int lo=0,hi=sorted.Length;while(lo<hi){int mid=lo+(hi-lo)/2;if(sorted[mid]<3)lo=mid+1;else hi=mid;}return lo;
 }
 private static int Solve(int[] sorted) => Check.PracticeMode ? Practice(sorted) : Reference(sorted);
 public static void Verify() {
  Check.Equal(1, Solve(new int[] { 2, 3, 3, 4 }));
  Check.Equal(0, Solve(Array.Empty<int>()));
  Check.Equal(2, Solve(new int[] { 1, 2 }));
 }
}

// ======================================================================
// 384: Binary search lower bound / scenario 10
// Find first index with value >=4 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.
// Hint: Use half-open [lo,hi) search bounds.
// Practice: --practice 384; reference: --verify 384
static class E384 {

 public static int Practice(int[] sorted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 384");
 }
 public static int Reference(int[] sorted) {
  int lo=0,hi=sorted.Length;while(lo<hi){int mid=lo+(hi-lo)/2;if(sorted[mid]<4)lo=mid+1;else hi=mid;}return lo;
 }
 private static int Solve(int[] sorted) => Check.PracticeMode ? Practice(sorted) : Reference(sorted);
 public static void Verify() {
  Check.Equal(1, Solve(new int[] { 3, 4, 4, 5 }));
  Check.Equal(0, Solve(Array.Empty<int>()));
  Check.Equal(2, Solve(new int[] { 2, 3 }));
 }
}

// ======================================================================
// 385: Binary search lower bound / scenario 11
// Find first index with value >=5 in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.
// Hint: Use half-open [lo,hi) search bounds.
// Practice: --practice 385; reference: --verify 385
static class E385 {

 public static int Practice(int[] sorted) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 385");
 }
 public static int Reference(int[] sorted) {
  int lo=0,hi=sorted.Length;while(lo<hi){int mid=lo+(hi-lo)/2;if(sorted[mid]<5)lo=mid+1;else hi=mid;}return lo;
 }
 private static int Solve(int[] sorted) => Check.PracticeMode ? Practice(sorted) : Reference(sorted);
 public static void Verify() {
  Check.Equal(1, Solve(new int[] { 4, 5, 5, 6 }));
  Check.Equal(0, Solve(Array.Empty<int>()));
  Check.Equal(2, Solve(new int[] { 3, 4 }));
 }
}

// ======================================================================
// 386: Tree traversal with explicit stack / scenario 1
// Depth-first preorder traversal; return values >=-5, preserving child order. Null root returns[]. Use stack instead of recursion.
// Hint: Push children in reverse order because the stack is LIFO.
// Practice: --practice 386; reference: --verify 386
static class E386 {
public sealed record Node(int Value,Node[] Children);
 public static int[] Practice(Node? root) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 386");
 }
 public static int[] Reference(Node? root) {
  if(root is null)return Array.Empty<int>();var stack=new Stack<Node>();stack.Push(root);var result=new List<int>();while(stack.Count>0){var node=stack.Pop();if(node.Value>=-5)result.Add(node.Value);for(int i=node.Children.Length-1;i>=0;i--)stack.Push(node.Children[i]);}return result.ToArray();
 }
 private static int[] Solve(Node? root) => Check.PracticeMode ? Practice(root) : Reference(root);
 public static void Verify() {
  Check.Equal(Array.Empty<int>(), Solve(null));
  Check.Equal(new int[] { -5, -3 }, Solve(new Node(-5,new[] { new Node(-6,Array.Empty<Node>()),new Node(-3,Array.Empty<Node>()) })));
  Check.Equal(new int[] { -5 }, Solve(new Node(-5,Array.Empty<Node>())));
 }
}

// ======================================================================
// 387: Tree traversal with explicit stack / scenario 2
// Depth-first preorder traversal; return values >=-4, preserving child order. Null root returns[]. Use stack instead of recursion.
// Hint: Push children in reverse order because the stack is LIFO.
// Practice: --practice 387; reference: --verify 387
static class E387 {
public sealed record Node(int Value,Node[] Children);
 public static int[] Practice(Node? root) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 387");
 }
 public static int[] Reference(Node? root) {
  if(root is null)return Array.Empty<int>();var stack=new Stack<Node>();stack.Push(root);var result=new List<int>();while(stack.Count>0){var node=stack.Pop();if(node.Value>=-4)result.Add(node.Value);for(int i=node.Children.Length-1;i>=0;i--)stack.Push(node.Children[i]);}return result.ToArray();
 }
 private static int[] Solve(Node? root) => Check.PracticeMode ? Practice(root) : Reference(root);
 public static void Verify() {
  Check.Equal(Array.Empty<int>(), Solve(null));
  Check.Equal(new int[] { -4, -2 }, Solve(new Node(-4,new[] { new Node(-5,Array.Empty<Node>()),new Node(-2,Array.Empty<Node>()) })));
  Check.Equal(new int[] { -4 }, Solve(new Node(-4,Array.Empty<Node>())));
 }
}

// ======================================================================
// 388: Tree traversal with explicit stack / scenario 3
// Depth-first preorder traversal; return values >=-3, preserving child order. Null root returns[]. Use stack instead of recursion.
// Hint: Push children in reverse order because the stack is LIFO.
// Practice: --practice 388; reference: --verify 388
static class E388 {
public sealed record Node(int Value,Node[] Children);
 public static int[] Practice(Node? root) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 388");
 }
 public static int[] Reference(Node? root) {
  if(root is null)return Array.Empty<int>();var stack=new Stack<Node>();stack.Push(root);var result=new List<int>();while(stack.Count>0){var node=stack.Pop();if(node.Value>=-3)result.Add(node.Value);for(int i=node.Children.Length-1;i>=0;i--)stack.Push(node.Children[i]);}return result.ToArray();
 }
 private static int[] Solve(Node? root) => Check.PracticeMode ? Practice(root) : Reference(root);
 public static void Verify() {
  Check.Equal(Array.Empty<int>(), Solve(null));
  Check.Equal(new int[] { -3, -1 }, Solve(new Node(-3,new[] { new Node(-4,Array.Empty<Node>()),new Node(-1,Array.Empty<Node>()) })));
  Check.Equal(new int[] { -3 }, Solve(new Node(-3,Array.Empty<Node>())));
 }
}

// ======================================================================
// 389: Tree traversal with explicit stack / scenario 4
// Depth-first preorder traversal; return values >=-2, preserving child order. Null root returns[]. Use stack instead of recursion.
// Hint: Push children in reverse order because the stack is LIFO.
// Practice: --practice 389; reference: --verify 389
static class E389 {
public sealed record Node(int Value,Node[] Children);
 public static int[] Practice(Node? root) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 389");
 }
 public static int[] Reference(Node? root) {
  if(root is null)return Array.Empty<int>();var stack=new Stack<Node>();stack.Push(root);var result=new List<int>();while(stack.Count>0){var node=stack.Pop();if(node.Value>=-2)result.Add(node.Value);for(int i=node.Children.Length-1;i>=0;i--)stack.Push(node.Children[i]);}return result.ToArray();
 }
 private static int[] Solve(Node? root) => Check.PracticeMode ? Practice(root) : Reference(root);
 public static void Verify() {
  Check.Equal(Array.Empty<int>(), Solve(null));
  Check.Equal(new int[] { -2, 0 }, Solve(new Node(-2,new[] { new Node(-3,Array.Empty<Node>()),new Node(0,Array.Empty<Node>()) })));
  Check.Equal(new int[] { -2 }, Solve(new Node(-2,Array.Empty<Node>())));
 }
}

// ======================================================================
// 390: Tree traversal with explicit stack / scenario 5
// Depth-first preorder traversal; return values >=-1, preserving child order. Null root returns[]. Use stack instead of recursion.
// Hint: Push children in reverse order because the stack is LIFO.
// Practice: --practice 390; reference: --verify 390
static class E390 {
public sealed record Node(int Value,Node[] Children);
 public static int[] Practice(Node? root) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 390");
 }
 public static int[] Reference(Node? root) {
  if(root is null)return Array.Empty<int>();var stack=new Stack<Node>();stack.Push(root);var result=new List<int>();while(stack.Count>0){var node=stack.Pop();if(node.Value>=-1)result.Add(node.Value);for(int i=node.Children.Length-1;i>=0;i--)stack.Push(node.Children[i]);}return result.ToArray();
 }
 private static int[] Solve(Node? root) => Check.PracticeMode ? Practice(root) : Reference(root);
 public static void Verify() {
  Check.Equal(Array.Empty<int>(), Solve(null));
  Check.Equal(new int[] { -1, 1 }, Solve(new Node(-1,new[] { new Node(-2,Array.Empty<Node>()),new Node(1,Array.Empty<Node>()) })));
  Check.Equal(new int[] { -1 }, Solve(new Node(-1,Array.Empty<Node>())));
 }
}

// ======================================================================
// 391: Tree traversal with explicit stack / scenario 6
// Depth-first preorder traversal; return values >=0, preserving child order. Null root returns[]. Use stack instead of recursion.
// Hint: Push children in reverse order because the stack is LIFO.
// Practice: --practice 391; reference: --verify 391
static class E391 {
public sealed record Node(int Value,Node[] Children);
 public static int[] Practice(Node? root) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 391");
 }
 public static int[] Reference(Node? root) {
  if(root is null)return Array.Empty<int>();var stack=new Stack<Node>();stack.Push(root);var result=new List<int>();while(stack.Count>0){var node=stack.Pop();if(node.Value>=0)result.Add(node.Value);for(int i=node.Children.Length-1;i>=0;i--)stack.Push(node.Children[i]);}return result.ToArray();
 }
 private static int[] Solve(Node? root) => Check.PracticeMode ? Practice(root) : Reference(root);
 public static void Verify() {
  Check.Equal(Array.Empty<int>(), Solve(null));
  Check.Equal(new int[] { 0, 2 }, Solve(new Node(0,new[] { new Node(-1,Array.Empty<Node>()),new Node(2,Array.Empty<Node>()) })));
  Check.Equal(new int[] { 0 }, Solve(new Node(0,Array.Empty<Node>())));
 }
}

// ======================================================================
// 392: Tree traversal with explicit stack / scenario 7
// Depth-first preorder traversal; return values >=1, preserving child order. Null root returns[]. Use stack instead of recursion.
// Hint: Push children in reverse order because the stack is LIFO.
// Practice: --practice 392; reference: --verify 392
static class E392 {
public sealed record Node(int Value,Node[] Children);
 public static int[] Practice(Node? root) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 392");
 }
 public static int[] Reference(Node? root) {
  if(root is null)return Array.Empty<int>();var stack=new Stack<Node>();stack.Push(root);var result=new List<int>();while(stack.Count>0){var node=stack.Pop();if(node.Value>=1)result.Add(node.Value);for(int i=node.Children.Length-1;i>=0;i--)stack.Push(node.Children[i]);}return result.ToArray();
 }
 private static int[] Solve(Node? root) => Check.PracticeMode ? Practice(root) : Reference(root);
 public static void Verify() {
  Check.Equal(Array.Empty<int>(), Solve(null));
  Check.Equal(new int[] { 1, 3 }, Solve(new Node(1,new[] { new Node(0,Array.Empty<Node>()),new Node(3,Array.Empty<Node>()) })));
  Check.Equal(new int[] { 1 }, Solve(new Node(1,Array.Empty<Node>())));
 }
}

// ======================================================================
// 393: Tree traversal with explicit stack / scenario 8
// Depth-first preorder traversal; return values >=2, preserving child order. Null root returns[]. Use stack instead of recursion.
// Hint: Push children in reverse order because the stack is LIFO.
// Practice: --practice 393; reference: --verify 393
static class E393 {
public sealed record Node(int Value,Node[] Children);
 public static int[] Practice(Node? root) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 393");
 }
 public static int[] Reference(Node? root) {
  if(root is null)return Array.Empty<int>();var stack=new Stack<Node>();stack.Push(root);var result=new List<int>();while(stack.Count>0){var node=stack.Pop();if(node.Value>=2)result.Add(node.Value);for(int i=node.Children.Length-1;i>=0;i--)stack.Push(node.Children[i]);}return result.ToArray();
 }
 private static int[] Solve(Node? root) => Check.PracticeMode ? Practice(root) : Reference(root);
 public static void Verify() {
  Check.Equal(Array.Empty<int>(), Solve(null));
  Check.Equal(new int[] { 2, 4 }, Solve(new Node(2,new[] { new Node(1,Array.Empty<Node>()),new Node(4,Array.Empty<Node>()) })));
  Check.Equal(new int[] { 2 }, Solve(new Node(2,Array.Empty<Node>())));
 }
}

// ======================================================================
// 394: Tree traversal with explicit stack / scenario 9
// Depth-first preorder traversal; return values >=3, preserving child order. Null root returns[]. Use stack instead of recursion.
// Hint: Push children in reverse order because the stack is LIFO.
// Practice: --practice 394; reference: --verify 394
static class E394 {
public sealed record Node(int Value,Node[] Children);
 public static int[] Practice(Node? root) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 394");
 }
 public static int[] Reference(Node? root) {
  if(root is null)return Array.Empty<int>();var stack=new Stack<Node>();stack.Push(root);var result=new List<int>();while(stack.Count>0){var node=stack.Pop();if(node.Value>=3)result.Add(node.Value);for(int i=node.Children.Length-1;i>=0;i--)stack.Push(node.Children[i]);}return result.ToArray();
 }
 private static int[] Solve(Node? root) => Check.PracticeMode ? Practice(root) : Reference(root);
 public static void Verify() {
  Check.Equal(Array.Empty<int>(), Solve(null));
  Check.Equal(new int[] { 3, 5 }, Solve(new Node(3,new[] { new Node(2,Array.Empty<Node>()),new Node(5,Array.Empty<Node>()) })));
  Check.Equal(new int[] { 3 }, Solve(new Node(3,Array.Empty<Node>())));
 }
}

// ======================================================================
// 395: Tree traversal with explicit stack / scenario 10
// Depth-first preorder traversal; return values >=4, preserving child order. Null root returns[]. Use stack instead of recursion.
// Hint: Push children in reverse order because the stack is LIFO.
// Practice: --practice 395; reference: --verify 395
static class E395 {
public sealed record Node(int Value,Node[] Children);
 public static int[] Practice(Node? root) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 395");
 }
 public static int[] Reference(Node? root) {
  if(root is null)return Array.Empty<int>();var stack=new Stack<Node>();stack.Push(root);var result=new List<int>();while(stack.Count>0){var node=stack.Pop();if(node.Value>=4)result.Add(node.Value);for(int i=node.Children.Length-1;i>=0;i--)stack.Push(node.Children[i]);}return result.ToArray();
 }
 private static int[] Solve(Node? root) => Check.PracticeMode ? Practice(root) : Reference(root);
 public static void Verify() {
  Check.Equal(Array.Empty<int>(), Solve(null));
  Check.Equal(new int[] { 4, 6 }, Solve(new Node(4,new[] { new Node(3,Array.Empty<Node>()),new Node(6,Array.Empty<Node>()) })));
  Check.Equal(new int[] { 4 }, Solve(new Node(4,Array.Empty<Node>())));
 }
}

// ======================================================================
// 396: Tree traversal with explicit stack / scenario 11
// Depth-first preorder traversal; return values >=5, preserving child order. Null root returns[]. Use stack instead of recursion.
// Hint: Push children in reverse order because the stack is LIFO.
// Practice: --practice 396; reference: --verify 396
static class E396 {
public sealed record Node(int Value,Node[] Children);
 public static int[] Practice(Node? root) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 396");
 }
 public static int[] Reference(Node? root) {
  if(root is null)return Array.Empty<int>();var stack=new Stack<Node>();stack.Push(root);var result=new List<int>();while(stack.Count>0){var node=stack.Pop();if(node.Value>=5)result.Add(node.Value);for(int i=node.Children.Length-1;i>=0;i--)stack.Push(node.Children[i]);}return result.ToArray();
 }
 private static int[] Solve(Node? root) => Check.PracticeMode ? Practice(root) : Reference(root);
 public static void Verify() {
  Check.Equal(Array.Empty<int>(), Solve(null));
  Check.Equal(new int[] { 5, 7 }, Solve(new Node(5,new[] { new Node(4,Array.Empty<Node>()),new Node(7,Array.Empty<Node>()) })));
  Check.Equal(new int[] { 5 }, Solve(new Node(5,Array.Empty<Node>())));
 }
}

// ======================================================================
// 397: Graph breadth-first distances / scenario 1
// Find shortest directed edge counts from start, including only nodes within1 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.
// Hint: Mark visited when enqueueing, not when dequeueing.
// Practice: --practice 397; reference: --verify 397
static class E397 {

 public static SortedDictionary<string,int> Practice(Dictionary<string,string[]> graph,string start) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 397");
 }
 public static SortedDictionary<string,int> Reference(Dictionary<string,string[]> graph,string start) {
  var distances=new SortedDictionary<string,int>(StringComparer.Ordinal) { [start]=0 };var queue=new Queue<string>();queue.Enqueue(start);while(queue.Count>0){var node=queue.Dequeue();if(distances[node]>=1)continue;foreach(var next in graph.GetValueOrDefault(node,Array.Empty<string>()))if(!distances.ContainsKey(next)){distances[next]=distances[node]+1;queue.Enqueue(next);}}return distances;
 }
 private static SortedDictionary<string,int> Solve(Dictionary<string,string[]> graph,string start) => Check.PracticeMode ? Practice(graph, start) : Reference(graph, start);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0,["b"]=1 }, Solve(new() { ["a"]=new[] { "b","b" },["b"]=new[] { "a","c" } },"a"));
  Check.Equal(new SortedDictionary<string,int> { ["x"]=0 }, Solve(new(),"x"));
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0 }, Solve(new() { ["a"]=new[] { "a" } },"a"));
 }
}

// ======================================================================
// 398: Graph breadth-first distances / scenario 2
// Find shortest directed edge counts from start, including only nodes within2 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.
// Hint: Mark visited when enqueueing, not when dequeueing.
// Practice: --practice 398; reference: --verify 398
static class E398 {

 public static SortedDictionary<string,int> Practice(Dictionary<string,string[]> graph,string start) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 398");
 }
 public static SortedDictionary<string,int> Reference(Dictionary<string,string[]> graph,string start) {
  var distances=new SortedDictionary<string,int>(StringComparer.Ordinal) { [start]=0 };var queue=new Queue<string>();queue.Enqueue(start);while(queue.Count>0){var node=queue.Dequeue();if(distances[node]>=2)continue;foreach(var next in graph.GetValueOrDefault(node,Array.Empty<string>()))if(!distances.ContainsKey(next)){distances[next]=distances[node]+1;queue.Enqueue(next);}}return distances;
 }
 private static SortedDictionary<string,int> Solve(Dictionary<string,string[]> graph,string start) => Check.PracticeMode ? Practice(graph, start) : Reference(graph, start);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0,["b"]=1,["c"]=2 }, Solve(new() { ["a"]=new[] { "b","b" },["b"]=new[] { "a","c" } },"a"));
  Check.Equal(new SortedDictionary<string,int> { ["x"]=0 }, Solve(new(),"x"));
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0 }, Solve(new() { ["a"]=new[] { "a" } },"a"));
 }
}

// ======================================================================
// 399: Graph breadth-first distances / scenario 3
// Find shortest directed edge counts from start, including only nodes within3 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.
// Hint: Mark visited when enqueueing, not when dequeueing.
// Practice: --practice 399; reference: --verify 399
static class E399 {

 public static SortedDictionary<string,int> Practice(Dictionary<string,string[]> graph,string start) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 399");
 }
 public static SortedDictionary<string,int> Reference(Dictionary<string,string[]> graph,string start) {
  var distances=new SortedDictionary<string,int>(StringComparer.Ordinal) { [start]=0 };var queue=new Queue<string>();queue.Enqueue(start);while(queue.Count>0){var node=queue.Dequeue();if(distances[node]>=3)continue;foreach(var next in graph.GetValueOrDefault(node,Array.Empty<string>()))if(!distances.ContainsKey(next)){distances[next]=distances[node]+1;queue.Enqueue(next);}}return distances;
 }
 private static SortedDictionary<string,int> Solve(Dictionary<string,string[]> graph,string start) => Check.PracticeMode ? Practice(graph, start) : Reference(graph, start);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0,["b"]=1,["c"]=2 }, Solve(new() { ["a"]=new[] { "b","b" },["b"]=new[] { "a","c" } },"a"));
  Check.Equal(new SortedDictionary<string,int> { ["x"]=0 }, Solve(new(),"x"));
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0 }, Solve(new() { ["a"]=new[] { "a" } },"a"));
 }
}

// ======================================================================
// 400: Graph breadth-first distances / scenario 4
// Find shortest directed edge counts from start, including only nodes within4 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.
// Hint: Mark visited when enqueueing, not when dequeueing.
// Practice: --practice 400; reference: --verify 400
static class E400 {

 public static SortedDictionary<string,int> Practice(Dictionary<string,string[]> graph,string start) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 400");
 }
 public static SortedDictionary<string,int> Reference(Dictionary<string,string[]> graph,string start) {
  var distances=new SortedDictionary<string,int>(StringComparer.Ordinal) { [start]=0 };var queue=new Queue<string>();queue.Enqueue(start);while(queue.Count>0){var node=queue.Dequeue();if(distances[node]>=4)continue;foreach(var next in graph.GetValueOrDefault(node,Array.Empty<string>()))if(!distances.ContainsKey(next)){distances[next]=distances[node]+1;queue.Enqueue(next);}}return distances;
 }
 private static SortedDictionary<string,int> Solve(Dictionary<string,string[]> graph,string start) => Check.PracticeMode ? Practice(graph, start) : Reference(graph, start);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0,["b"]=1,["c"]=2 }, Solve(new() { ["a"]=new[] { "b","b" },["b"]=new[] { "a","c" } },"a"));
  Check.Equal(new SortedDictionary<string,int> { ["x"]=0 }, Solve(new(),"x"));
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0 }, Solve(new() { ["a"]=new[] { "a" } },"a"));
 }
}

// ======================================================================
// 401: Graph breadth-first distances / scenario 5
// Find shortest directed edge counts from start, including only nodes within5 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.
// Hint: Mark visited when enqueueing, not when dequeueing.
// Practice: --practice 401; reference: --verify 401
static class E401 {

 public static SortedDictionary<string,int> Practice(Dictionary<string,string[]> graph,string start) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 401");
 }
 public static SortedDictionary<string,int> Reference(Dictionary<string,string[]> graph,string start) {
  var distances=new SortedDictionary<string,int>(StringComparer.Ordinal) { [start]=0 };var queue=new Queue<string>();queue.Enqueue(start);while(queue.Count>0){var node=queue.Dequeue();if(distances[node]>=5)continue;foreach(var next in graph.GetValueOrDefault(node,Array.Empty<string>()))if(!distances.ContainsKey(next)){distances[next]=distances[node]+1;queue.Enqueue(next);}}return distances;
 }
 private static SortedDictionary<string,int> Solve(Dictionary<string,string[]> graph,string start) => Check.PracticeMode ? Practice(graph, start) : Reference(graph, start);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0,["b"]=1,["c"]=2 }, Solve(new() { ["a"]=new[] { "b","b" },["b"]=new[] { "a","c" } },"a"));
  Check.Equal(new SortedDictionary<string,int> { ["x"]=0 }, Solve(new(),"x"));
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0 }, Solve(new() { ["a"]=new[] { "a" } },"a"));
 }
}

// ======================================================================
// 402: Graph breadth-first distances / scenario 6
// Find shortest directed edge counts from start, including only nodes within6 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.
// Hint: Mark visited when enqueueing, not when dequeueing.
// Practice: --practice 402; reference: --verify 402
static class E402 {

 public static SortedDictionary<string,int> Practice(Dictionary<string,string[]> graph,string start) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 402");
 }
 public static SortedDictionary<string,int> Reference(Dictionary<string,string[]> graph,string start) {
  var distances=new SortedDictionary<string,int>(StringComparer.Ordinal) { [start]=0 };var queue=new Queue<string>();queue.Enqueue(start);while(queue.Count>0){var node=queue.Dequeue();if(distances[node]>=6)continue;foreach(var next in graph.GetValueOrDefault(node,Array.Empty<string>()))if(!distances.ContainsKey(next)){distances[next]=distances[node]+1;queue.Enqueue(next);}}return distances;
 }
 private static SortedDictionary<string,int> Solve(Dictionary<string,string[]> graph,string start) => Check.PracticeMode ? Practice(graph, start) : Reference(graph, start);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0,["b"]=1,["c"]=2 }, Solve(new() { ["a"]=new[] { "b","b" },["b"]=new[] { "a","c" } },"a"));
  Check.Equal(new SortedDictionary<string,int> { ["x"]=0 }, Solve(new(),"x"));
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0 }, Solve(new() { ["a"]=new[] { "a" } },"a"));
 }
}

// ======================================================================
// 403: Graph breadth-first distances / scenario 7
// Find shortest directed edge counts from start, including only nodes within7 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.
// Hint: Mark visited when enqueueing, not when dequeueing.
// Practice: --practice 403; reference: --verify 403
static class E403 {

 public static SortedDictionary<string,int> Practice(Dictionary<string,string[]> graph,string start) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 403");
 }
 public static SortedDictionary<string,int> Reference(Dictionary<string,string[]> graph,string start) {
  var distances=new SortedDictionary<string,int>(StringComparer.Ordinal) { [start]=0 };var queue=new Queue<string>();queue.Enqueue(start);while(queue.Count>0){var node=queue.Dequeue();if(distances[node]>=7)continue;foreach(var next in graph.GetValueOrDefault(node,Array.Empty<string>()))if(!distances.ContainsKey(next)){distances[next]=distances[node]+1;queue.Enqueue(next);}}return distances;
 }
 private static SortedDictionary<string,int> Solve(Dictionary<string,string[]> graph,string start) => Check.PracticeMode ? Practice(graph, start) : Reference(graph, start);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0,["b"]=1,["c"]=2 }, Solve(new() { ["a"]=new[] { "b","b" },["b"]=new[] { "a","c" } },"a"));
  Check.Equal(new SortedDictionary<string,int> { ["x"]=0 }, Solve(new(),"x"));
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0 }, Solve(new() { ["a"]=new[] { "a" } },"a"));
 }
}

// ======================================================================
// 404: Graph breadth-first distances / scenario 8
// Find shortest directed edge counts from start, including only nodes within8 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.
// Hint: Mark visited when enqueueing, not when dequeueing.
// Practice: --practice 404; reference: --verify 404
static class E404 {

 public static SortedDictionary<string,int> Practice(Dictionary<string,string[]> graph,string start) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 404");
 }
 public static SortedDictionary<string,int> Reference(Dictionary<string,string[]> graph,string start) {
  var distances=new SortedDictionary<string,int>(StringComparer.Ordinal) { [start]=0 };var queue=new Queue<string>();queue.Enqueue(start);while(queue.Count>0){var node=queue.Dequeue();if(distances[node]>=8)continue;foreach(var next in graph.GetValueOrDefault(node,Array.Empty<string>()))if(!distances.ContainsKey(next)){distances[next]=distances[node]+1;queue.Enqueue(next);}}return distances;
 }
 private static SortedDictionary<string,int> Solve(Dictionary<string,string[]> graph,string start) => Check.PracticeMode ? Practice(graph, start) : Reference(graph, start);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0,["b"]=1,["c"]=2 }, Solve(new() { ["a"]=new[] { "b","b" },["b"]=new[] { "a","c" } },"a"));
  Check.Equal(new SortedDictionary<string,int> { ["x"]=0 }, Solve(new(),"x"));
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0 }, Solve(new() { ["a"]=new[] { "a" } },"a"));
 }
}

// ======================================================================
// 405: Graph breadth-first distances / scenario 9
// Find shortest directed edge counts from start, including only nodes within9 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.
// Hint: Mark visited when enqueueing, not when dequeueing.
// Practice: --practice 405; reference: --verify 405
static class E405 {

 public static SortedDictionary<string,int> Practice(Dictionary<string,string[]> graph,string start) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 405");
 }
 public static SortedDictionary<string,int> Reference(Dictionary<string,string[]> graph,string start) {
  var distances=new SortedDictionary<string,int>(StringComparer.Ordinal) { [start]=0 };var queue=new Queue<string>();queue.Enqueue(start);while(queue.Count>0){var node=queue.Dequeue();if(distances[node]>=9)continue;foreach(var next in graph.GetValueOrDefault(node,Array.Empty<string>()))if(!distances.ContainsKey(next)){distances[next]=distances[node]+1;queue.Enqueue(next);}}return distances;
 }
 private static SortedDictionary<string,int> Solve(Dictionary<string,string[]> graph,string start) => Check.PracticeMode ? Practice(graph, start) : Reference(graph, start);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0,["b"]=1,["c"]=2 }, Solve(new() { ["a"]=new[] { "b","b" },["b"]=new[] { "a","c" } },"a"));
  Check.Equal(new SortedDictionary<string,int> { ["x"]=0 }, Solve(new(),"x"));
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0 }, Solve(new() { ["a"]=new[] { "a" } },"a"));
 }
}

// ======================================================================
// 406: Graph breadth-first distances / scenario 10
// Find shortest directed edge counts from start, including only nodes within10 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.
// Hint: Mark visited when enqueueing, not when dequeueing.
// Practice: --practice 406; reference: --verify 406
static class E406 {

 public static SortedDictionary<string,int> Practice(Dictionary<string,string[]> graph,string start) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 406");
 }
 public static SortedDictionary<string,int> Reference(Dictionary<string,string[]> graph,string start) {
  var distances=new SortedDictionary<string,int>(StringComparer.Ordinal) { [start]=0 };var queue=new Queue<string>();queue.Enqueue(start);while(queue.Count>0){var node=queue.Dequeue();if(distances[node]>=10)continue;foreach(var next in graph.GetValueOrDefault(node,Array.Empty<string>()))if(!distances.ContainsKey(next)){distances[next]=distances[node]+1;queue.Enqueue(next);}}return distances;
 }
 private static SortedDictionary<string,int> Solve(Dictionary<string,string[]> graph,string start) => Check.PracticeMode ? Practice(graph, start) : Reference(graph, start);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0,["b"]=1,["c"]=2 }, Solve(new() { ["a"]=new[] { "b","b" },["b"]=new[] { "a","c" } },"a"));
  Check.Equal(new SortedDictionary<string,int> { ["x"]=0 }, Solve(new(),"x"));
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0 }, Solve(new() { ["a"]=new[] { "a" } },"a"));
 }
}

// ======================================================================
// 407: Graph breadth-first distances / scenario 11
// Find shortest directed edge counts from start, including only nodes within11 edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.
// Hint: Mark visited when enqueueing, not when dequeueing.
// Practice: --practice 407; reference: --verify 407
static class E407 {

 public static SortedDictionary<string,int> Practice(Dictionary<string,string[]> graph,string start) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 407");
 }
 public static SortedDictionary<string,int> Reference(Dictionary<string,string[]> graph,string start) {
  var distances=new SortedDictionary<string,int>(StringComparer.Ordinal) { [start]=0 };var queue=new Queue<string>();queue.Enqueue(start);while(queue.Count>0){var node=queue.Dequeue();if(distances[node]>=11)continue;foreach(var next in graph.GetValueOrDefault(node,Array.Empty<string>()))if(!distances.ContainsKey(next)){distances[next]=distances[node]+1;queue.Enqueue(next);}}return distances;
 }
 private static SortedDictionary<string,int> Solve(Dictionary<string,string[]> graph,string start) => Check.PracticeMode ? Practice(graph, start) : Reference(graph, start);
 public static void Verify() {
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0,["b"]=1,["c"]=2 }, Solve(new() { ["a"]=new[] { "b","b" },["b"]=new[] { "a","c" } },"a"));
  Check.Equal(new SortedDictionary<string,int> { ["x"]=0 }, Solve(new(),"x"));
  Check.Equal(new SortedDictionary<string,int> { ["a"]=0 }, Solve(new() { ["a"]=new[] { "a" } },"a"));
 }
}

// ======================================================================
// 408: Delegate composition / scenario 1
// Return a new delegate applying transform then adding1 with checked arithmetic. Do not invoke transform during construction; reject null.
// Hint: A closure captures the transform for later calls.
// Practice: --practice 408; reference: --verify 408
static class E408 {

 public static Func<int,int> Practice(Func<int,int> transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 408");
 }
 public static Func<int,int> Reference(Func<int,int> transform) {
  ArgumentNullException.ThrowIfNull(transform);return value => checked(transform(value) + 1);
 }
 private static Func<int,int> Solve(Func<int,int> transform) => Check.PracticeMode ? Practice(transform) : Reference(transform);
 public static void Verify() {
  Check.Equal(7, Solve(n=>n*2)(3));
  Check.Equal(1, Solve(n=>0)(99));
  int calls=0;var f=Solve(n=>{calls++;return n;});Check.Equal(0,calls);_ = f(1);Check.Equal(1,calls);
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 409: Delegate composition / scenario 2
// Return a new delegate applying transform then adding2 with checked arithmetic. Do not invoke transform during construction; reject null.
// Hint: A closure captures the transform for later calls.
// Practice: --practice 409; reference: --verify 409
static class E409 {

 public static Func<int,int> Practice(Func<int,int> transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 409");
 }
 public static Func<int,int> Reference(Func<int,int> transform) {
  ArgumentNullException.ThrowIfNull(transform);return value => checked(transform(value) + 2);
 }
 private static Func<int,int> Solve(Func<int,int> transform) => Check.PracticeMode ? Practice(transform) : Reference(transform);
 public static void Verify() {
  Check.Equal(8, Solve(n=>n*2)(3));
  Check.Equal(2, Solve(n=>0)(99));
  int calls=0;var f=Solve(n=>{calls++;return n;});Check.Equal(0,calls);_ = f(1);Check.Equal(1,calls);
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 410: Delegate composition / scenario 3
// Return a new delegate applying transform then adding3 with checked arithmetic. Do not invoke transform during construction; reject null.
// Hint: A closure captures the transform for later calls.
// Practice: --practice 410; reference: --verify 410
static class E410 {

 public static Func<int,int> Practice(Func<int,int> transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 410");
 }
 public static Func<int,int> Reference(Func<int,int> transform) {
  ArgumentNullException.ThrowIfNull(transform);return value => checked(transform(value) + 3);
 }
 private static Func<int,int> Solve(Func<int,int> transform) => Check.PracticeMode ? Practice(transform) : Reference(transform);
 public static void Verify() {
  Check.Equal(9, Solve(n=>n*2)(3));
  Check.Equal(3, Solve(n=>0)(99));
  int calls=0;var f=Solve(n=>{calls++;return n;});Check.Equal(0,calls);_ = f(1);Check.Equal(1,calls);
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 411: Delegate composition / scenario 4
// Return a new delegate applying transform then adding4 with checked arithmetic. Do not invoke transform during construction; reject null.
// Hint: A closure captures the transform for later calls.
// Practice: --practice 411; reference: --verify 411
static class E411 {

 public static Func<int,int> Practice(Func<int,int> transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 411");
 }
 public static Func<int,int> Reference(Func<int,int> transform) {
  ArgumentNullException.ThrowIfNull(transform);return value => checked(transform(value) + 4);
 }
 private static Func<int,int> Solve(Func<int,int> transform) => Check.PracticeMode ? Practice(transform) : Reference(transform);
 public static void Verify() {
  Check.Equal(10, Solve(n=>n*2)(3));
  Check.Equal(4, Solve(n=>0)(99));
  int calls=0;var f=Solve(n=>{calls++;return n;});Check.Equal(0,calls);_ = f(1);Check.Equal(1,calls);
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 412: Delegate composition / scenario 5
// Return a new delegate applying transform then adding5 with checked arithmetic. Do not invoke transform during construction; reject null.
// Hint: A closure captures the transform for later calls.
// Practice: --practice 412; reference: --verify 412
static class E412 {

 public static Func<int,int> Practice(Func<int,int> transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 412");
 }
 public static Func<int,int> Reference(Func<int,int> transform) {
  ArgumentNullException.ThrowIfNull(transform);return value => checked(transform(value) + 5);
 }
 private static Func<int,int> Solve(Func<int,int> transform) => Check.PracticeMode ? Practice(transform) : Reference(transform);
 public static void Verify() {
  Check.Equal(11, Solve(n=>n*2)(3));
  Check.Equal(5, Solve(n=>0)(99));
  int calls=0;var f=Solve(n=>{calls++;return n;});Check.Equal(0,calls);_ = f(1);Check.Equal(1,calls);
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 413: Delegate composition / scenario 6
// Return a new delegate applying transform then adding6 with checked arithmetic. Do not invoke transform during construction; reject null.
// Hint: A closure captures the transform for later calls.
// Practice: --practice 413; reference: --verify 413
static class E413 {

 public static Func<int,int> Practice(Func<int,int> transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 413");
 }
 public static Func<int,int> Reference(Func<int,int> transform) {
  ArgumentNullException.ThrowIfNull(transform);return value => checked(transform(value) + 6);
 }
 private static Func<int,int> Solve(Func<int,int> transform) => Check.PracticeMode ? Practice(transform) : Reference(transform);
 public static void Verify() {
  Check.Equal(12, Solve(n=>n*2)(3));
  Check.Equal(6, Solve(n=>0)(99));
  int calls=0;var f=Solve(n=>{calls++;return n;});Check.Equal(0,calls);_ = f(1);Check.Equal(1,calls);
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 414: Delegate composition / scenario 7
// Return a new delegate applying transform then adding7 with checked arithmetic. Do not invoke transform during construction; reject null.
// Hint: A closure captures the transform for later calls.
// Practice: --practice 414; reference: --verify 414
static class E414 {

 public static Func<int,int> Practice(Func<int,int> transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 414");
 }
 public static Func<int,int> Reference(Func<int,int> transform) {
  ArgumentNullException.ThrowIfNull(transform);return value => checked(transform(value) + 7);
 }
 private static Func<int,int> Solve(Func<int,int> transform) => Check.PracticeMode ? Practice(transform) : Reference(transform);
 public static void Verify() {
  Check.Equal(13, Solve(n=>n*2)(3));
  Check.Equal(7, Solve(n=>0)(99));
  int calls=0;var f=Solve(n=>{calls++;return n;});Check.Equal(0,calls);_ = f(1);Check.Equal(1,calls);
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 415: Delegate composition / scenario 8
// Return a new delegate applying transform then adding8 with checked arithmetic. Do not invoke transform during construction; reject null.
// Hint: A closure captures the transform for later calls.
// Practice: --practice 415; reference: --verify 415
static class E415 {

 public static Func<int,int> Practice(Func<int,int> transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 415");
 }
 public static Func<int,int> Reference(Func<int,int> transform) {
  ArgumentNullException.ThrowIfNull(transform);return value => checked(transform(value) + 8);
 }
 private static Func<int,int> Solve(Func<int,int> transform) => Check.PracticeMode ? Practice(transform) : Reference(transform);
 public static void Verify() {
  Check.Equal(14, Solve(n=>n*2)(3));
  Check.Equal(8, Solve(n=>0)(99));
  int calls=0;var f=Solve(n=>{calls++;return n;});Check.Equal(0,calls);_ = f(1);Check.Equal(1,calls);
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 416: Delegate composition / scenario 9
// Return a new delegate applying transform then adding9 with checked arithmetic. Do not invoke transform during construction; reject null.
// Hint: A closure captures the transform for later calls.
// Practice: --practice 416; reference: --verify 416
static class E416 {

 public static Func<int,int> Practice(Func<int,int> transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 416");
 }
 public static Func<int,int> Reference(Func<int,int> transform) {
  ArgumentNullException.ThrowIfNull(transform);return value => checked(transform(value) + 9);
 }
 private static Func<int,int> Solve(Func<int,int> transform) => Check.PracticeMode ? Practice(transform) : Reference(transform);
 public static void Verify() {
  Check.Equal(15, Solve(n=>n*2)(3));
  Check.Equal(9, Solve(n=>0)(99));
  int calls=0;var f=Solve(n=>{calls++;return n;});Check.Equal(0,calls);_ = f(1);Check.Equal(1,calls);
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 417: Delegate composition / scenario 10
// Return a new delegate applying transform then adding10 with checked arithmetic. Do not invoke transform during construction; reject null.
// Hint: A closure captures the transform for later calls.
// Practice: --practice 417; reference: --verify 417
static class E417 {

 public static Func<int,int> Practice(Func<int,int> transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 417");
 }
 public static Func<int,int> Reference(Func<int,int> transform) {
  ArgumentNullException.ThrowIfNull(transform);return value => checked(transform(value) + 10);
 }
 private static Func<int,int> Solve(Func<int,int> transform) => Check.PracticeMode ? Practice(transform) : Reference(transform);
 public static void Verify() {
  Check.Equal(16, Solve(n=>n*2)(3));
  Check.Equal(10, Solve(n=>0)(99));
  int calls=0;var f=Solve(n=>{calls++;return n;});Check.Equal(0,calls);_ = f(1);Check.Equal(1,calls);
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 418: Delegate composition / scenario 11
// Return a new delegate applying transform then adding11 with checked arithmetic. Do not invoke transform during construction; reject null.
// Hint: A closure captures the transform for later calls.
// Practice: --practice 418; reference: --verify 418
static class E418 {

 public static Func<int,int> Practice(Func<int,int> transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 418");
 }
 public static Func<int,int> Reference(Func<int,int> transform) {
  ArgumentNullException.ThrowIfNull(transform);return value => checked(transform(value) + 11);
 }
 private static Func<int,int> Solve(Func<int,int> transform) => Check.PracticeMode ? Practice(transform) : Reference(transform);
 public static void Verify() {
  Check.Equal(17, Solve(n=>n*2)(3));
  Check.Equal(11, Solve(n=>0)(99));
  int calls=0;var f=Solve(n=>{calls++;return n;});Check.Equal(0,calls);_ = f(1);Check.Equal(1,calls);
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 419: Events and subscription cleanup / scenario 1
// Subscribe to Source.Changed, raise1 through1, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.
// Hint: Removing a named handler requires the same delegate identity.
// Practice: --practice 419; reference: --verify 419
static class E419 {
public sealed class Source { public event Action<int>? Changed; public void Raise(int n)=>Changed?.Invoke(n); }
 public static int Practice() {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 419");
 }
 public static int Reference() {
  var source=new Source();int total=0;void Handler(int n)=>total+=n;source.Changed+=Handler;for(int i=1;i<=1;i++)source.Raise(i);source.Changed-=Handler;source.Raise(1000);return total;
 }
 private static int Solve() => Check.PracticeMode ? Practice() : Reference();
 public static void Verify() {
  Check.Equal(1, Solve());
  Check.Equal(1, Solve());
  var source=new Source();source.Raise(1);Check.True(true);
 }
}

// ======================================================================
// 420: Events and subscription cleanup / scenario 2
// Subscribe to Source.Changed, raise1 through2, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.
// Hint: Removing a named handler requires the same delegate identity.
// Practice: --practice 420; reference: --verify 420
static class E420 {
public sealed class Source { public event Action<int>? Changed; public void Raise(int n)=>Changed?.Invoke(n); }
 public static int Practice() {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 420");
 }
 public static int Reference() {
  var source=new Source();int total=0;void Handler(int n)=>total+=n;source.Changed+=Handler;for(int i=1;i<=2;i++)source.Raise(i);source.Changed-=Handler;source.Raise(1000);return total;
 }
 private static int Solve() => Check.PracticeMode ? Practice() : Reference();
 public static void Verify() {
  Check.Equal(3, Solve());
  Check.Equal(3, Solve());
  var source=new Source();source.Raise(1);Check.True(true);
 }
}

// ======================================================================
// 421: Events and subscription cleanup / scenario 3
// Subscribe to Source.Changed, raise1 through3, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.
// Hint: Removing a named handler requires the same delegate identity.
// Practice: --practice 421; reference: --verify 421
static class E421 {
public sealed class Source { public event Action<int>? Changed; public void Raise(int n)=>Changed?.Invoke(n); }
 public static int Practice() {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 421");
 }
 public static int Reference() {
  var source=new Source();int total=0;void Handler(int n)=>total+=n;source.Changed+=Handler;for(int i=1;i<=3;i++)source.Raise(i);source.Changed-=Handler;source.Raise(1000);return total;
 }
 private static int Solve() => Check.PracticeMode ? Practice() : Reference();
 public static void Verify() {
  Check.Equal(6, Solve());
  Check.Equal(6, Solve());
  var source=new Source();source.Raise(1);Check.True(true);
 }
}

// ======================================================================
// 422: Events and subscription cleanup / scenario 4
// Subscribe to Source.Changed, raise1 through4, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.
// Hint: Removing a named handler requires the same delegate identity.
// Practice: --practice 422; reference: --verify 422
static class E422 {
public sealed class Source { public event Action<int>? Changed; public void Raise(int n)=>Changed?.Invoke(n); }
 public static int Practice() {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 422");
 }
 public static int Reference() {
  var source=new Source();int total=0;void Handler(int n)=>total+=n;source.Changed+=Handler;for(int i=1;i<=4;i++)source.Raise(i);source.Changed-=Handler;source.Raise(1000);return total;
 }
 private static int Solve() => Check.PracticeMode ? Practice() : Reference();
 public static void Verify() {
  Check.Equal(10, Solve());
  Check.Equal(10, Solve());
  var source=new Source();source.Raise(1);Check.True(true);
 }
}

// ======================================================================
// 423: Events and subscription cleanup / scenario 5
// Subscribe to Source.Changed, raise1 through5, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.
// Hint: Removing a named handler requires the same delegate identity.
// Practice: --practice 423; reference: --verify 423
static class E423 {
public sealed class Source { public event Action<int>? Changed; public void Raise(int n)=>Changed?.Invoke(n); }
 public static int Practice() {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 423");
 }
 public static int Reference() {
  var source=new Source();int total=0;void Handler(int n)=>total+=n;source.Changed+=Handler;for(int i=1;i<=5;i++)source.Raise(i);source.Changed-=Handler;source.Raise(1000);return total;
 }
 private static int Solve() => Check.PracticeMode ? Practice() : Reference();
 public static void Verify() {
  Check.Equal(15, Solve());
  Check.Equal(15, Solve());
  var source=new Source();source.Raise(1);Check.True(true);
 }
}

// ======================================================================
// 424: Events and subscription cleanup / scenario 6
// Subscribe to Source.Changed, raise1 through6, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.
// Hint: Removing a named handler requires the same delegate identity.
// Practice: --practice 424; reference: --verify 424
static class E424 {
public sealed class Source { public event Action<int>? Changed; public void Raise(int n)=>Changed?.Invoke(n); }
 public static int Practice() {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 424");
 }
 public static int Reference() {
  var source=new Source();int total=0;void Handler(int n)=>total+=n;source.Changed+=Handler;for(int i=1;i<=6;i++)source.Raise(i);source.Changed-=Handler;source.Raise(1000);return total;
 }
 private static int Solve() => Check.PracticeMode ? Practice() : Reference();
 public static void Verify() {
  Check.Equal(21, Solve());
  Check.Equal(21, Solve());
  var source=new Source();source.Raise(1);Check.True(true);
 }
}

// ======================================================================
// 425: Events and subscription cleanup / scenario 7
// Subscribe to Source.Changed, raise1 through7, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.
// Hint: Removing a named handler requires the same delegate identity.
// Practice: --practice 425; reference: --verify 425
static class E425 {
public sealed class Source { public event Action<int>? Changed; public void Raise(int n)=>Changed?.Invoke(n); }
 public static int Practice() {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 425");
 }
 public static int Reference() {
  var source=new Source();int total=0;void Handler(int n)=>total+=n;source.Changed+=Handler;for(int i=1;i<=7;i++)source.Raise(i);source.Changed-=Handler;source.Raise(1000);return total;
 }
 private static int Solve() => Check.PracticeMode ? Practice() : Reference();
 public static void Verify() {
  Check.Equal(28, Solve());
  Check.Equal(28, Solve());
  var source=new Source();source.Raise(1);Check.True(true);
 }
}

// ======================================================================
// 426: Events and subscription cleanup / scenario 8
// Subscribe to Source.Changed, raise1 through8, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.
// Hint: Removing a named handler requires the same delegate identity.
// Practice: --practice 426; reference: --verify 426
static class E426 {
public sealed class Source { public event Action<int>? Changed; public void Raise(int n)=>Changed?.Invoke(n); }
 public static int Practice() {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 426");
 }
 public static int Reference() {
  var source=new Source();int total=0;void Handler(int n)=>total+=n;source.Changed+=Handler;for(int i=1;i<=8;i++)source.Raise(i);source.Changed-=Handler;source.Raise(1000);return total;
 }
 private static int Solve() => Check.PracticeMode ? Practice() : Reference();
 public static void Verify() {
  Check.Equal(36, Solve());
  Check.Equal(36, Solve());
  var source=new Source();source.Raise(1);Check.True(true);
 }
}

// ======================================================================
// 427: Events and subscription cleanup / scenario 9
// Subscribe to Source.Changed, raise1 through9, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.
// Hint: Removing a named handler requires the same delegate identity.
// Practice: --practice 427; reference: --verify 427
static class E427 {
public sealed class Source { public event Action<int>? Changed; public void Raise(int n)=>Changed?.Invoke(n); }
 public static int Practice() {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 427");
 }
 public static int Reference() {
  var source=new Source();int total=0;void Handler(int n)=>total+=n;source.Changed+=Handler;for(int i=1;i<=9;i++)source.Raise(i);source.Changed-=Handler;source.Raise(1000);return total;
 }
 private static int Solve() => Check.PracticeMode ? Practice() : Reference();
 public static void Verify() {
  Check.Equal(45, Solve());
  Check.Equal(45, Solve());
  var source=new Source();source.Raise(1);Check.True(true);
 }
}

// ======================================================================
// 428: Events and subscription cleanup / scenario 10
// Subscribe to Source.Changed, raise1 through10, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.
// Hint: Removing a named handler requires the same delegate identity.
// Practice: --practice 428; reference: --verify 428
static class E428 {
public sealed class Source { public event Action<int>? Changed; public void Raise(int n)=>Changed?.Invoke(n); }
 public static int Practice() {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 428");
 }
 public static int Reference() {
  var source=new Source();int total=0;void Handler(int n)=>total+=n;source.Changed+=Handler;for(int i=1;i<=10;i++)source.Raise(i);source.Changed-=Handler;source.Raise(1000);return total;
 }
 private static int Solve() => Check.PracticeMode ? Practice() : Reference();
 public static void Verify() {
  Check.Equal(55, Solve());
  Check.Equal(55, Solve());
  var source=new Source();source.Raise(1);Check.True(true);
 }
}

// ======================================================================
// 429: Events and subscription cleanup / scenario 11
// Subscribe to Source.Changed, raise1 through11, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.
// Hint: Removing a named handler requires the same delegate identity.
// Practice: --practice 429; reference: --verify 429
static class E429 {
public sealed class Source { public event Action<int>? Changed; public void Raise(int n)=>Changed?.Invoke(n); }
 public static int Practice() {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 429");
 }
 public static int Reference() {
  var source=new Source();int total=0;void Handler(int n)=>total+=n;source.Changed+=Handler;for(int i=1;i<=11;i++)source.Raise(i);source.Changed-=Handler;source.Raise(1000);return total;
 }
 private static int Solve() => Check.PracticeMode ? Practice() : Reference();
 public static void Verify() {
  Check.Equal(66, Solve());
  Check.Equal(66, Solve());
  var source=new Source();source.Raise(1);Check.True(true);
 }
}

// ======================================================================
// 430: IDisposable and exception safety / scenario 1
// Acquire1 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.
// Hint: using executes cleanup even when its body throws.
// Practice: --practice 430; reference: --verify 430
static class E430 {
public sealed class Lease(Action onDispose):IDisposable { private bool disposed; public void Dispose(){if(disposed)return;disposed=true;onDispose();} }
 public static int Practice(bool fail) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 430");
 }
 public static int Reference(bool fail) {
  int disposed=0;try { for(int i=0;i<1;i++){using var lease=new Lease(()=>disposed++);if(fail&&i==0)throw new InvalidOperationException("simulated");} } catch(InvalidOperationException) { } return disposed;
 }
 private static int Solve(bool fail) => Check.PracticeMode ? Practice(fail) : Reference(fail);
 public static void Verify() {
  Check.Equal(1, Solve(false));
  Check.Equal(1, Solve(true));
  int n=0;var lease=new Lease(()=>n++);lease.Dispose();lease.Dispose();Check.Equal(1,n);
 }
}

// ======================================================================
// 431: IDisposable and exception safety / scenario 2
// Acquire2 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.
// Hint: using executes cleanup even when its body throws.
// Practice: --practice 431; reference: --verify 431
static class E431 {
public sealed class Lease(Action onDispose):IDisposable { private bool disposed; public void Dispose(){if(disposed)return;disposed=true;onDispose();} }
 public static int Practice(bool fail) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 431");
 }
 public static int Reference(bool fail) {
  int disposed=0;try { for(int i=0;i<2;i++){using var lease=new Lease(()=>disposed++);if(fail&&i==0)throw new InvalidOperationException("simulated");} } catch(InvalidOperationException) { } return disposed;
 }
 private static int Solve(bool fail) => Check.PracticeMode ? Practice(fail) : Reference(fail);
 public static void Verify() {
  Check.Equal(2, Solve(false));
  Check.Equal(1, Solve(true));
  int n=0;var lease=new Lease(()=>n++);lease.Dispose();lease.Dispose();Check.Equal(1,n);
 }
}

// ======================================================================
// 432: IDisposable and exception safety / scenario 3
// Acquire3 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.
// Hint: using executes cleanup even when its body throws.
// Practice: --practice 432; reference: --verify 432
static class E432 {
public sealed class Lease(Action onDispose):IDisposable { private bool disposed; public void Dispose(){if(disposed)return;disposed=true;onDispose();} }
 public static int Practice(bool fail) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 432");
 }
 public static int Reference(bool fail) {
  int disposed=0;try { for(int i=0;i<3;i++){using var lease=new Lease(()=>disposed++);if(fail&&i==0)throw new InvalidOperationException("simulated");} } catch(InvalidOperationException) { } return disposed;
 }
 private static int Solve(bool fail) => Check.PracticeMode ? Practice(fail) : Reference(fail);
 public static void Verify() {
  Check.Equal(3, Solve(false));
  Check.Equal(1, Solve(true));
  int n=0;var lease=new Lease(()=>n++);lease.Dispose();lease.Dispose();Check.Equal(1,n);
 }
}

// ======================================================================
// 433: IDisposable and exception safety / scenario 4
// Acquire4 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.
// Hint: using executes cleanup even when its body throws.
// Practice: --practice 433; reference: --verify 433
static class E433 {
public sealed class Lease(Action onDispose):IDisposable { private bool disposed; public void Dispose(){if(disposed)return;disposed=true;onDispose();} }
 public static int Practice(bool fail) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 433");
 }
 public static int Reference(bool fail) {
  int disposed=0;try { for(int i=0;i<4;i++){using var lease=new Lease(()=>disposed++);if(fail&&i==0)throw new InvalidOperationException("simulated");} } catch(InvalidOperationException) { } return disposed;
 }
 private static int Solve(bool fail) => Check.PracticeMode ? Practice(fail) : Reference(fail);
 public static void Verify() {
  Check.Equal(4, Solve(false));
  Check.Equal(1, Solve(true));
  int n=0;var lease=new Lease(()=>n++);lease.Dispose();lease.Dispose();Check.Equal(1,n);
 }
}

// ======================================================================
// 434: IDisposable and exception safety / scenario 5
// Acquire5 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.
// Hint: using executes cleanup even when its body throws.
// Practice: --practice 434; reference: --verify 434
static class E434 {
public sealed class Lease(Action onDispose):IDisposable { private bool disposed; public void Dispose(){if(disposed)return;disposed=true;onDispose();} }
 public static int Practice(bool fail) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 434");
 }
 public static int Reference(bool fail) {
  int disposed=0;try { for(int i=0;i<5;i++){using var lease=new Lease(()=>disposed++);if(fail&&i==0)throw new InvalidOperationException("simulated");} } catch(InvalidOperationException) { } return disposed;
 }
 private static int Solve(bool fail) => Check.PracticeMode ? Practice(fail) : Reference(fail);
 public static void Verify() {
  Check.Equal(5, Solve(false));
  Check.Equal(1, Solve(true));
  int n=0;var lease=new Lease(()=>n++);lease.Dispose();lease.Dispose();Check.Equal(1,n);
 }
}

// ======================================================================
// 435: IDisposable and exception safety / scenario 6
// Acquire6 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.
// Hint: using executes cleanup even when its body throws.
// Practice: --practice 435; reference: --verify 435
static class E435 {
public sealed class Lease(Action onDispose):IDisposable { private bool disposed; public void Dispose(){if(disposed)return;disposed=true;onDispose();} }
 public static int Practice(bool fail) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 435");
 }
 public static int Reference(bool fail) {
  int disposed=0;try { for(int i=0;i<6;i++){using var lease=new Lease(()=>disposed++);if(fail&&i==0)throw new InvalidOperationException("simulated");} } catch(InvalidOperationException) { } return disposed;
 }
 private static int Solve(bool fail) => Check.PracticeMode ? Practice(fail) : Reference(fail);
 public static void Verify() {
  Check.Equal(6, Solve(false));
  Check.Equal(1, Solve(true));
  int n=0;var lease=new Lease(()=>n++);lease.Dispose();lease.Dispose();Check.Equal(1,n);
 }
}

// ======================================================================
// 436: IDisposable and exception safety / scenario 7
// Acquire7 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.
// Hint: using executes cleanup even when its body throws.
// Practice: --practice 436; reference: --verify 436
static class E436 {
public sealed class Lease(Action onDispose):IDisposable { private bool disposed; public void Dispose(){if(disposed)return;disposed=true;onDispose();} }
 public static int Practice(bool fail) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 436");
 }
 public static int Reference(bool fail) {
  int disposed=0;try { for(int i=0;i<7;i++){using var lease=new Lease(()=>disposed++);if(fail&&i==0)throw new InvalidOperationException("simulated");} } catch(InvalidOperationException) { } return disposed;
 }
 private static int Solve(bool fail) => Check.PracticeMode ? Practice(fail) : Reference(fail);
 public static void Verify() {
  Check.Equal(7, Solve(false));
  Check.Equal(1, Solve(true));
  int n=0;var lease=new Lease(()=>n++);lease.Dispose();lease.Dispose();Check.Equal(1,n);
 }
}

// ======================================================================
// 437: IDisposable and exception safety / scenario 8
// Acquire8 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.
// Hint: using executes cleanup even when its body throws.
// Practice: --practice 437; reference: --verify 437
static class E437 {
public sealed class Lease(Action onDispose):IDisposable { private bool disposed; public void Dispose(){if(disposed)return;disposed=true;onDispose();} }
 public static int Practice(bool fail) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 437");
 }
 public static int Reference(bool fail) {
  int disposed=0;try { for(int i=0;i<8;i++){using var lease=new Lease(()=>disposed++);if(fail&&i==0)throw new InvalidOperationException("simulated");} } catch(InvalidOperationException) { } return disposed;
 }
 private static int Solve(bool fail) => Check.PracticeMode ? Practice(fail) : Reference(fail);
 public static void Verify() {
  Check.Equal(8, Solve(false));
  Check.Equal(1, Solve(true));
  int n=0;var lease=new Lease(()=>n++);lease.Dispose();lease.Dispose();Check.Equal(1,n);
 }
}

// ======================================================================
// 438: IDisposable and exception safety / scenario 9
// Acquire9 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.
// Hint: using executes cleanup even when its body throws.
// Practice: --practice 438; reference: --verify 438
static class E438 {
public sealed class Lease(Action onDispose):IDisposable { private bool disposed; public void Dispose(){if(disposed)return;disposed=true;onDispose();} }
 public static int Practice(bool fail) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 438");
 }
 public static int Reference(bool fail) {
  int disposed=0;try { for(int i=0;i<9;i++){using var lease=new Lease(()=>disposed++);if(fail&&i==0)throw new InvalidOperationException("simulated");} } catch(InvalidOperationException) { } return disposed;
 }
 private static int Solve(bool fail) => Check.PracticeMode ? Practice(fail) : Reference(fail);
 public static void Verify() {
  Check.Equal(9, Solve(false));
  Check.Equal(1, Solve(true));
  int n=0;var lease=new Lease(()=>n++);lease.Dispose();lease.Dispose();Check.Equal(1,n);
 }
}

// ======================================================================
// 439: IDisposable and exception safety / scenario 10
// Acquire10 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.
// Hint: using executes cleanup even when its body throws.
// Practice: --practice 439; reference: --verify 439
static class E439 {
public sealed class Lease(Action onDispose):IDisposable { private bool disposed; public void Dispose(){if(disposed)return;disposed=true;onDispose();} }
 public static int Practice(bool fail) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 439");
 }
 public static int Reference(bool fail) {
  int disposed=0;try { for(int i=0;i<10;i++){using var lease=new Lease(()=>disposed++);if(fail&&i==0)throw new InvalidOperationException("simulated");} } catch(InvalidOperationException) { } return disposed;
 }
 private static int Solve(bool fail) => Check.PracticeMode ? Practice(fail) : Reference(fail);
 public static void Verify() {
  Check.Equal(10, Solve(false));
  Check.Equal(1, Solve(true));
  int n=0;var lease=new Lease(()=>n++);lease.Dispose();lease.Dispose();Check.Equal(1,n);
 }
}

// ======================================================================
// 440: IDisposable and exception safety / scenario 11
// Acquire11 Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.
// Hint: using executes cleanup even when its body throws.
// Practice: --practice 440; reference: --verify 440
static class E440 {
public sealed class Lease(Action onDispose):IDisposable { private bool disposed; public void Dispose(){if(disposed)return;disposed=true;onDispose();} }
 public static int Practice(bool fail) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 440");
 }
 public static int Reference(bool fail) {
  int disposed=0;try { for(int i=0;i<11;i++){using var lease=new Lease(()=>disposed++);if(fail&&i==0)throw new InvalidOperationException("simulated");} } catch(InvalidOperationException) { } return disposed;
 }
 private static int Solve(bool fail) => Check.PracticeMode ? Practice(fail) : Reference(fail);
 public static void Verify() {
  Check.Equal(11, Solve(false));
  Check.Equal(1, Solve(true));
  int n=0;var lease=new Lease(()=>n++);lease.Dispose();lease.Dispose();Check.Equal(1,n);
 }
}

// ======================================================================
// 441: Interface-based strategy injection / scenario 1
// Call injected ITransform for each value and add1 using checked arithmetic. Return array in order; reject null strategy.
// Hint: An interface lets tests inject behavior without inheritance from a concrete service.
// Practice: --practice 441; reference: --verify 441
static class E441 {
public interface ITransform { int Apply(int value); } public sealed class DoubleTransform:ITransform { public int Apply(int value)=>checked(value*2); }
 public static int[] Practice(IEnumerable<int> values,ITransform transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 441");
 }
 public static int[] Reference(IEnumerable<int> values,ITransform transform) {
  ArgumentNullException.ThrowIfNull(transform);return values.Select(n=>checked(transform.Apply(n)+1)).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values,ITransform transform) => Check.PracticeMode ? Practice(values, transform) : Reference(values, transform);
 public static void Verify() {
  Check.Equal(new int[] { 3, 5 }, Solve(new[] { 1,2 },new DoubleTransform()));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),new DoubleTransform()));
  Check.Throws<ArgumentNullException>(() => { Solve(new[] { 1 },null!); });
 }
}

// ======================================================================
// 442: Interface-based strategy injection / scenario 2
// Call injected ITransform for each value and add2 using checked arithmetic. Return array in order; reject null strategy.
// Hint: An interface lets tests inject behavior without inheritance from a concrete service.
// Practice: --practice 442; reference: --verify 442
static class E442 {
public interface ITransform { int Apply(int value); } public sealed class DoubleTransform:ITransform { public int Apply(int value)=>checked(value*2); }
 public static int[] Practice(IEnumerable<int> values,ITransform transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 442");
 }
 public static int[] Reference(IEnumerable<int> values,ITransform transform) {
  ArgumentNullException.ThrowIfNull(transform);return values.Select(n=>checked(transform.Apply(n)+2)).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values,ITransform transform) => Check.PracticeMode ? Practice(values, transform) : Reference(values, transform);
 public static void Verify() {
  Check.Equal(new int[] { 4, 6 }, Solve(new[] { 1,2 },new DoubleTransform()));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),new DoubleTransform()));
  Check.Throws<ArgumentNullException>(() => { Solve(new[] { 1 },null!); });
 }
}

// ======================================================================
// 443: Interface-based strategy injection / scenario 3
// Call injected ITransform for each value and add3 using checked arithmetic. Return array in order; reject null strategy.
// Hint: An interface lets tests inject behavior without inheritance from a concrete service.
// Practice: --practice 443; reference: --verify 443
static class E443 {
public interface ITransform { int Apply(int value); } public sealed class DoubleTransform:ITransform { public int Apply(int value)=>checked(value*2); }
 public static int[] Practice(IEnumerable<int> values,ITransform transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 443");
 }
 public static int[] Reference(IEnumerable<int> values,ITransform transform) {
  ArgumentNullException.ThrowIfNull(transform);return values.Select(n=>checked(transform.Apply(n)+3)).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values,ITransform transform) => Check.PracticeMode ? Practice(values, transform) : Reference(values, transform);
 public static void Verify() {
  Check.Equal(new int[] { 5, 7 }, Solve(new[] { 1,2 },new DoubleTransform()));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),new DoubleTransform()));
  Check.Throws<ArgumentNullException>(() => { Solve(new[] { 1 },null!); });
 }
}

// ======================================================================
// 444: Interface-based strategy injection / scenario 4
// Call injected ITransform for each value and add4 using checked arithmetic. Return array in order; reject null strategy.
// Hint: An interface lets tests inject behavior without inheritance from a concrete service.
// Practice: --practice 444; reference: --verify 444
static class E444 {
public interface ITransform { int Apply(int value); } public sealed class DoubleTransform:ITransform { public int Apply(int value)=>checked(value*2); }
 public static int[] Practice(IEnumerable<int> values,ITransform transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 444");
 }
 public static int[] Reference(IEnumerable<int> values,ITransform transform) {
  ArgumentNullException.ThrowIfNull(transform);return values.Select(n=>checked(transform.Apply(n)+4)).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values,ITransform transform) => Check.PracticeMode ? Practice(values, transform) : Reference(values, transform);
 public static void Verify() {
  Check.Equal(new int[] { 6, 8 }, Solve(new[] { 1,2 },new DoubleTransform()));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),new DoubleTransform()));
  Check.Throws<ArgumentNullException>(() => { Solve(new[] { 1 },null!); });
 }
}

// ======================================================================
// 445: Interface-based strategy injection / scenario 5
// Call injected ITransform for each value and add5 using checked arithmetic. Return array in order; reject null strategy.
// Hint: An interface lets tests inject behavior without inheritance from a concrete service.
// Practice: --practice 445; reference: --verify 445
static class E445 {
public interface ITransform { int Apply(int value); } public sealed class DoubleTransform:ITransform { public int Apply(int value)=>checked(value*2); }
 public static int[] Practice(IEnumerable<int> values,ITransform transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 445");
 }
 public static int[] Reference(IEnumerable<int> values,ITransform transform) {
  ArgumentNullException.ThrowIfNull(transform);return values.Select(n=>checked(transform.Apply(n)+5)).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values,ITransform transform) => Check.PracticeMode ? Practice(values, transform) : Reference(values, transform);
 public static void Verify() {
  Check.Equal(new int[] { 7, 9 }, Solve(new[] { 1,2 },new DoubleTransform()));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),new DoubleTransform()));
  Check.Throws<ArgumentNullException>(() => { Solve(new[] { 1 },null!); });
 }
}

// ======================================================================
// 446: Interface-based strategy injection / scenario 6
// Call injected ITransform for each value and add6 using checked arithmetic. Return array in order; reject null strategy.
// Hint: An interface lets tests inject behavior without inheritance from a concrete service.
// Practice: --practice 446; reference: --verify 446
static class E446 {
public interface ITransform { int Apply(int value); } public sealed class DoubleTransform:ITransform { public int Apply(int value)=>checked(value*2); }
 public static int[] Practice(IEnumerable<int> values,ITransform transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 446");
 }
 public static int[] Reference(IEnumerable<int> values,ITransform transform) {
  ArgumentNullException.ThrowIfNull(transform);return values.Select(n=>checked(transform.Apply(n)+6)).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values,ITransform transform) => Check.PracticeMode ? Practice(values, transform) : Reference(values, transform);
 public static void Verify() {
  Check.Equal(new int[] { 8, 10 }, Solve(new[] { 1,2 },new DoubleTransform()));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),new DoubleTransform()));
  Check.Throws<ArgumentNullException>(() => { Solve(new[] { 1 },null!); });
 }
}

// ======================================================================
// 447: Interface-based strategy injection / scenario 7
// Call injected ITransform for each value and add7 using checked arithmetic. Return array in order; reject null strategy.
// Hint: An interface lets tests inject behavior without inheritance from a concrete service.
// Practice: --practice 447; reference: --verify 447
static class E447 {
public interface ITransform { int Apply(int value); } public sealed class DoubleTransform:ITransform { public int Apply(int value)=>checked(value*2); }
 public static int[] Practice(IEnumerable<int> values,ITransform transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 447");
 }
 public static int[] Reference(IEnumerable<int> values,ITransform transform) {
  ArgumentNullException.ThrowIfNull(transform);return values.Select(n=>checked(transform.Apply(n)+7)).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values,ITransform transform) => Check.PracticeMode ? Practice(values, transform) : Reference(values, transform);
 public static void Verify() {
  Check.Equal(new int[] { 9, 11 }, Solve(new[] { 1,2 },new DoubleTransform()));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),new DoubleTransform()));
  Check.Throws<ArgumentNullException>(() => { Solve(new[] { 1 },null!); });
 }
}

// ======================================================================
// 448: Interface-based strategy injection / scenario 8
// Call injected ITransform for each value and add8 using checked arithmetic. Return array in order; reject null strategy.
// Hint: An interface lets tests inject behavior without inheritance from a concrete service.
// Practice: --practice 448; reference: --verify 448
static class E448 {
public interface ITransform { int Apply(int value); } public sealed class DoubleTransform:ITransform { public int Apply(int value)=>checked(value*2); }
 public static int[] Practice(IEnumerable<int> values,ITransform transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 448");
 }
 public static int[] Reference(IEnumerable<int> values,ITransform transform) {
  ArgumentNullException.ThrowIfNull(transform);return values.Select(n=>checked(transform.Apply(n)+8)).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values,ITransform transform) => Check.PracticeMode ? Practice(values, transform) : Reference(values, transform);
 public static void Verify() {
  Check.Equal(new int[] { 10, 12 }, Solve(new[] { 1,2 },new DoubleTransform()));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),new DoubleTransform()));
  Check.Throws<ArgumentNullException>(() => { Solve(new[] { 1 },null!); });
 }
}

// ======================================================================
// 449: Interface-based strategy injection / scenario 9
// Call injected ITransform for each value and add9 using checked arithmetic. Return array in order; reject null strategy.
// Hint: An interface lets tests inject behavior without inheritance from a concrete service.
// Practice: --practice 449; reference: --verify 449
static class E449 {
public interface ITransform { int Apply(int value); } public sealed class DoubleTransform:ITransform { public int Apply(int value)=>checked(value*2); }
 public static int[] Practice(IEnumerable<int> values,ITransform transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 449");
 }
 public static int[] Reference(IEnumerable<int> values,ITransform transform) {
  ArgumentNullException.ThrowIfNull(transform);return values.Select(n=>checked(transform.Apply(n)+9)).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values,ITransform transform) => Check.PracticeMode ? Practice(values, transform) : Reference(values, transform);
 public static void Verify() {
  Check.Equal(new int[] { 11, 13 }, Solve(new[] { 1,2 },new DoubleTransform()));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),new DoubleTransform()));
  Check.Throws<ArgumentNullException>(() => { Solve(new[] { 1 },null!); });
 }
}

// ======================================================================
// 450: Interface-based strategy injection / scenario 10
// Call injected ITransform for each value and add10 using checked arithmetic. Return array in order; reject null strategy.
// Hint: An interface lets tests inject behavior without inheritance from a concrete service.
// Practice: --practice 450; reference: --verify 450
static class E450 {
public interface ITransform { int Apply(int value); } public sealed class DoubleTransform:ITransform { public int Apply(int value)=>checked(value*2); }
 public static int[] Practice(IEnumerable<int> values,ITransform transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 450");
 }
 public static int[] Reference(IEnumerable<int> values,ITransform transform) {
  ArgumentNullException.ThrowIfNull(transform);return values.Select(n=>checked(transform.Apply(n)+10)).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values,ITransform transform) => Check.PracticeMode ? Practice(values, transform) : Reference(values, transform);
 public static void Verify() {
  Check.Equal(new int[] { 12, 14 }, Solve(new[] { 1,2 },new DoubleTransform()));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),new DoubleTransform()));
  Check.Throws<ArgumentNullException>(() => { Solve(new[] { 1 },null!); });
 }
}

// ======================================================================
// 451: Interface-based strategy injection / scenario 11
// Call injected ITransform for each value and add11 using checked arithmetic. Return array in order; reject null strategy.
// Hint: An interface lets tests inject behavior without inheritance from a concrete service.
// Practice: --practice 451; reference: --verify 451
static class E451 {
public interface ITransform { int Apply(int value); } public sealed class DoubleTransform:ITransform { public int Apply(int value)=>checked(value*2); }
 public static int[] Practice(IEnumerable<int> values,ITransform transform) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 451");
 }
 public static int[] Reference(IEnumerable<int> values,ITransform transform) {
  ArgumentNullException.ThrowIfNull(transform);return values.Select(n=>checked(transform.Apply(n)+11)).ToArray();
 }
 private static int[] Solve(IEnumerable<int> values,ITransform transform) => Check.PracticeMode ? Practice(values, transform) : Reference(values, transform);
 public static void Verify() {
  Check.Equal(new int[] { 13, 15 }, Solve(new[] { 1,2 },new DoubleTransform()));
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),new DoubleTransform()));
  Check.Throws<ArgumentNullException>(() => { Solve(new[] { 1 },null!); });
 }
}

// ======================================================================
// 452: Virtual dispatch and inheritance / scenario 1
// Call virtual Describe through an Animal reference, then append /1. Dog must override description. Null throws ArgumentNullException.
// Hint: Virtual dispatch chooses implementation from runtime type.
// Practice: --practice 452; reference: --verify 452
static class E452 {
public class Animal(string name) { protected string Name { get; }=name; public virtual string Describe()=>"animal:"+Name; } public sealed class Dog(string name):Animal(name) { public override string Describe()=>"dog:"+Name; }
 public static string Practice(Animal animal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 452");
 }
 public static string Reference(Animal animal) {
  ArgumentNullException.ThrowIfNull(animal);return animal.Describe()+"/1";
 }
 private static string Solve(Animal animal) => Check.PracticeMode ? Practice(animal) : Reference(animal);
 public static void Verify() {
  Check.Equal("animal:A/1", Solve(new Animal("A")));
  Check.Equal("dog:Rex/1", Solve(new Dog("Rex")));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 453: Virtual dispatch and inheritance / scenario 2
// Call virtual Describe through an Animal reference, then append /2. Dog must override description. Null throws ArgumentNullException.
// Hint: Virtual dispatch chooses implementation from runtime type.
// Practice: --practice 453; reference: --verify 453
static class E453 {
public class Animal(string name) { protected string Name { get; }=name; public virtual string Describe()=>"animal:"+Name; } public sealed class Dog(string name):Animal(name) { public override string Describe()=>"dog:"+Name; }
 public static string Practice(Animal animal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 453");
 }
 public static string Reference(Animal animal) {
  ArgumentNullException.ThrowIfNull(animal);return animal.Describe()+"/2";
 }
 private static string Solve(Animal animal) => Check.PracticeMode ? Practice(animal) : Reference(animal);
 public static void Verify() {
  Check.Equal("animal:A/2", Solve(new Animal("A")));
  Check.Equal("dog:Rex/2", Solve(new Dog("Rex")));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 454: Virtual dispatch and inheritance / scenario 3
// Call virtual Describe through an Animal reference, then append /3. Dog must override description. Null throws ArgumentNullException.
// Hint: Virtual dispatch chooses implementation from runtime type.
// Practice: --practice 454; reference: --verify 454
static class E454 {
public class Animal(string name) { protected string Name { get; }=name; public virtual string Describe()=>"animal:"+Name; } public sealed class Dog(string name):Animal(name) { public override string Describe()=>"dog:"+Name; }
 public static string Practice(Animal animal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 454");
 }
 public static string Reference(Animal animal) {
  ArgumentNullException.ThrowIfNull(animal);return animal.Describe()+"/3";
 }
 private static string Solve(Animal animal) => Check.PracticeMode ? Practice(animal) : Reference(animal);
 public static void Verify() {
  Check.Equal("animal:A/3", Solve(new Animal("A")));
  Check.Equal("dog:Rex/3", Solve(new Dog("Rex")));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 455: Virtual dispatch and inheritance / scenario 4
// Call virtual Describe through an Animal reference, then append /4. Dog must override description. Null throws ArgumentNullException.
// Hint: Virtual dispatch chooses implementation from runtime type.
// Practice: --practice 455; reference: --verify 455
static class E455 {
public class Animal(string name) { protected string Name { get; }=name; public virtual string Describe()=>"animal:"+Name; } public sealed class Dog(string name):Animal(name) { public override string Describe()=>"dog:"+Name; }
 public static string Practice(Animal animal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 455");
 }
 public static string Reference(Animal animal) {
  ArgumentNullException.ThrowIfNull(animal);return animal.Describe()+"/4";
 }
 private static string Solve(Animal animal) => Check.PracticeMode ? Practice(animal) : Reference(animal);
 public static void Verify() {
  Check.Equal("animal:A/4", Solve(new Animal("A")));
  Check.Equal("dog:Rex/4", Solve(new Dog("Rex")));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 456: Virtual dispatch and inheritance / scenario 5
// Call virtual Describe through an Animal reference, then append /5. Dog must override description. Null throws ArgumentNullException.
// Hint: Virtual dispatch chooses implementation from runtime type.
// Practice: --practice 456; reference: --verify 456
static class E456 {
public class Animal(string name) { protected string Name { get; }=name; public virtual string Describe()=>"animal:"+Name; } public sealed class Dog(string name):Animal(name) { public override string Describe()=>"dog:"+Name; }
 public static string Practice(Animal animal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 456");
 }
 public static string Reference(Animal animal) {
  ArgumentNullException.ThrowIfNull(animal);return animal.Describe()+"/5";
 }
 private static string Solve(Animal animal) => Check.PracticeMode ? Practice(animal) : Reference(animal);
 public static void Verify() {
  Check.Equal("animal:A/5", Solve(new Animal("A")));
  Check.Equal("dog:Rex/5", Solve(new Dog("Rex")));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 457: Virtual dispatch and inheritance / scenario 6
// Call virtual Describe through an Animal reference, then append /6. Dog must override description. Null throws ArgumentNullException.
// Hint: Virtual dispatch chooses implementation from runtime type.
// Practice: --practice 457; reference: --verify 457
static class E457 {
public class Animal(string name) { protected string Name { get; }=name; public virtual string Describe()=>"animal:"+Name; } public sealed class Dog(string name):Animal(name) { public override string Describe()=>"dog:"+Name; }
 public static string Practice(Animal animal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 457");
 }
 public static string Reference(Animal animal) {
  ArgumentNullException.ThrowIfNull(animal);return animal.Describe()+"/6";
 }
 private static string Solve(Animal animal) => Check.PracticeMode ? Practice(animal) : Reference(animal);
 public static void Verify() {
  Check.Equal("animal:A/6", Solve(new Animal("A")));
  Check.Equal("dog:Rex/6", Solve(new Dog("Rex")));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 458: Virtual dispatch and inheritance / scenario 7
// Call virtual Describe through an Animal reference, then append /7. Dog must override description. Null throws ArgumentNullException.
// Hint: Virtual dispatch chooses implementation from runtime type.
// Practice: --practice 458; reference: --verify 458
static class E458 {
public class Animal(string name) { protected string Name { get; }=name; public virtual string Describe()=>"animal:"+Name; } public sealed class Dog(string name):Animal(name) { public override string Describe()=>"dog:"+Name; }
 public static string Practice(Animal animal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 458");
 }
 public static string Reference(Animal animal) {
  ArgumentNullException.ThrowIfNull(animal);return animal.Describe()+"/7";
 }
 private static string Solve(Animal animal) => Check.PracticeMode ? Practice(animal) : Reference(animal);
 public static void Verify() {
  Check.Equal("animal:A/7", Solve(new Animal("A")));
  Check.Equal("dog:Rex/7", Solve(new Dog("Rex")));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 459: Virtual dispatch and inheritance / scenario 8
// Call virtual Describe through an Animal reference, then append /8. Dog must override description. Null throws ArgumentNullException.
// Hint: Virtual dispatch chooses implementation from runtime type.
// Practice: --practice 459; reference: --verify 459
static class E459 {
public class Animal(string name) { protected string Name { get; }=name; public virtual string Describe()=>"animal:"+Name; } public sealed class Dog(string name):Animal(name) { public override string Describe()=>"dog:"+Name; }
 public static string Practice(Animal animal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 459");
 }
 public static string Reference(Animal animal) {
  ArgumentNullException.ThrowIfNull(animal);return animal.Describe()+"/8";
 }
 private static string Solve(Animal animal) => Check.PracticeMode ? Practice(animal) : Reference(animal);
 public static void Verify() {
  Check.Equal("animal:A/8", Solve(new Animal("A")));
  Check.Equal("dog:Rex/8", Solve(new Dog("Rex")));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 460: Virtual dispatch and inheritance / scenario 9
// Call virtual Describe through an Animal reference, then append /9. Dog must override description. Null throws ArgumentNullException.
// Hint: Virtual dispatch chooses implementation from runtime type.
// Practice: --practice 460; reference: --verify 460
static class E460 {
public class Animal(string name) { protected string Name { get; }=name; public virtual string Describe()=>"animal:"+Name; } public sealed class Dog(string name):Animal(name) { public override string Describe()=>"dog:"+Name; }
 public static string Practice(Animal animal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 460");
 }
 public static string Reference(Animal animal) {
  ArgumentNullException.ThrowIfNull(animal);return animal.Describe()+"/9";
 }
 private static string Solve(Animal animal) => Check.PracticeMode ? Practice(animal) : Reference(animal);
 public static void Verify() {
  Check.Equal("animal:A/9", Solve(new Animal("A")));
  Check.Equal("dog:Rex/9", Solve(new Dog("Rex")));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 461: Virtual dispatch and inheritance / scenario 10
// Call virtual Describe through an Animal reference, then append /10. Dog must override description. Null throws ArgumentNullException.
// Hint: Virtual dispatch chooses implementation from runtime type.
// Practice: --practice 461; reference: --verify 461
static class E461 {
public class Animal(string name) { protected string Name { get; }=name; public virtual string Describe()=>"animal:"+Name; } public sealed class Dog(string name):Animal(name) { public override string Describe()=>"dog:"+Name; }
 public static string Practice(Animal animal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 461");
 }
 public static string Reference(Animal animal) {
  ArgumentNullException.ThrowIfNull(animal);return animal.Describe()+"/10";
 }
 private static string Solve(Animal animal) => Check.PracticeMode ? Practice(animal) : Reference(animal);
 public static void Verify() {
  Check.Equal("animal:A/10", Solve(new Animal("A")));
  Check.Equal("dog:Rex/10", Solve(new Dog("Rex")));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 462: Virtual dispatch and inheritance / scenario 11
// Call virtual Describe through an Animal reference, then append /11. Dog must override description. Null throws ArgumentNullException.
// Hint: Virtual dispatch chooses implementation from runtime type.
// Practice: --practice 462; reference: --verify 462
static class E462 {
public class Animal(string name) { protected string Name { get; }=name; public virtual string Describe()=>"animal:"+Name; } public sealed class Dog(string name):Animal(name) { public override string Describe()=>"dog:"+Name; }
 public static string Practice(Animal animal) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 462");
 }
 public static string Reference(Animal animal) {
  ArgumentNullException.ThrowIfNull(animal);return animal.Describe()+"/11";
 }
 private static string Solve(Animal animal) => Check.PracticeMode ? Practice(animal) : Reference(animal);
 public static void Verify() {
  Check.Equal("animal:A/11", Solve(new Animal("A")));
  Check.Equal("dog:Rex/11", Solve(new Dog("Rex")));
  Check.Throws<ArgumentNullException>(() => { Solve(null!); });
 }
}

// ======================================================================
// 463: Async Task result composition / scenario 1
// Await operation then add1. Propagate operation exceptions; reject null. Never use Result or Wait.
// Hint: await unwraps the result and preserves exception types.
// Practice: --practice 463; reference: --verify 463
static class E463 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 463");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  ArgumentNullException.ThrowIfNull(operation);int result=await operation().ConfigureAwait(false);return checked(result+1);
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(4, Solve(()=>Task.FromResult(3)).GetAwaiter().GetResult());
  Check.Equal(1, Solve(async()=>{await Task.Yield();return 0;}).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(()=>Task.FromException<int>(new InvalidOperationException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 464: Async Task result composition / scenario 2
// Await operation then add2. Propagate operation exceptions; reject null. Never use Result or Wait.
// Hint: await unwraps the result and preserves exception types.
// Practice: --practice 464; reference: --verify 464
static class E464 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 464");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  ArgumentNullException.ThrowIfNull(operation);int result=await operation().ConfigureAwait(false);return checked(result+2);
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(5, Solve(()=>Task.FromResult(3)).GetAwaiter().GetResult());
  Check.Equal(2, Solve(async()=>{await Task.Yield();return 0;}).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(()=>Task.FromException<int>(new InvalidOperationException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 465: Async Task result composition / scenario 3
// Await operation then add3. Propagate operation exceptions; reject null. Never use Result or Wait.
// Hint: await unwraps the result and preserves exception types.
// Practice: --practice 465; reference: --verify 465
static class E465 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 465");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  ArgumentNullException.ThrowIfNull(operation);int result=await operation().ConfigureAwait(false);return checked(result+3);
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(6, Solve(()=>Task.FromResult(3)).GetAwaiter().GetResult());
  Check.Equal(3, Solve(async()=>{await Task.Yield();return 0;}).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(()=>Task.FromException<int>(new InvalidOperationException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 466: Async Task result composition / scenario 4
// Await operation then add4. Propagate operation exceptions; reject null. Never use Result or Wait.
// Hint: await unwraps the result and preserves exception types.
// Practice: --practice 466; reference: --verify 466
static class E466 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 466");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  ArgumentNullException.ThrowIfNull(operation);int result=await operation().ConfigureAwait(false);return checked(result+4);
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(7, Solve(()=>Task.FromResult(3)).GetAwaiter().GetResult());
  Check.Equal(4, Solve(async()=>{await Task.Yield();return 0;}).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(()=>Task.FromException<int>(new InvalidOperationException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 467: Async Task result composition / scenario 5
// Await operation then add5. Propagate operation exceptions; reject null. Never use Result or Wait.
// Hint: await unwraps the result and preserves exception types.
// Practice: --practice 467; reference: --verify 467
static class E467 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 467");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  ArgumentNullException.ThrowIfNull(operation);int result=await operation().ConfigureAwait(false);return checked(result+5);
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(8, Solve(()=>Task.FromResult(3)).GetAwaiter().GetResult());
  Check.Equal(5, Solve(async()=>{await Task.Yield();return 0;}).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(()=>Task.FromException<int>(new InvalidOperationException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 468: Async Task result composition / scenario 6
// Await operation then add6. Propagate operation exceptions; reject null. Never use Result or Wait.
// Hint: await unwraps the result and preserves exception types.
// Practice: --practice 468; reference: --verify 468
static class E468 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 468");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  ArgumentNullException.ThrowIfNull(operation);int result=await operation().ConfigureAwait(false);return checked(result+6);
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(9, Solve(()=>Task.FromResult(3)).GetAwaiter().GetResult());
  Check.Equal(6, Solve(async()=>{await Task.Yield();return 0;}).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(()=>Task.FromException<int>(new InvalidOperationException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 469: Async Task result composition / scenario 7
// Await operation then add7. Propagate operation exceptions; reject null. Never use Result or Wait.
// Hint: await unwraps the result and preserves exception types.
// Practice: --practice 469; reference: --verify 469
static class E469 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 469");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  ArgumentNullException.ThrowIfNull(operation);int result=await operation().ConfigureAwait(false);return checked(result+7);
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(10, Solve(()=>Task.FromResult(3)).GetAwaiter().GetResult());
  Check.Equal(7, Solve(async()=>{await Task.Yield();return 0;}).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(()=>Task.FromException<int>(new InvalidOperationException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 470: Async Task result composition / scenario 8
// Await operation then add8. Propagate operation exceptions; reject null. Never use Result or Wait.
// Hint: await unwraps the result and preserves exception types.
// Practice: --practice 470; reference: --verify 470
static class E470 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 470");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  ArgumentNullException.ThrowIfNull(operation);int result=await operation().ConfigureAwait(false);return checked(result+8);
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(11, Solve(()=>Task.FromResult(3)).GetAwaiter().GetResult());
  Check.Equal(8, Solve(async()=>{await Task.Yield();return 0;}).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(()=>Task.FromException<int>(new InvalidOperationException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 471: Async Task result composition / scenario 9
// Await operation then add9. Propagate operation exceptions; reject null. Never use Result or Wait.
// Hint: await unwraps the result and preserves exception types.
// Practice: --practice 471; reference: --verify 471
static class E471 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 471");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  ArgumentNullException.ThrowIfNull(operation);int result=await operation().ConfigureAwait(false);return checked(result+9);
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(12, Solve(()=>Task.FromResult(3)).GetAwaiter().GetResult());
  Check.Equal(9, Solve(async()=>{await Task.Yield();return 0;}).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(()=>Task.FromException<int>(new InvalidOperationException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 472: Async Task result composition / scenario 10
// Await operation then add10. Propagate operation exceptions; reject null. Never use Result or Wait.
// Hint: await unwraps the result and preserves exception types.
// Practice: --practice 472; reference: --verify 472
static class E472 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 472");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  ArgumentNullException.ThrowIfNull(operation);int result=await operation().ConfigureAwait(false);return checked(result+10);
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(13, Solve(()=>Task.FromResult(3)).GetAwaiter().GetResult());
  Check.Equal(10, Solve(async()=>{await Task.Yield();return 0;}).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(()=>Task.FromException<int>(new InvalidOperationException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 473: Async Task result composition / scenario 11
// Await operation then add11. Propagate operation exceptions; reject null. Never use Result or Wait.
// Hint: await unwraps the result and preserves exception types.
// Practice: --practice 473; reference: --verify 473
static class E473 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 473");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  ArgumentNullException.ThrowIfNull(operation);int result=await operation().ConfigureAwait(false);return checked(result+11);
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(14, Solve(()=>Task.FromResult(3)).GetAwaiter().GetResult());
  Check.Equal(11, Solve(async()=>{await Task.Yield();return 0;}).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(()=>Task.FromException<int>(new InvalidOperationException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 474: Task.WhenAll ordering / scenario 1
// Await all operations and return results in input order multiplied by1. Preserve failure propagation. Empty sequence returns[].
// Hint: WhenAll result order follows input order, not completion order.
// Practice: --practice 474; reference: --verify 474
static class E474 {

 public static async Task<int[]> Practice(IEnumerable<Task<int>> operations) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 474");
 }
 public static async Task<int[]> Reference(IEnumerable<Task<int>> operations) {
  var values=await Task.WhenAll(operations).ConfigureAwait(false);return values.Select(n=>checked(n*1)).ToArray();
 }
 private static Task<int[]> Solve(IEnumerable<Task<int>> operations) => Check.PracticeMode ? Practice(operations) : Reference(operations);
 public static void Verify() {
  Check.Equal(new int[] { 1, 2 }, Solve(new[] { Task.FromResult(1),Task.FromResult(2) }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<Task<int>>()).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(new[] { Task.FromException<int>(new InvalidOperationException()) }).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 475: Task.WhenAll ordering / scenario 2
// Await all operations and return results in input order multiplied by2. Preserve failure propagation. Empty sequence returns[].
// Hint: WhenAll result order follows input order, not completion order.
// Practice: --practice 475; reference: --verify 475
static class E475 {

 public static async Task<int[]> Practice(IEnumerable<Task<int>> operations) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 475");
 }
 public static async Task<int[]> Reference(IEnumerable<Task<int>> operations) {
  var values=await Task.WhenAll(operations).ConfigureAwait(false);return values.Select(n=>checked(n*2)).ToArray();
 }
 private static Task<int[]> Solve(IEnumerable<Task<int>> operations) => Check.PracticeMode ? Practice(operations) : Reference(operations);
 public static void Verify() {
  Check.Equal(new int[] { 2, 4 }, Solve(new[] { Task.FromResult(1),Task.FromResult(2) }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<Task<int>>()).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(new[] { Task.FromException<int>(new InvalidOperationException()) }).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 476: Task.WhenAll ordering / scenario 3
// Await all operations and return results in input order multiplied by3. Preserve failure propagation. Empty sequence returns[].
// Hint: WhenAll result order follows input order, not completion order.
// Practice: --practice 476; reference: --verify 476
static class E476 {

 public static async Task<int[]> Practice(IEnumerable<Task<int>> operations) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 476");
 }
 public static async Task<int[]> Reference(IEnumerable<Task<int>> operations) {
  var values=await Task.WhenAll(operations).ConfigureAwait(false);return values.Select(n=>checked(n*3)).ToArray();
 }
 private static Task<int[]> Solve(IEnumerable<Task<int>> operations) => Check.PracticeMode ? Practice(operations) : Reference(operations);
 public static void Verify() {
  Check.Equal(new int[] { 3, 6 }, Solve(new[] { Task.FromResult(1),Task.FromResult(2) }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<Task<int>>()).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(new[] { Task.FromException<int>(new InvalidOperationException()) }).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 477: Task.WhenAll ordering / scenario 4
// Await all operations and return results in input order multiplied by4. Preserve failure propagation. Empty sequence returns[].
// Hint: WhenAll result order follows input order, not completion order.
// Practice: --practice 477; reference: --verify 477
static class E477 {

 public static async Task<int[]> Practice(IEnumerable<Task<int>> operations) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 477");
 }
 public static async Task<int[]> Reference(IEnumerable<Task<int>> operations) {
  var values=await Task.WhenAll(operations).ConfigureAwait(false);return values.Select(n=>checked(n*4)).ToArray();
 }
 private static Task<int[]> Solve(IEnumerable<Task<int>> operations) => Check.PracticeMode ? Practice(operations) : Reference(operations);
 public static void Verify() {
  Check.Equal(new int[] { 4, 8 }, Solve(new[] { Task.FromResult(1),Task.FromResult(2) }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<Task<int>>()).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(new[] { Task.FromException<int>(new InvalidOperationException()) }).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 478: Task.WhenAll ordering / scenario 5
// Await all operations and return results in input order multiplied by5. Preserve failure propagation. Empty sequence returns[].
// Hint: WhenAll result order follows input order, not completion order.
// Practice: --practice 478; reference: --verify 478
static class E478 {

 public static async Task<int[]> Practice(IEnumerable<Task<int>> operations) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 478");
 }
 public static async Task<int[]> Reference(IEnumerable<Task<int>> operations) {
  var values=await Task.WhenAll(operations).ConfigureAwait(false);return values.Select(n=>checked(n*5)).ToArray();
 }
 private static Task<int[]> Solve(IEnumerable<Task<int>> operations) => Check.PracticeMode ? Practice(operations) : Reference(operations);
 public static void Verify() {
  Check.Equal(new int[] { 5, 10 }, Solve(new[] { Task.FromResult(1),Task.FromResult(2) }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<Task<int>>()).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(new[] { Task.FromException<int>(new InvalidOperationException()) }).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 479: Task.WhenAll ordering / scenario 6
// Await all operations and return results in input order multiplied by6. Preserve failure propagation. Empty sequence returns[].
// Hint: WhenAll result order follows input order, not completion order.
// Practice: --practice 479; reference: --verify 479
static class E479 {

 public static async Task<int[]> Practice(IEnumerable<Task<int>> operations) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 479");
 }
 public static async Task<int[]> Reference(IEnumerable<Task<int>> operations) {
  var values=await Task.WhenAll(operations).ConfigureAwait(false);return values.Select(n=>checked(n*6)).ToArray();
 }
 private static Task<int[]> Solve(IEnumerable<Task<int>> operations) => Check.PracticeMode ? Practice(operations) : Reference(operations);
 public static void Verify() {
  Check.Equal(new int[] { 6, 12 }, Solve(new[] { Task.FromResult(1),Task.FromResult(2) }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<Task<int>>()).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(new[] { Task.FromException<int>(new InvalidOperationException()) }).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 480: Task.WhenAll ordering / scenario 7
// Await all operations and return results in input order multiplied by7. Preserve failure propagation. Empty sequence returns[].
// Hint: WhenAll result order follows input order, not completion order.
// Practice: --practice 480; reference: --verify 480
static class E480 {

 public static async Task<int[]> Practice(IEnumerable<Task<int>> operations) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 480");
 }
 public static async Task<int[]> Reference(IEnumerable<Task<int>> operations) {
  var values=await Task.WhenAll(operations).ConfigureAwait(false);return values.Select(n=>checked(n*7)).ToArray();
 }
 private static Task<int[]> Solve(IEnumerable<Task<int>> operations) => Check.PracticeMode ? Practice(operations) : Reference(operations);
 public static void Verify() {
  Check.Equal(new int[] { 7, 14 }, Solve(new[] { Task.FromResult(1),Task.FromResult(2) }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<Task<int>>()).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(new[] { Task.FromException<int>(new InvalidOperationException()) }).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 481: Task.WhenAll ordering / scenario 8
// Await all operations and return results in input order multiplied by8. Preserve failure propagation. Empty sequence returns[].
// Hint: WhenAll result order follows input order, not completion order.
// Practice: --practice 481; reference: --verify 481
static class E481 {

 public static async Task<int[]> Practice(IEnumerable<Task<int>> operations) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 481");
 }
 public static async Task<int[]> Reference(IEnumerable<Task<int>> operations) {
  var values=await Task.WhenAll(operations).ConfigureAwait(false);return values.Select(n=>checked(n*8)).ToArray();
 }
 private static Task<int[]> Solve(IEnumerable<Task<int>> operations) => Check.PracticeMode ? Practice(operations) : Reference(operations);
 public static void Verify() {
  Check.Equal(new int[] { 8, 16 }, Solve(new[] { Task.FromResult(1),Task.FromResult(2) }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<Task<int>>()).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(new[] { Task.FromException<int>(new InvalidOperationException()) }).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 482: Task.WhenAll ordering / scenario 9
// Await all operations and return results in input order multiplied by9. Preserve failure propagation. Empty sequence returns[].
// Hint: WhenAll result order follows input order, not completion order.
// Practice: --practice 482; reference: --verify 482
static class E482 {

 public static async Task<int[]> Practice(IEnumerable<Task<int>> operations) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 482");
 }
 public static async Task<int[]> Reference(IEnumerable<Task<int>> operations) {
  var values=await Task.WhenAll(operations).ConfigureAwait(false);return values.Select(n=>checked(n*9)).ToArray();
 }
 private static Task<int[]> Solve(IEnumerable<Task<int>> operations) => Check.PracticeMode ? Practice(operations) : Reference(operations);
 public static void Verify() {
  Check.Equal(new int[] { 9, 18 }, Solve(new[] { Task.FromResult(1),Task.FromResult(2) }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<Task<int>>()).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(new[] { Task.FromException<int>(new InvalidOperationException()) }).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 483: Task.WhenAll ordering / scenario 10
// Await all operations and return results in input order multiplied by10. Preserve failure propagation. Empty sequence returns[].
// Hint: WhenAll result order follows input order, not completion order.
// Practice: --practice 483; reference: --verify 483
static class E483 {

 public static async Task<int[]> Practice(IEnumerable<Task<int>> operations) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 483");
 }
 public static async Task<int[]> Reference(IEnumerable<Task<int>> operations) {
  var values=await Task.WhenAll(operations).ConfigureAwait(false);return values.Select(n=>checked(n*10)).ToArray();
 }
 private static Task<int[]> Solve(IEnumerable<Task<int>> operations) => Check.PracticeMode ? Practice(operations) : Reference(operations);
 public static void Verify() {
  Check.Equal(new int[] { 10, 20 }, Solve(new[] { Task.FromResult(1),Task.FromResult(2) }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<Task<int>>()).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(new[] { Task.FromException<int>(new InvalidOperationException()) }).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 484: Task.WhenAll ordering / scenario 11
// Await all operations and return results in input order multiplied by11. Preserve failure propagation. Empty sequence returns[].
// Hint: WhenAll result order follows input order, not completion order.
// Practice: --practice 484; reference: --verify 484
static class E484 {

 public static async Task<int[]> Practice(IEnumerable<Task<int>> operations) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 484");
 }
 public static async Task<int[]> Reference(IEnumerable<Task<int>> operations) {
  var values=await Task.WhenAll(operations).ConfigureAwait(false);return values.Select(n=>checked(n*11)).ToArray();
 }
 private static Task<int[]> Solve(IEnumerable<Task<int>> operations) => Check.PracticeMode ? Practice(operations) : Reference(operations);
 public static void Verify() {
  Check.Equal(new int[] { 11, 22 }, Solve(new[] { Task.FromResult(1),Task.FromResult(2) }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<Task<int>>()).GetAwaiter().GetResult());
  Check.Throws<InvalidOperationException>(() => { Solve(new[] { Task.FromException<int>(new InvalidOperationException()) }).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 485: CancellationToken cooperative checks / scenario 1
// Check cancellation before and after one asynchronous yield, then add1. Cancellation must throw OperationCanceledException instead of returning a sentinel.
// Hint: Cancellation is cooperative, not automatic termination of arbitrary code.
// Practice: --practice 485; reference: --verify 485
static class E485 {

 public static async Task<int> Practice(int value,CancellationToken cancellationToken) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 485");
 }
 public static async Task<int> Reference(int value,CancellationToken cancellationToken) {
  cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();return checked(value+1);
 }
 private static Task<int> Solve(int value,CancellationToken cancellationToken) => Check.PracticeMode ? Practice(value, cancellationToken) : Reference(value, cancellationToken);
 public static void Verify() {
  Check.Equal(3, Solve(2,CancellationToken.None).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Solve(2,new CancellationToken(true)).GetAwaiter().GetResult(); });
  Check.Equal(1, Solve(0,CancellationToken.None).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 486: CancellationToken cooperative checks / scenario 2
// Check cancellation before and after one asynchronous yield, then add2. Cancellation must throw OperationCanceledException instead of returning a sentinel.
// Hint: Cancellation is cooperative, not automatic termination of arbitrary code.
// Practice: --practice 486; reference: --verify 486
static class E486 {

 public static async Task<int> Practice(int value,CancellationToken cancellationToken) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 486");
 }
 public static async Task<int> Reference(int value,CancellationToken cancellationToken) {
  cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();return checked(value+2);
 }
 private static Task<int> Solve(int value,CancellationToken cancellationToken) => Check.PracticeMode ? Practice(value, cancellationToken) : Reference(value, cancellationToken);
 public static void Verify() {
  Check.Equal(4, Solve(2,CancellationToken.None).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Solve(2,new CancellationToken(true)).GetAwaiter().GetResult(); });
  Check.Equal(2, Solve(0,CancellationToken.None).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 487: CancellationToken cooperative checks / scenario 3
// Check cancellation before and after one asynchronous yield, then add3. Cancellation must throw OperationCanceledException instead of returning a sentinel.
// Hint: Cancellation is cooperative, not automatic termination of arbitrary code.
// Practice: --practice 487; reference: --verify 487
static class E487 {

 public static async Task<int> Practice(int value,CancellationToken cancellationToken) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 487");
 }
 public static async Task<int> Reference(int value,CancellationToken cancellationToken) {
  cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();return checked(value+3);
 }
 private static Task<int> Solve(int value,CancellationToken cancellationToken) => Check.PracticeMode ? Practice(value, cancellationToken) : Reference(value, cancellationToken);
 public static void Verify() {
  Check.Equal(5, Solve(2,CancellationToken.None).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Solve(2,new CancellationToken(true)).GetAwaiter().GetResult(); });
  Check.Equal(3, Solve(0,CancellationToken.None).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 488: CancellationToken cooperative checks / scenario 4
// Check cancellation before and after one asynchronous yield, then add4. Cancellation must throw OperationCanceledException instead of returning a sentinel.
// Hint: Cancellation is cooperative, not automatic termination of arbitrary code.
// Practice: --practice 488; reference: --verify 488
static class E488 {

 public static async Task<int> Practice(int value,CancellationToken cancellationToken) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 488");
 }
 public static async Task<int> Reference(int value,CancellationToken cancellationToken) {
  cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();return checked(value+4);
 }
 private static Task<int> Solve(int value,CancellationToken cancellationToken) => Check.PracticeMode ? Practice(value, cancellationToken) : Reference(value, cancellationToken);
 public static void Verify() {
  Check.Equal(6, Solve(2,CancellationToken.None).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Solve(2,new CancellationToken(true)).GetAwaiter().GetResult(); });
  Check.Equal(4, Solve(0,CancellationToken.None).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 489: CancellationToken cooperative checks / scenario 5
// Check cancellation before and after one asynchronous yield, then add5. Cancellation must throw OperationCanceledException instead of returning a sentinel.
// Hint: Cancellation is cooperative, not automatic termination of arbitrary code.
// Practice: --practice 489; reference: --verify 489
static class E489 {

 public static async Task<int> Practice(int value,CancellationToken cancellationToken) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 489");
 }
 public static async Task<int> Reference(int value,CancellationToken cancellationToken) {
  cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();return checked(value+5);
 }
 private static Task<int> Solve(int value,CancellationToken cancellationToken) => Check.PracticeMode ? Practice(value, cancellationToken) : Reference(value, cancellationToken);
 public static void Verify() {
  Check.Equal(7, Solve(2,CancellationToken.None).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Solve(2,new CancellationToken(true)).GetAwaiter().GetResult(); });
  Check.Equal(5, Solve(0,CancellationToken.None).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 490: CancellationToken cooperative checks / scenario 6
// Check cancellation before and after one asynchronous yield, then add6. Cancellation must throw OperationCanceledException instead of returning a sentinel.
// Hint: Cancellation is cooperative, not automatic termination of arbitrary code.
// Practice: --practice 490; reference: --verify 490
static class E490 {

 public static async Task<int> Practice(int value,CancellationToken cancellationToken) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 490");
 }
 public static async Task<int> Reference(int value,CancellationToken cancellationToken) {
  cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();return checked(value+6);
 }
 private static Task<int> Solve(int value,CancellationToken cancellationToken) => Check.PracticeMode ? Practice(value, cancellationToken) : Reference(value, cancellationToken);
 public static void Verify() {
  Check.Equal(8, Solve(2,CancellationToken.None).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Solve(2,new CancellationToken(true)).GetAwaiter().GetResult(); });
  Check.Equal(6, Solve(0,CancellationToken.None).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 491: CancellationToken cooperative checks / scenario 7
// Check cancellation before and after one asynchronous yield, then add7. Cancellation must throw OperationCanceledException instead of returning a sentinel.
// Hint: Cancellation is cooperative, not automatic termination of arbitrary code.
// Practice: --practice 491; reference: --verify 491
static class E491 {

 public static async Task<int> Practice(int value,CancellationToken cancellationToken) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 491");
 }
 public static async Task<int> Reference(int value,CancellationToken cancellationToken) {
  cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();return checked(value+7);
 }
 private static Task<int> Solve(int value,CancellationToken cancellationToken) => Check.PracticeMode ? Practice(value, cancellationToken) : Reference(value, cancellationToken);
 public static void Verify() {
  Check.Equal(9, Solve(2,CancellationToken.None).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Solve(2,new CancellationToken(true)).GetAwaiter().GetResult(); });
  Check.Equal(7, Solve(0,CancellationToken.None).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 492: CancellationToken cooperative checks / scenario 8
// Check cancellation before and after one asynchronous yield, then add8. Cancellation must throw OperationCanceledException instead of returning a sentinel.
// Hint: Cancellation is cooperative, not automatic termination of arbitrary code.
// Practice: --practice 492; reference: --verify 492
static class E492 {

 public static async Task<int> Practice(int value,CancellationToken cancellationToken) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 492");
 }
 public static async Task<int> Reference(int value,CancellationToken cancellationToken) {
  cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();return checked(value+8);
 }
 private static Task<int> Solve(int value,CancellationToken cancellationToken) => Check.PracticeMode ? Practice(value, cancellationToken) : Reference(value, cancellationToken);
 public static void Verify() {
  Check.Equal(10, Solve(2,CancellationToken.None).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Solve(2,new CancellationToken(true)).GetAwaiter().GetResult(); });
  Check.Equal(8, Solve(0,CancellationToken.None).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 493: CancellationToken cooperative checks / scenario 9
// Check cancellation before and after one asynchronous yield, then add9. Cancellation must throw OperationCanceledException instead of returning a sentinel.
// Hint: Cancellation is cooperative, not automatic termination of arbitrary code.
// Practice: --practice 493; reference: --verify 493
static class E493 {

 public static async Task<int> Practice(int value,CancellationToken cancellationToken) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 493");
 }
 public static async Task<int> Reference(int value,CancellationToken cancellationToken) {
  cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();return checked(value+9);
 }
 private static Task<int> Solve(int value,CancellationToken cancellationToken) => Check.PracticeMode ? Practice(value, cancellationToken) : Reference(value, cancellationToken);
 public static void Verify() {
  Check.Equal(11, Solve(2,CancellationToken.None).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Solve(2,new CancellationToken(true)).GetAwaiter().GetResult(); });
  Check.Equal(9, Solve(0,CancellationToken.None).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 494: CancellationToken cooperative checks / scenario 10
// Check cancellation before and after one asynchronous yield, then add10. Cancellation must throw OperationCanceledException instead of returning a sentinel.
// Hint: Cancellation is cooperative, not automatic termination of arbitrary code.
// Practice: --practice 494; reference: --verify 494
static class E494 {

 public static async Task<int> Practice(int value,CancellationToken cancellationToken) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 494");
 }
 public static async Task<int> Reference(int value,CancellationToken cancellationToken) {
  cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();return checked(value+10);
 }
 private static Task<int> Solve(int value,CancellationToken cancellationToken) => Check.PracticeMode ? Practice(value, cancellationToken) : Reference(value, cancellationToken);
 public static void Verify() {
  Check.Equal(12, Solve(2,CancellationToken.None).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Solve(2,new CancellationToken(true)).GetAwaiter().GetResult(); });
  Check.Equal(10, Solve(0,CancellationToken.None).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 495: CancellationToken cooperative checks / scenario 11
// Check cancellation before and after one asynchronous yield, then add11. Cancellation must throw OperationCanceledException instead of returning a sentinel.
// Hint: Cancellation is cooperative, not automatic termination of arbitrary code.
// Practice: --practice 495; reference: --verify 495
static class E495 {

 public static async Task<int> Practice(int value,CancellationToken cancellationToken) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 495");
 }
 public static async Task<int> Reference(int value,CancellationToken cancellationToken) {
  cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();return checked(value+11);
 }
 private static Task<int> Solve(int value,CancellationToken cancellationToken) => Check.PracticeMode ? Practice(value, cancellationToken) : Reference(value, cancellationToken);
 public static void Verify() {
  Check.Equal(13, Solve(2,CancellationToken.None).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Solve(2,new CancellationToken(true)).GetAwaiter().GetResult(); });
  Check.Equal(11, Solve(0,CancellationToken.None).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 496: IAsyncEnumerable streaming / scenario 1
// Asynchronously yield0 through0; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.
// Hint: An async iterator combines yield return with await; EnumeratorCancellation wires the token.
// Practice: --practice 496; reference: --verify 496
static class E496 {
private static async Task<int[]> Collect(IAsyncEnumerable<int> values){var list=new List<int>();await foreach(var n in values)list.Add(n);return list.ToArray();}
 public static IAsyncEnumerable<int> Practice(CancellationToken cancellationToken=default) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 496");
 }
 public static async IAsyncEnumerable<int> Reference([EnumeratorCancellation] CancellationToken cancellationToken=default) {
  for(int i=0;i<1;i++){cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();yield return i;}
 }
 private static IAsyncEnumerable<int> Solve(CancellationToken cancellationToken=default) => Check.PracticeMode ? Practice(cancellationToken) : Reference(cancellationToken);
 public static void Verify() {
  Check.Equal(new int[] { 0 }, Collect(Solve()).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Collect(Solve(new CancellationToken(true))).GetAwaiter().GetResult(); });
  Check.Equal(new int[] { 0 }, Collect(Solve()).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 497: IAsyncEnumerable streaming / scenario 2
// Asynchronously yield0 through1; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.
// Hint: An async iterator combines yield return with await; EnumeratorCancellation wires the token.
// Practice: --practice 497; reference: --verify 497
static class E497 {
private static async Task<int[]> Collect(IAsyncEnumerable<int> values){var list=new List<int>();await foreach(var n in values)list.Add(n);return list.ToArray();}
 public static IAsyncEnumerable<int> Practice(CancellationToken cancellationToken=default) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 497");
 }
 public static async IAsyncEnumerable<int> Reference([EnumeratorCancellation] CancellationToken cancellationToken=default) {
  for(int i=0;i<2;i++){cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();yield return i;}
 }
 private static IAsyncEnumerable<int> Solve(CancellationToken cancellationToken=default) => Check.PracticeMode ? Practice(cancellationToken) : Reference(cancellationToken);
 public static void Verify() {
  Check.Equal(new int[] { 0, 1 }, Collect(Solve()).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Collect(Solve(new CancellationToken(true))).GetAwaiter().GetResult(); });
  Check.Equal(new int[] { 0, 1 }, Collect(Solve()).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 498: IAsyncEnumerable streaming / scenario 3
// Asynchronously yield0 through2; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.
// Hint: An async iterator combines yield return with await; EnumeratorCancellation wires the token.
// Practice: --practice 498; reference: --verify 498
static class E498 {
private static async Task<int[]> Collect(IAsyncEnumerable<int> values){var list=new List<int>();await foreach(var n in values)list.Add(n);return list.ToArray();}
 public static IAsyncEnumerable<int> Practice(CancellationToken cancellationToken=default) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 498");
 }
 public static async IAsyncEnumerable<int> Reference([EnumeratorCancellation] CancellationToken cancellationToken=default) {
  for(int i=0;i<3;i++){cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();yield return i;}
 }
 private static IAsyncEnumerable<int> Solve(CancellationToken cancellationToken=default) => Check.PracticeMode ? Practice(cancellationToken) : Reference(cancellationToken);
 public static void Verify() {
  Check.Equal(new int[] { 0, 1, 2 }, Collect(Solve()).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Collect(Solve(new CancellationToken(true))).GetAwaiter().GetResult(); });
  Check.Equal(new int[] { 0, 1, 2 }, Collect(Solve()).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 499: IAsyncEnumerable streaming / scenario 4
// Asynchronously yield0 through3; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.
// Hint: An async iterator combines yield return with await; EnumeratorCancellation wires the token.
// Practice: --practice 499; reference: --verify 499
static class E499 {
private static async Task<int[]> Collect(IAsyncEnumerable<int> values){var list=new List<int>();await foreach(var n in values)list.Add(n);return list.ToArray();}
 public static IAsyncEnumerable<int> Practice(CancellationToken cancellationToken=default) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 499");
 }
 public static async IAsyncEnumerable<int> Reference([EnumeratorCancellation] CancellationToken cancellationToken=default) {
  for(int i=0;i<4;i++){cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();yield return i;}
 }
 private static IAsyncEnumerable<int> Solve(CancellationToken cancellationToken=default) => Check.PracticeMode ? Practice(cancellationToken) : Reference(cancellationToken);
 public static void Verify() {
  Check.Equal(new int[] { 0, 1, 2, 3 }, Collect(Solve()).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Collect(Solve(new CancellationToken(true))).GetAwaiter().GetResult(); });
  Check.Equal(new int[] { 0, 1, 2, 3 }, Collect(Solve()).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 500: IAsyncEnumerable streaming / scenario 5
// Asynchronously yield0 through4; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.
// Hint: An async iterator combines yield return with await; EnumeratorCancellation wires the token.
// Practice: --practice 500; reference: --verify 500
static class E500 {
private static async Task<int[]> Collect(IAsyncEnumerable<int> values){var list=new List<int>();await foreach(var n in values)list.Add(n);return list.ToArray();}
 public static IAsyncEnumerable<int> Practice(CancellationToken cancellationToken=default) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 500");
 }
 public static async IAsyncEnumerable<int> Reference([EnumeratorCancellation] CancellationToken cancellationToken=default) {
  for(int i=0;i<5;i++){cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();yield return i;}
 }
 private static IAsyncEnumerable<int> Solve(CancellationToken cancellationToken=default) => Check.PracticeMode ? Practice(cancellationToken) : Reference(cancellationToken);
 public static void Verify() {
  Check.Equal(new int[] { 0, 1, 2, 3, 4 }, Collect(Solve()).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Collect(Solve(new CancellationToken(true))).GetAwaiter().GetResult(); });
  Check.Equal(new int[] { 0, 1, 2, 3, 4 }, Collect(Solve()).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 501: IAsyncEnumerable streaming / scenario 6
// Asynchronously yield0 through5; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.
// Hint: An async iterator combines yield return with await; EnumeratorCancellation wires the token.
// Practice: --practice 501; reference: --verify 501
static class E501 {
private static async Task<int[]> Collect(IAsyncEnumerable<int> values){var list=new List<int>();await foreach(var n in values)list.Add(n);return list.ToArray();}
 public static IAsyncEnumerable<int> Practice(CancellationToken cancellationToken=default) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 501");
 }
 public static async IAsyncEnumerable<int> Reference([EnumeratorCancellation] CancellationToken cancellationToken=default) {
  for(int i=0;i<6;i++){cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();yield return i;}
 }
 private static IAsyncEnumerable<int> Solve(CancellationToken cancellationToken=default) => Check.PracticeMode ? Practice(cancellationToken) : Reference(cancellationToken);
 public static void Verify() {
  Check.Equal(new int[] { 0, 1, 2, 3, 4, 5 }, Collect(Solve()).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Collect(Solve(new CancellationToken(true))).GetAwaiter().GetResult(); });
  Check.Equal(new int[] { 0, 1, 2, 3, 4, 5 }, Collect(Solve()).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 502: IAsyncEnumerable streaming / scenario 7
// Asynchronously yield0 through6; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.
// Hint: An async iterator combines yield return with await; EnumeratorCancellation wires the token.
// Practice: --practice 502; reference: --verify 502
static class E502 {
private static async Task<int[]> Collect(IAsyncEnumerable<int> values){var list=new List<int>();await foreach(var n in values)list.Add(n);return list.ToArray();}
 public static IAsyncEnumerable<int> Practice(CancellationToken cancellationToken=default) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 502");
 }
 public static async IAsyncEnumerable<int> Reference([EnumeratorCancellation] CancellationToken cancellationToken=default) {
  for(int i=0;i<7;i++){cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();yield return i;}
 }
 private static IAsyncEnumerable<int> Solve(CancellationToken cancellationToken=default) => Check.PracticeMode ? Practice(cancellationToken) : Reference(cancellationToken);
 public static void Verify() {
  Check.Equal(new int[] { 0, 1, 2, 3, 4, 5, 6 }, Collect(Solve()).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Collect(Solve(new CancellationToken(true))).GetAwaiter().GetResult(); });
  Check.Equal(new int[] { 0, 1, 2, 3, 4, 5, 6 }, Collect(Solve()).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 503: IAsyncEnumerable streaming / scenario 8
// Asynchronously yield0 through7; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.
// Hint: An async iterator combines yield return with await; EnumeratorCancellation wires the token.
// Practice: --practice 503; reference: --verify 503
static class E503 {
private static async Task<int[]> Collect(IAsyncEnumerable<int> values){var list=new List<int>();await foreach(var n in values)list.Add(n);return list.ToArray();}
 public static IAsyncEnumerable<int> Practice(CancellationToken cancellationToken=default) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 503");
 }
 public static async IAsyncEnumerable<int> Reference([EnumeratorCancellation] CancellationToken cancellationToken=default) {
  for(int i=0;i<8;i++){cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();yield return i;}
 }
 private static IAsyncEnumerable<int> Solve(CancellationToken cancellationToken=default) => Check.PracticeMode ? Practice(cancellationToken) : Reference(cancellationToken);
 public static void Verify() {
  Check.Equal(new int[] { 0, 1, 2, 3, 4, 5, 6, 7 }, Collect(Solve()).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Collect(Solve(new CancellationToken(true))).GetAwaiter().GetResult(); });
  Check.Equal(new int[] { 0, 1, 2, 3, 4, 5, 6, 7 }, Collect(Solve()).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 504: IAsyncEnumerable streaming / scenario 9
// Asynchronously yield0 through8; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.
// Hint: An async iterator combines yield return with await; EnumeratorCancellation wires the token.
// Practice: --practice 504; reference: --verify 504
static class E504 {
private static async Task<int[]> Collect(IAsyncEnumerable<int> values){var list=new List<int>();await foreach(var n in values)list.Add(n);return list.ToArray();}
 public static IAsyncEnumerable<int> Practice(CancellationToken cancellationToken=default) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 504");
 }
 public static async IAsyncEnumerable<int> Reference([EnumeratorCancellation] CancellationToken cancellationToken=default) {
  for(int i=0;i<9;i++){cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();yield return i;}
 }
 private static IAsyncEnumerable<int> Solve(CancellationToken cancellationToken=default) => Check.PracticeMode ? Practice(cancellationToken) : Reference(cancellationToken);
 public static void Verify() {
  Check.Equal(new int[] { 0, 1, 2, 3, 4, 5, 6, 7, 8 }, Collect(Solve()).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Collect(Solve(new CancellationToken(true))).GetAwaiter().GetResult(); });
  Check.Equal(new int[] { 0, 1, 2, 3, 4, 5, 6, 7, 8 }, Collect(Solve()).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 505: IAsyncEnumerable streaming / scenario 10
// Asynchronously yield0 through9; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.
// Hint: An async iterator combines yield return with await; EnumeratorCancellation wires the token.
// Practice: --practice 505; reference: --verify 505
static class E505 {
private static async Task<int[]> Collect(IAsyncEnumerable<int> values){var list=new List<int>();await foreach(var n in values)list.Add(n);return list.ToArray();}
 public static IAsyncEnumerable<int> Practice(CancellationToken cancellationToken=default) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 505");
 }
 public static async IAsyncEnumerable<int> Reference([EnumeratorCancellation] CancellationToken cancellationToken=default) {
  for(int i=0;i<10;i++){cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();yield return i;}
 }
 private static IAsyncEnumerable<int> Solve(CancellationToken cancellationToken=default) => Check.PracticeMode ? Practice(cancellationToken) : Reference(cancellationToken);
 public static void Verify() {
  Check.Equal(new int[] { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 }, Collect(Solve()).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Collect(Solve(new CancellationToken(true))).GetAwaiter().GetResult(); });
  Check.Equal(new int[] { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 }, Collect(Solve()).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 506: IAsyncEnumerable streaming / scenario 11
// Asynchronously yield0 through10; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.
// Hint: An async iterator combines yield return with await; EnumeratorCancellation wires the token.
// Practice: --practice 506; reference: --verify 506
static class E506 {
private static async Task<int[]> Collect(IAsyncEnumerable<int> values){var list=new List<int>();await foreach(var n in values)list.Add(n);return list.ToArray();}
 public static IAsyncEnumerable<int> Practice(CancellationToken cancellationToken=default) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 506");
 }
 public static async IAsyncEnumerable<int> Reference([EnumeratorCancellation] CancellationToken cancellationToken=default) {
  for(int i=0;i<11;i++){cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();yield return i;}
 }
 private static IAsyncEnumerable<int> Solve(CancellationToken cancellationToken=default) => Check.PracticeMode ? Practice(cancellationToken) : Reference(cancellationToken);
 public static void Verify() {
  Check.Equal(new int[] { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 }, Collect(Solve()).GetAwaiter().GetResult());
  Check.Throws<OperationCanceledException>(() => { Collect(Solve(new CancellationToken(true))).GetAwaiter().GetResult(); });
  Check.Equal(new int[] { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 }, Collect(Solve()).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 507: Retry with explicit attempt limits / scenario 1
// Try operation at most1 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.
// Hint: An exception filter encodes which failures are retryable.
// Practice: --practice 507; reference: --verify 507
static class E507 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 507");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  for(int attempt=1;;attempt++){try{return await operation().ConfigureAwait(false);}catch(InvalidOperationException) when(attempt<1){}}
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(7, Solve(()=>Task.FromResult(7)).GetAwaiter().GetResult());
  int calls=0;Check.Throws<InvalidOperationException>(()=>Solve(()=>{calls++;return Task.FromException<int>(new InvalidOperationException());}).GetAwaiter().GetResult());Check.Equal(1,calls);
  Check.Throws<ArgumentException>(() => { Solve(()=>Task.FromException<int>(new ArgumentException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 508: Retry with explicit attempt limits / scenario 2
// Try operation at most2 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.
// Hint: An exception filter encodes which failures are retryable.
// Practice: --practice 508; reference: --verify 508
static class E508 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 508");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  for(int attempt=1;;attempt++){try{return await operation().ConfigureAwait(false);}catch(InvalidOperationException) when(attempt<2){}}
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(7, Solve(()=>Task.FromResult(7)).GetAwaiter().GetResult());
  int calls=0;Check.Throws<InvalidOperationException>(()=>Solve(()=>{calls++;return Task.FromException<int>(new InvalidOperationException());}).GetAwaiter().GetResult());Check.Equal(2,calls);
  Check.Throws<ArgumentException>(() => { Solve(()=>Task.FromException<int>(new ArgumentException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 509: Retry with explicit attempt limits / scenario 3
// Try operation at most3 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.
// Hint: An exception filter encodes which failures are retryable.
// Practice: --practice 509; reference: --verify 509
static class E509 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 509");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  for(int attempt=1;;attempt++){try{return await operation().ConfigureAwait(false);}catch(InvalidOperationException) when(attempt<3){}}
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(7, Solve(()=>Task.FromResult(7)).GetAwaiter().GetResult());
  int calls=0;Check.Throws<InvalidOperationException>(()=>Solve(()=>{calls++;return Task.FromException<int>(new InvalidOperationException());}).GetAwaiter().GetResult());Check.Equal(3,calls);
  Check.Throws<ArgumentException>(() => { Solve(()=>Task.FromException<int>(new ArgumentException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 510: Retry with explicit attempt limits / scenario 4
// Try operation at most4 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.
// Hint: An exception filter encodes which failures are retryable.
// Practice: --practice 510; reference: --verify 510
static class E510 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 510");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  for(int attempt=1;;attempt++){try{return await operation().ConfigureAwait(false);}catch(InvalidOperationException) when(attempt<4){}}
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(7, Solve(()=>Task.FromResult(7)).GetAwaiter().GetResult());
  int calls=0;Check.Throws<InvalidOperationException>(()=>Solve(()=>{calls++;return Task.FromException<int>(new InvalidOperationException());}).GetAwaiter().GetResult());Check.Equal(4,calls);
  Check.Throws<ArgumentException>(() => { Solve(()=>Task.FromException<int>(new ArgumentException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 511: Retry with explicit attempt limits / scenario 5
// Try operation at most5 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.
// Hint: An exception filter encodes which failures are retryable.
// Practice: --practice 511; reference: --verify 511
static class E511 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 511");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  for(int attempt=1;;attempt++){try{return await operation().ConfigureAwait(false);}catch(InvalidOperationException) when(attempt<5){}}
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(7, Solve(()=>Task.FromResult(7)).GetAwaiter().GetResult());
  int calls=0;Check.Throws<InvalidOperationException>(()=>Solve(()=>{calls++;return Task.FromException<int>(new InvalidOperationException());}).GetAwaiter().GetResult());Check.Equal(5,calls);
  Check.Throws<ArgumentException>(() => { Solve(()=>Task.FromException<int>(new ArgumentException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 512: Retry with explicit attempt limits / scenario 6
// Try operation at most6 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.
// Hint: An exception filter encodes which failures are retryable.
// Practice: --practice 512; reference: --verify 512
static class E512 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 512");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  for(int attempt=1;;attempt++){try{return await operation().ConfigureAwait(false);}catch(InvalidOperationException) when(attempt<6){}}
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(7, Solve(()=>Task.FromResult(7)).GetAwaiter().GetResult());
  int calls=0;Check.Throws<InvalidOperationException>(()=>Solve(()=>{calls++;return Task.FromException<int>(new InvalidOperationException());}).GetAwaiter().GetResult());Check.Equal(6,calls);
  Check.Throws<ArgumentException>(() => { Solve(()=>Task.FromException<int>(new ArgumentException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 513: Retry with explicit attempt limits / scenario 7
// Try operation at most7 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.
// Hint: An exception filter encodes which failures are retryable.
// Practice: --practice 513; reference: --verify 513
static class E513 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 513");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  for(int attempt=1;;attempt++){try{return await operation().ConfigureAwait(false);}catch(InvalidOperationException) when(attempt<7){}}
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(7, Solve(()=>Task.FromResult(7)).GetAwaiter().GetResult());
  int calls=0;Check.Throws<InvalidOperationException>(()=>Solve(()=>{calls++;return Task.FromException<int>(new InvalidOperationException());}).GetAwaiter().GetResult());Check.Equal(7,calls);
  Check.Throws<ArgumentException>(() => { Solve(()=>Task.FromException<int>(new ArgumentException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 514: Retry with explicit attempt limits / scenario 8
// Try operation at most8 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.
// Hint: An exception filter encodes which failures are retryable.
// Practice: --practice 514; reference: --verify 514
static class E514 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 514");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  for(int attempt=1;;attempt++){try{return await operation().ConfigureAwait(false);}catch(InvalidOperationException) when(attempt<8){}}
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(7, Solve(()=>Task.FromResult(7)).GetAwaiter().GetResult());
  int calls=0;Check.Throws<InvalidOperationException>(()=>Solve(()=>{calls++;return Task.FromException<int>(new InvalidOperationException());}).GetAwaiter().GetResult());Check.Equal(8,calls);
  Check.Throws<ArgumentException>(() => { Solve(()=>Task.FromException<int>(new ArgumentException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 515: Retry with explicit attempt limits / scenario 9
// Try operation at most9 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.
// Hint: An exception filter encodes which failures are retryable.
// Practice: --practice 515; reference: --verify 515
static class E515 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 515");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  for(int attempt=1;;attempt++){try{return await operation().ConfigureAwait(false);}catch(InvalidOperationException) when(attempt<9){}}
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(7, Solve(()=>Task.FromResult(7)).GetAwaiter().GetResult());
  int calls=0;Check.Throws<InvalidOperationException>(()=>Solve(()=>{calls++;return Task.FromException<int>(new InvalidOperationException());}).GetAwaiter().GetResult());Check.Equal(9,calls);
  Check.Throws<ArgumentException>(() => { Solve(()=>Task.FromException<int>(new ArgumentException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 516: Retry with explicit attempt limits / scenario 10
// Try operation at most10 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.
// Hint: An exception filter encodes which failures are retryable.
// Practice: --practice 516; reference: --verify 516
static class E516 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 516");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  for(int attempt=1;;attempt++){try{return await operation().ConfigureAwait(false);}catch(InvalidOperationException) when(attempt<10){}}
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(7, Solve(()=>Task.FromResult(7)).GetAwaiter().GetResult());
  int calls=0;Check.Throws<InvalidOperationException>(()=>Solve(()=>{calls++;return Task.FromException<int>(new InvalidOperationException());}).GetAwaiter().GetResult());Check.Equal(10,calls);
  Check.Throws<ArgumentException>(() => { Solve(()=>Task.FromException<int>(new ArgumentException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 517: Retry with explicit attempt limits / scenario 11
// Try operation at most11 total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.
// Hint: An exception filter encodes which failures are retryable.
// Practice: --practice 517; reference: --verify 517
static class E517 {

 public static async Task<int> Practice(Func<Task<int>> operation) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 517");
 }
 public static async Task<int> Reference(Func<Task<int>> operation) {
  for(int attempt=1;;attempt++){try{return await operation().ConfigureAwait(false);}catch(InvalidOperationException) when(attempt<11){}}
 }
 private static Task<int> Solve(Func<Task<int>> operation) => Check.PracticeMode ? Practice(operation) : Reference(operation);
 public static void Verify() {
  Check.Equal(7, Solve(()=>Task.FromResult(7)).GetAwaiter().GetResult());
  int calls=0;Check.Throws<InvalidOperationException>(()=>Solve(()=>{calls++;return Task.FromException<int>(new InvalidOperationException());}).GetAwaiter().GetResult());Check.Equal(11,calls);
  Check.Throws<ArgumentException>(() => { Solve(()=>Task.FromException<int>(new ArgumentException())).GetAwaiter().GetResult(); });
 }
}

// ======================================================================
// 518: SemaphoreSlim bounded concurrency / scenario 1
// Map values asynchronously with at most1 active workers; preserve result order. Release permits in finally even on failure. Scenario1.
// Hint: Acquire before invoking worker, not merely before awaiting its already-started task.
// Practice: --practice 518; reference: --verify 518
static class E518 {

 public static async Task<int[]> Practice(int[] values,Func<int,Task<int>> worker) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 518");
 }
 public static async Task<int[]> Reference(int[] values,Func<int,Task<int>> worker) {
  using var gate=new SemaphoreSlim(1);var tasks=values.Select(async value=>{await gate.WaitAsync().ConfigureAwait(false);try{return await worker(value).ConfigureAwait(false);}finally{gate.Release();}}).ToArray();return await Task.WhenAll(tasks).ConfigureAwait(false);
 }
 private static Task<int[]> Solve(int[] values,Func<int,Task<int>> worker) => Check.PracticeMode ? Practice(values, worker) : Reference(values, worker);
 public static void Verify() {
  Check.Equal(new int[] { 2, 4, 6 }, Solve(new[] { 1,2,3 },n=>Task.FromResult(n*2)).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),n=>Task.FromResult(n)).GetAwaiter().GetResult());
  int active=0,peak=0;var mutex=new object();var result=Solve(Enumerable.Range(0,12).ToArray(),async n=>{lock(mutex){active++;peak=Math.Max(peak,active);}await Task.Yield();lock(mutex){active--;}return n;}).GetAwaiter().GetResult();Check.True(peak<=1);Check.Equal(Enumerable.Range(0,12).ToArray(),result);
 }
}

// ======================================================================
// 519: SemaphoreSlim bounded concurrency / scenario 2
// Map values asynchronously with at most2 active workers; preserve result order. Release permits in finally even on failure. Scenario2.
// Hint: Acquire before invoking worker, not merely before awaiting its already-started task.
// Practice: --practice 519; reference: --verify 519
static class E519 {

 public static async Task<int[]> Practice(int[] values,Func<int,Task<int>> worker) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 519");
 }
 public static async Task<int[]> Reference(int[] values,Func<int,Task<int>> worker) {
  using var gate=new SemaphoreSlim(2);var tasks=values.Select(async value=>{await gate.WaitAsync().ConfigureAwait(false);try{return await worker(value).ConfigureAwait(false);}finally{gate.Release();}}).ToArray();return await Task.WhenAll(tasks).ConfigureAwait(false);
 }
 private static Task<int[]> Solve(int[] values,Func<int,Task<int>> worker) => Check.PracticeMode ? Practice(values, worker) : Reference(values, worker);
 public static void Verify() {
  Check.Equal(new int[] { 2, 4, 6 }, Solve(new[] { 1,2,3 },n=>Task.FromResult(n*2)).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),n=>Task.FromResult(n)).GetAwaiter().GetResult());
  int active=0,peak=0;var mutex=new object();var result=Solve(Enumerable.Range(0,12).ToArray(),async n=>{lock(mutex){active++;peak=Math.Max(peak,active);}await Task.Yield();lock(mutex){active--;}return n;}).GetAwaiter().GetResult();Check.True(peak<=2);Check.Equal(Enumerable.Range(0,12).ToArray(),result);
 }
}

// ======================================================================
// 520: SemaphoreSlim bounded concurrency / scenario 3
// Map values asynchronously with at most3 active workers; preserve result order. Release permits in finally even on failure. Scenario3.
// Hint: Acquire before invoking worker, not merely before awaiting its already-started task.
// Practice: --practice 520; reference: --verify 520
static class E520 {

 public static async Task<int[]> Practice(int[] values,Func<int,Task<int>> worker) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 520");
 }
 public static async Task<int[]> Reference(int[] values,Func<int,Task<int>> worker) {
  using var gate=new SemaphoreSlim(3);var tasks=values.Select(async value=>{await gate.WaitAsync().ConfigureAwait(false);try{return await worker(value).ConfigureAwait(false);}finally{gate.Release();}}).ToArray();return await Task.WhenAll(tasks).ConfigureAwait(false);
 }
 private static Task<int[]> Solve(int[] values,Func<int,Task<int>> worker) => Check.PracticeMode ? Practice(values, worker) : Reference(values, worker);
 public static void Verify() {
  Check.Equal(new int[] { 2, 4, 6 }, Solve(new[] { 1,2,3 },n=>Task.FromResult(n*2)).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),n=>Task.FromResult(n)).GetAwaiter().GetResult());
  int active=0,peak=0;var mutex=new object();var result=Solve(Enumerable.Range(0,12).ToArray(),async n=>{lock(mutex){active++;peak=Math.Max(peak,active);}await Task.Yield();lock(mutex){active--;}return n;}).GetAwaiter().GetResult();Check.True(peak<=3);Check.Equal(Enumerable.Range(0,12).ToArray(),result);
 }
}

// ======================================================================
// 521: SemaphoreSlim bounded concurrency / scenario 4
// Map values asynchronously with at most4 active workers; preserve result order. Release permits in finally even on failure. Scenario4.
// Hint: Acquire before invoking worker, not merely before awaiting its already-started task.
// Practice: --practice 521; reference: --verify 521
static class E521 {

 public static async Task<int[]> Practice(int[] values,Func<int,Task<int>> worker) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 521");
 }
 public static async Task<int[]> Reference(int[] values,Func<int,Task<int>> worker) {
  using var gate=new SemaphoreSlim(4);var tasks=values.Select(async value=>{await gate.WaitAsync().ConfigureAwait(false);try{return await worker(value).ConfigureAwait(false);}finally{gate.Release();}}).ToArray();return await Task.WhenAll(tasks).ConfigureAwait(false);
 }
 private static Task<int[]> Solve(int[] values,Func<int,Task<int>> worker) => Check.PracticeMode ? Practice(values, worker) : Reference(values, worker);
 public static void Verify() {
  Check.Equal(new int[] { 2, 4, 6 }, Solve(new[] { 1,2,3 },n=>Task.FromResult(n*2)).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),n=>Task.FromResult(n)).GetAwaiter().GetResult());
  int active=0,peak=0;var mutex=new object();var result=Solve(Enumerable.Range(0,12).ToArray(),async n=>{lock(mutex){active++;peak=Math.Max(peak,active);}await Task.Yield();lock(mutex){active--;}return n;}).GetAwaiter().GetResult();Check.True(peak<=4);Check.Equal(Enumerable.Range(0,12).ToArray(),result);
 }
}

// ======================================================================
// 522: SemaphoreSlim bounded concurrency / scenario 5
// Map values asynchronously with at most1 active workers; preserve result order. Release permits in finally even on failure. Scenario5.
// Hint: Acquire before invoking worker, not merely before awaiting its already-started task.
// Practice: --practice 522; reference: --verify 522
static class E522 {

 public static async Task<int[]> Practice(int[] values,Func<int,Task<int>> worker) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 522");
 }
 public static async Task<int[]> Reference(int[] values,Func<int,Task<int>> worker) {
  using var gate=new SemaphoreSlim(1);var tasks=values.Select(async value=>{await gate.WaitAsync().ConfigureAwait(false);try{return await worker(value).ConfigureAwait(false);}finally{gate.Release();}}).ToArray();return await Task.WhenAll(tasks).ConfigureAwait(false);
 }
 private static Task<int[]> Solve(int[] values,Func<int,Task<int>> worker) => Check.PracticeMode ? Practice(values, worker) : Reference(values, worker);
 public static void Verify() {
  Check.Equal(new int[] { 2, 4, 6 }, Solve(new[] { 1,2,3 },n=>Task.FromResult(n*2)).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),n=>Task.FromResult(n)).GetAwaiter().GetResult());
  int active=0,peak=0;var mutex=new object();var result=Solve(Enumerable.Range(0,12).ToArray(),async n=>{lock(mutex){active++;peak=Math.Max(peak,active);}await Task.Yield();lock(mutex){active--;}return n;}).GetAwaiter().GetResult();Check.True(peak<=1);Check.Equal(Enumerable.Range(0,12).ToArray(),result);
 }
}

// ======================================================================
// 523: SemaphoreSlim bounded concurrency / scenario 6
// Map values asynchronously with at most2 active workers; preserve result order. Release permits in finally even on failure. Scenario6.
// Hint: Acquire before invoking worker, not merely before awaiting its already-started task.
// Practice: --practice 523; reference: --verify 523
static class E523 {

 public static async Task<int[]> Practice(int[] values,Func<int,Task<int>> worker) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 523");
 }
 public static async Task<int[]> Reference(int[] values,Func<int,Task<int>> worker) {
  using var gate=new SemaphoreSlim(2);var tasks=values.Select(async value=>{await gate.WaitAsync().ConfigureAwait(false);try{return await worker(value).ConfigureAwait(false);}finally{gate.Release();}}).ToArray();return await Task.WhenAll(tasks).ConfigureAwait(false);
 }
 private static Task<int[]> Solve(int[] values,Func<int,Task<int>> worker) => Check.PracticeMode ? Practice(values, worker) : Reference(values, worker);
 public static void Verify() {
  Check.Equal(new int[] { 2, 4, 6 }, Solve(new[] { 1,2,3 },n=>Task.FromResult(n*2)).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),n=>Task.FromResult(n)).GetAwaiter().GetResult());
  int active=0,peak=0;var mutex=new object();var result=Solve(Enumerable.Range(0,12).ToArray(),async n=>{lock(mutex){active++;peak=Math.Max(peak,active);}await Task.Yield();lock(mutex){active--;}return n;}).GetAwaiter().GetResult();Check.True(peak<=2);Check.Equal(Enumerable.Range(0,12).ToArray(),result);
 }
}

// ======================================================================
// 524: SemaphoreSlim bounded concurrency / scenario 7
// Map values asynchronously with at most3 active workers; preserve result order. Release permits in finally even on failure. Scenario7.
// Hint: Acquire before invoking worker, not merely before awaiting its already-started task.
// Practice: --practice 524; reference: --verify 524
static class E524 {

 public static async Task<int[]> Practice(int[] values,Func<int,Task<int>> worker) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 524");
 }
 public static async Task<int[]> Reference(int[] values,Func<int,Task<int>> worker) {
  using var gate=new SemaphoreSlim(3);var tasks=values.Select(async value=>{await gate.WaitAsync().ConfigureAwait(false);try{return await worker(value).ConfigureAwait(false);}finally{gate.Release();}}).ToArray();return await Task.WhenAll(tasks).ConfigureAwait(false);
 }
 private static Task<int[]> Solve(int[] values,Func<int,Task<int>> worker) => Check.PracticeMode ? Practice(values, worker) : Reference(values, worker);
 public static void Verify() {
  Check.Equal(new int[] { 2, 4, 6 }, Solve(new[] { 1,2,3 },n=>Task.FromResult(n*2)).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),n=>Task.FromResult(n)).GetAwaiter().GetResult());
  int active=0,peak=0;var mutex=new object();var result=Solve(Enumerable.Range(0,12).ToArray(),async n=>{lock(mutex){active++;peak=Math.Max(peak,active);}await Task.Yield();lock(mutex){active--;}return n;}).GetAwaiter().GetResult();Check.True(peak<=3);Check.Equal(Enumerable.Range(0,12).ToArray(),result);
 }
}

// ======================================================================
// 525: SemaphoreSlim bounded concurrency / scenario 8
// Map values asynchronously with at most4 active workers; preserve result order. Release permits in finally even on failure. Scenario8.
// Hint: Acquire before invoking worker, not merely before awaiting its already-started task.
// Practice: --practice 525; reference: --verify 525
static class E525 {

 public static async Task<int[]> Practice(int[] values,Func<int,Task<int>> worker) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 525");
 }
 public static async Task<int[]> Reference(int[] values,Func<int,Task<int>> worker) {
  using var gate=new SemaphoreSlim(4);var tasks=values.Select(async value=>{await gate.WaitAsync().ConfigureAwait(false);try{return await worker(value).ConfigureAwait(false);}finally{gate.Release();}}).ToArray();return await Task.WhenAll(tasks).ConfigureAwait(false);
 }
 private static Task<int[]> Solve(int[] values,Func<int,Task<int>> worker) => Check.PracticeMode ? Practice(values, worker) : Reference(values, worker);
 public static void Verify() {
  Check.Equal(new int[] { 2, 4, 6 }, Solve(new[] { 1,2,3 },n=>Task.FromResult(n*2)).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),n=>Task.FromResult(n)).GetAwaiter().GetResult());
  int active=0,peak=0;var mutex=new object();var result=Solve(Enumerable.Range(0,12).ToArray(),async n=>{lock(mutex){active++;peak=Math.Max(peak,active);}await Task.Yield();lock(mutex){active--;}return n;}).GetAwaiter().GetResult();Check.True(peak<=4);Check.Equal(Enumerable.Range(0,12).ToArray(),result);
 }
}

// ======================================================================
// 526: SemaphoreSlim bounded concurrency / scenario 9
// Map values asynchronously with at most1 active workers; preserve result order. Release permits in finally even on failure. Scenario9.
// Hint: Acquire before invoking worker, not merely before awaiting its already-started task.
// Practice: --practice 526; reference: --verify 526
static class E526 {

 public static async Task<int[]> Practice(int[] values,Func<int,Task<int>> worker) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 526");
 }
 public static async Task<int[]> Reference(int[] values,Func<int,Task<int>> worker) {
  using var gate=new SemaphoreSlim(1);var tasks=values.Select(async value=>{await gate.WaitAsync().ConfigureAwait(false);try{return await worker(value).ConfigureAwait(false);}finally{gate.Release();}}).ToArray();return await Task.WhenAll(tasks).ConfigureAwait(false);
 }
 private static Task<int[]> Solve(int[] values,Func<int,Task<int>> worker) => Check.PracticeMode ? Practice(values, worker) : Reference(values, worker);
 public static void Verify() {
  Check.Equal(new int[] { 2, 4, 6 }, Solve(new[] { 1,2,3 },n=>Task.FromResult(n*2)).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),n=>Task.FromResult(n)).GetAwaiter().GetResult());
  int active=0,peak=0;var mutex=new object();var result=Solve(Enumerable.Range(0,12).ToArray(),async n=>{lock(mutex){active++;peak=Math.Max(peak,active);}await Task.Yield();lock(mutex){active--;}return n;}).GetAwaiter().GetResult();Check.True(peak<=1);Check.Equal(Enumerable.Range(0,12).ToArray(),result);
 }
}

// ======================================================================
// 527: SemaphoreSlim bounded concurrency / scenario 10
// Map values asynchronously with at most2 active workers; preserve result order. Release permits in finally even on failure. Scenario10.
// Hint: Acquire before invoking worker, not merely before awaiting its already-started task.
// Practice: --practice 527; reference: --verify 527
static class E527 {

 public static async Task<int[]> Practice(int[] values,Func<int,Task<int>> worker) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 527");
 }
 public static async Task<int[]> Reference(int[] values,Func<int,Task<int>> worker) {
  using var gate=new SemaphoreSlim(2);var tasks=values.Select(async value=>{await gate.WaitAsync().ConfigureAwait(false);try{return await worker(value).ConfigureAwait(false);}finally{gate.Release();}}).ToArray();return await Task.WhenAll(tasks).ConfigureAwait(false);
 }
 private static Task<int[]> Solve(int[] values,Func<int,Task<int>> worker) => Check.PracticeMode ? Practice(values, worker) : Reference(values, worker);
 public static void Verify() {
  Check.Equal(new int[] { 2, 4, 6 }, Solve(new[] { 1,2,3 },n=>Task.FromResult(n*2)).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),n=>Task.FromResult(n)).GetAwaiter().GetResult());
  int active=0,peak=0;var mutex=new object();var result=Solve(Enumerable.Range(0,12).ToArray(),async n=>{lock(mutex){active++;peak=Math.Max(peak,active);}await Task.Yield();lock(mutex){active--;}return n;}).GetAwaiter().GetResult();Check.True(peak<=2);Check.Equal(Enumerable.Range(0,12).ToArray(),result);
 }
}

// ======================================================================
// 528: SemaphoreSlim bounded concurrency / scenario 11
// Map values asynchronously with at most3 active workers; preserve result order. Release permits in finally even on failure. Scenario11.
// Hint: Acquire before invoking worker, not merely before awaiting its already-started task.
// Practice: --practice 528; reference: --verify 528
static class E528 {

 public static async Task<int[]> Practice(int[] values,Func<int,Task<int>> worker) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 528");
 }
 public static async Task<int[]> Reference(int[] values,Func<int,Task<int>> worker) {
  using var gate=new SemaphoreSlim(3);var tasks=values.Select(async value=>{await gate.WaitAsync().ConfigureAwait(false);try{return await worker(value).ConfigureAwait(false);}finally{gate.Release();}}).ToArray();return await Task.WhenAll(tasks).ConfigureAwait(false);
 }
 private static Task<int[]> Solve(int[] values,Func<int,Task<int>> worker) => Check.PracticeMode ? Practice(values, worker) : Reference(values, worker);
 public static void Verify() {
  Check.Equal(new int[] { 2, 4, 6 }, Solve(new[] { 1,2,3 },n=>Task.FromResult(n*2)).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>(),n=>Task.FromResult(n)).GetAwaiter().GetResult());
  int active=0,peak=0;var mutex=new object();var result=Solve(Enumerable.Range(0,12).ToArray(),async n=>{lock(mutex){active++;peak=Math.Max(peak,active);}await Task.Yield();lock(mutex){active--;}return n;}).GetAwaiter().GetResult();Check.True(peak<=3);Check.Equal(Enumerable.Range(0,12).ToArray(),result);
 }
}

// ======================================================================
// 529: ConcurrentDictionary atomic increments / scenario 1
// Run workers parallel loops, each incrementing shared key x 2 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.
// Hint: Update factories can run more than once under contention.
// Practice: --practice 529; reference: --verify 529
static class E529 {

 public static int Practice(int workers) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 529");
 }
 public static int Reference(int workers) {
  if(workers<0)throw new ArgumentOutOfRangeException(nameof(workers));var counts=new ConcurrentDictionary<string,int>();Parallel.For(0,workers,_=>{for(int i=0;i<2;i++)counts.AddOrUpdate("x",1,(_,old)=>checked(old+1));});return counts.GetValueOrDefault("x");
 }
 private static int Solve(int workers) => Check.PracticeMode ? Practice(workers) : Reference(workers);
 public static void Verify() {
  Check.Equal(0, Solve(0));
  Check.Equal(16, Solve(8));
  Check.Equal(2, Solve(1));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 530: ConcurrentDictionary atomic increments / scenario 2
// Run workers parallel loops, each incrementing shared key x 3 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.
// Hint: Update factories can run more than once under contention.
// Practice: --practice 530; reference: --verify 530
static class E530 {

 public static int Practice(int workers) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 530");
 }
 public static int Reference(int workers) {
  if(workers<0)throw new ArgumentOutOfRangeException(nameof(workers));var counts=new ConcurrentDictionary<string,int>();Parallel.For(0,workers,_=>{for(int i=0;i<3;i++)counts.AddOrUpdate("x",1,(_,old)=>checked(old+1));});return counts.GetValueOrDefault("x");
 }
 private static int Solve(int workers) => Check.PracticeMode ? Practice(workers) : Reference(workers);
 public static void Verify() {
  Check.Equal(0, Solve(0));
  Check.Equal(24, Solve(8));
  Check.Equal(3, Solve(1));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 531: ConcurrentDictionary atomic increments / scenario 3
// Run workers parallel loops, each incrementing shared key x 4 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.
// Hint: Update factories can run more than once under contention.
// Practice: --practice 531; reference: --verify 531
static class E531 {

 public static int Practice(int workers) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 531");
 }
 public static int Reference(int workers) {
  if(workers<0)throw new ArgumentOutOfRangeException(nameof(workers));var counts=new ConcurrentDictionary<string,int>();Parallel.For(0,workers,_=>{for(int i=0;i<4;i++)counts.AddOrUpdate("x",1,(_,old)=>checked(old+1));});return counts.GetValueOrDefault("x");
 }
 private static int Solve(int workers) => Check.PracticeMode ? Practice(workers) : Reference(workers);
 public static void Verify() {
  Check.Equal(0, Solve(0));
  Check.Equal(32, Solve(8));
  Check.Equal(4, Solve(1));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 532: ConcurrentDictionary atomic increments / scenario 4
// Run workers parallel loops, each incrementing shared key x 5 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.
// Hint: Update factories can run more than once under contention.
// Practice: --practice 532; reference: --verify 532
static class E532 {

 public static int Practice(int workers) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 532");
 }
 public static int Reference(int workers) {
  if(workers<0)throw new ArgumentOutOfRangeException(nameof(workers));var counts=new ConcurrentDictionary<string,int>();Parallel.For(0,workers,_=>{for(int i=0;i<5;i++)counts.AddOrUpdate("x",1,(_,old)=>checked(old+1));});return counts.GetValueOrDefault("x");
 }
 private static int Solve(int workers) => Check.PracticeMode ? Practice(workers) : Reference(workers);
 public static void Verify() {
  Check.Equal(0, Solve(0));
  Check.Equal(40, Solve(8));
  Check.Equal(5, Solve(1));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 533: ConcurrentDictionary atomic increments / scenario 5
// Run workers parallel loops, each incrementing shared key x 6 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.
// Hint: Update factories can run more than once under contention.
// Practice: --practice 533; reference: --verify 533
static class E533 {

 public static int Practice(int workers) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 533");
 }
 public static int Reference(int workers) {
  if(workers<0)throw new ArgumentOutOfRangeException(nameof(workers));var counts=new ConcurrentDictionary<string,int>();Parallel.For(0,workers,_=>{for(int i=0;i<6;i++)counts.AddOrUpdate("x",1,(_,old)=>checked(old+1));});return counts.GetValueOrDefault("x");
 }
 private static int Solve(int workers) => Check.PracticeMode ? Practice(workers) : Reference(workers);
 public static void Verify() {
  Check.Equal(0, Solve(0));
  Check.Equal(48, Solve(8));
  Check.Equal(6, Solve(1));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 534: ConcurrentDictionary atomic increments / scenario 6
// Run workers parallel loops, each incrementing shared key x 7 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.
// Hint: Update factories can run more than once under contention.
// Practice: --practice 534; reference: --verify 534
static class E534 {

 public static int Practice(int workers) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 534");
 }
 public static int Reference(int workers) {
  if(workers<0)throw new ArgumentOutOfRangeException(nameof(workers));var counts=new ConcurrentDictionary<string,int>();Parallel.For(0,workers,_=>{for(int i=0;i<7;i++)counts.AddOrUpdate("x",1,(_,old)=>checked(old+1));});return counts.GetValueOrDefault("x");
 }
 private static int Solve(int workers) => Check.PracticeMode ? Practice(workers) : Reference(workers);
 public static void Verify() {
  Check.Equal(0, Solve(0));
  Check.Equal(56, Solve(8));
  Check.Equal(7, Solve(1));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 535: ConcurrentDictionary atomic increments / scenario 7
// Run workers parallel loops, each incrementing shared key x 8 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.
// Hint: Update factories can run more than once under contention.
// Practice: --practice 535; reference: --verify 535
static class E535 {

 public static int Practice(int workers) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 535");
 }
 public static int Reference(int workers) {
  if(workers<0)throw new ArgumentOutOfRangeException(nameof(workers));var counts=new ConcurrentDictionary<string,int>();Parallel.For(0,workers,_=>{for(int i=0;i<8;i++)counts.AddOrUpdate("x",1,(_,old)=>checked(old+1));});return counts.GetValueOrDefault("x");
 }
 private static int Solve(int workers) => Check.PracticeMode ? Practice(workers) : Reference(workers);
 public static void Verify() {
  Check.Equal(0, Solve(0));
  Check.Equal(64, Solve(8));
  Check.Equal(8, Solve(1));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 536: ConcurrentDictionary atomic increments / scenario 8
// Run workers parallel loops, each incrementing shared key x 9 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.
// Hint: Update factories can run more than once under contention.
// Practice: --practice 536; reference: --verify 536
static class E536 {

 public static int Practice(int workers) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 536");
 }
 public static int Reference(int workers) {
  if(workers<0)throw new ArgumentOutOfRangeException(nameof(workers));var counts=new ConcurrentDictionary<string,int>();Parallel.For(0,workers,_=>{for(int i=0;i<9;i++)counts.AddOrUpdate("x",1,(_,old)=>checked(old+1));});return counts.GetValueOrDefault("x");
 }
 private static int Solve(int workers) => Check.PracticeMode ? Practice(workers) : Reference(workers);
 public static void Verify() {
  Check.Equal(0, Solve(0));
  Check.Equal(72, Solve(8));
  Check.Equal(9, Solve(1));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 537: ConcurrentDictionary atomic increments / scenario 9
// Run workers parallel loops, each incrementing shared key x 10 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.
// Hint: Update factories can run more than once under contention.
// Practice: --practice 537; reference: --verify 537
static class E537 {

 public static int Practice(int workers) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 537");
 }
 public static int Reference(int workers) {
  if(workers<0)throw new ArgumentOutOfRangeException(nameof(workers));var counts=new ConcurrentDictionary<string,int>();Parallel.For(0,workers,_=>{for(int i=0;i<10;i++)counts.AddOrUpdate("x",1,(_,old)=>checked(old+1));});return counts.GetValueOrDefault("x");
 }
 private static int Solve(int workers) => Check.PracticeMode ? Practice(workers) : Reference(workers);
 public static void Verify() {
  Check.Equal(0, Solve(0));
  Check.Equal(80, Solve(8));
  Check.Equal(10, Solve(1));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 538: ConcurrentDictionary atomic increments / scenario 10
// Run workers parallel loops, each incrementing shared key x 11 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.
// Hint: Update factories can run more than once under contention.
// Practice: --practice 538; reference: --verify 538
static class E538 {

 public static int Practice(int workers) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 538");
 }
 public static int Reference(int workers) {
  if(workers<0)throw new ArgumentOutOfRangeException(nameof(workers));var counts=new ConcurrentDictionary<string,int>();Parallel.For(0,workers,_=>{for(int i=0;i<11;i++)counts.AddOrUpdate("x",1,(_,old)=>checked(old+1));});return counts.GetValueOrDefault("x");
 }
 private static int Solve(int workers) => Check.PracticeMode ? Practice(workers) : Reference(workers);
 public static void Verify() {
  Check.Equal(0, Solve(0));
  Check.Equal(88, Solve(8));
  Check.Equal(11, Solve(1));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 539: ConcurrentDictionary atomic increments / scenario 11
// Run workers parallel loops, each incrementing shared key x 12 times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.
// Hint: Update factories can run more than once under contention.
// Practice: --practice 539; reference: --verify 539
static class E539 {

 public static int Practice(int workers) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 539");
 }
 public static int Reference(int workers) {
  if(workers<0)throw new ArgumentOutOfRangeException(nameof(workers));var counts=new ConcurrentDictionary<string,int>();Parallel.For(0,workers,_=>{for(int i=0;i<12;i++)counts.AddOrUpdate("x",1,(_,old)=>checked(old+1));});return counts.GetValueOrDefault("x");
 }
 private static int Solve(int workers) => Check.PracticeMode ? Practice(workers) : Reference(workers);
 public static void Verify() {
  Check.Equal(0, Solve(0));
  Check.Equal(96, Solve(8));
  Check.Equal(12, Solve(1));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 540: System.Threading.Channels flow / scenario 1
// Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by1. Preserve order. No leaked reader waiting for completion.
// Hint: ReadAllAsync finishes only after writer completion and buffer drainage.
// Practice: --practice 540; reference: --verify 540
static class E540 {

 public static async Task<int[]> Practice(int[] values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 540");
 }
 public static async Task<int[]> Reference(int[] values) {
  var channel=Channel.CreateUnbounded<int>();foreach(var n in values)await channel.Writer.WriteAsync(n);channel.Writer.Complete();var result=new List<int>();await foreach(var n in channel.Reader.ReadAllAsync())result.Add(checked(n*1));return result.ToArray();
 }
 private static Task<int[]> Solve(int[] values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 1, -1 }, Solve(new[] { 1,-1 }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).GetAwaiter().GetResult());
  Check.Equal(new int[] { 0 }, Solve(new[] { 0 }).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 541: System.Threading.Channels flow / scenario 2
// Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by2. Preserve order. No leaked reader waiting for completion.
// Hint: ReadAllAsync finishes only after writer completion and buffer drainage.
// Practice: --practice 541; reference: --verify 541
static class E541 {

 public static async Task<int[]> Practice(int[] values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 541");
 }
 public static async Task<int[]> Reference(int[] values) {
  var channel=Channel.CreateUnbounded<int>();foreach(var n in values)await channel.Writer.WriteAsync(n);channel.Writer.Complete();var result=new List<int>();await foreach(var n in channel.Reader.ReadAllAsync())result.Add(checked(n*2));return result.ToArray();
 }
 private static Task<int[]> Solve(int[] values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 2, -2 }, Solve(new[] { 1,-1 }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).GetAwaiter().GetResult());
  Check.Equal(new int[] { 0 }, Solve(new[] { 0 }).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 542: System.Threading.Channels flow / scenario 3
// Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by3. Preserve order. No leaked reader waiting for completion.
// Hint: ReadAllAsync finishes only after writer completion and buffer drainage.
// Practice: --practice 542; reference: --verify 542
static class E542 {

 public static async Task<int[]> Practice(int[] values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 542");
 }
 public static async Task<int[]> Reference(int[] values) {
  var channel=Channel.CreateUnbounded<int>();foreach(var n in values)await channel.Writer.WriteAsync(n);channel.Writer.Complete();var result=new List<int>();await foreach(var n in channel.Reader.ReadAllAsync())result.Add(checked(n*3));return result.ToArray();
 }
 private static Task<int[]> Solve(int[] values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 3, -3 }, Solve(new[] { 1,-1 }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).GetAwaiter().GetResult());
  Check.Equal(new int[] { 0 }, Solve(new[] { 0 }).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 543: System.Threading.Channels flow / scenario 4
// Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by4. Preserve order. No leaked reader waiting for completion.
// Hint: ReadAllAsync finishes only after writer completion and buffer drainage.
// Practice: --practice 543; reference: --verify 543
static class E543 {

 public static async Task<int[]> Practice(int[] values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 543");
 }
 public static async Task<int[]> Reference(int[] values) {
  var channel=Channel.CreateUnbounded<int>();foreach(var n in values)await channel.Writer.WriteAsync(n);channel.Writer.Complete();var result=new List<int>();await foreach(var n in channel.Reader.ReadAllAsync())result.Add(checked(n*4));return result.ToArray();
 }
 private static Task<int[]> Solve(int[] values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 4, -4 }, Solve(new[] { 1,-1 }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).GetAwaiter().GetResult());
  Check.Equal(new int[] { 0 }, Solve(new[] { 0 }).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 544: System.Threading.Channels flow / scenario 5
// Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by5. Preserve order. No leaked reader waiting for completion.
// Hint: ReadAllAsync finishes only after writer completion and buffer drainage.
// Practice: --practice 544; reference: --verify 544
static class E544 {

 public static async Task<int[]> Practice(int[] values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 544");
 }
 public static async Task<int[]> Reference(int[] values) {
  var channel=Channel.CreateUnbounded<int>();foreach(var n in values)await channel.Writer.WriteAsync(n);channel.Writer.Complete();var result=new List<int>();await foreach(var n in channel.Reader.ReadAllAsync())result.Add(checked(n*5));return result.ToArray();
 }
 private static Task<int[]> Solve(int[] values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 5, -5 }, Solve(new[] { 1,-1 }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).GetAwaiter().GetResult());
  Check.Equal(new int[] { 0 }, Solve(new[] { 0 }).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 545: System.Threading.Channels flow / scenario 6
// Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by6. Preserve order. No leaked reader waiting for completion.
// Hint: ReadAllAsync finishes only after writer completion and buffer drainage.
// Practice: --practice 545; reference: --verify 545
static class E545 {

 public static async Task<int[]> Practice(int[] values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 545");
 }
 public static async Task<int[]> Reference(int[] values) {
  var channel=Channel.CreateUnbounded<int>();foreach(var n in values)await channel.Writer.WriteAsync(n);channel.Writer.Complete();var result=new List<int>();await foreach(var n in channel.Reader.ReadAllAsync())result.Add(checked(n*6));return result.ToArray();
 }
 private static Task<int[]> Solve(int[] values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 6, -6 }, Solve(new[] { 1,-1 }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).GetAwaiter().GetResult());
  Check.Equal(new int[] { 0 }, Solve(new[] { 0 }).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 546: System.Threading.Channels flow / scenario 7
// Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by7. Preserve order. No leaked reader waiting for completion.
// Hint: ReadAllAsync finishes only after writer completion and buffer drainage.
// Practice: --practice 546; reference: --verify 546
static class E546 {

 public static async Task<int[]> Practice(int[] values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 546");
 }
 public static async Task<int[]> Reference(int[] values) {
  var channel=Channel.CreateUnbounded<int>();foreach(var n in values)await channel.Writer.WriteAsync(n);channel.Writer.Complete();var result=new List<int>();await foreach(var n in channel.Reader.ReadAllAsync())result.Add(checked(n*7));return result.ToArray();
 }
 private static Task<int[]> Solve(int[] values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 7, -7 }, Solve(new[] { 1,-1 }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).GetAwaiter().GetResult());
  Check.Equal(new int[] { 0 }, Solve(new[] { 0 }).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 547: System.Threading.Channels flow / scenario 8
// Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by8. Preserve order. No leaked reader waiting for completion.
// Hint: ReadAllAsync finishes only after writer completion and buffer drainage.
// Practice: --practice 547; reference: --verify 547
static class E547 {

 public static async Task<int[]> Practice(int[] values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 547");
 }
 public static async Task<int[]> Reference(int[] values) {
  var channel=Channel.CreateUnbounded<int>();foreach(var n in values)await channel.Writer.WriteAsync(n);channel.Writer.Complete();var result=new List<int>();await foreach(var n in channel.Reader.ReadAllAsync())result.Add(checked(n*8));return result.ToArray();
 }
 private static Task<int[]> Solve(int[] values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 8, -8 }, Solve(new[] { 1,-1 }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).GetAwaiter().GetResult());
  Check.Equal(new int[] { 0 }, Solve(new[] { 0 }).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 548: System.Threading.Channels flow / scenario 9
// Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by9. Preserve order. No leaked reader waiting for completion.
// Hint: ReadAllAsync finishes only after writer completion and buffer drainage.
// Practice: --practice 548; reference: --verify 548
static class E548 {

 public static async Task<int[]> Practice(int[] values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 548");
 }
 public static async Task<int[]> Reference(int[] values) {
  var channel=Channel.CreateUnbounded<int>();foreach(var n in values)await channel.Writer.WriteAsync(n);channel.Writer.Complete();var result=new List<int>();await foreach(var n in channel.Reader.ReadAllAsync())result.Add(checked(n*9));return result.ToArray();
 }
 private static Task<int[]> Solve(int[] values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 9, -9 }, Solve(new[] { 1,-1 }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).GetAwaiter().GetResult());
  Check.Equal(new int[] { 0 }, Solve(new[] { 0 }).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 549: System.Threading.Channels flow / scenario 10
// Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by10. Preserve order. No leaked reader waiting for completion.
// Hint: ReadAllAsync finishes only after writer completion and buffer drainage.
// Practice: --practice 549; reference: --verify 549
static class E549 {

 public static async Task<int[]> Practice(int[] values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 549");
 }
 public static async Task<int[]> Reference(int[] values) {
  var channel=Channel.CreateUnbounded<int>();foreach(var n in values)await channel.Writer.WriteAsync(n);channel.Writer.Complete();var result=new List<int>();await foreach(var n in channel.Reader.ReadAllAsync())result.Add(checked(n*10));return result.ToArray();
 }
 private static Task<int[]> Solve(int[] values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 10, -10 }, Solve(new[] { 1,-1 }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).GetAwaiter().GetResult());
  Check.Equal(new int[] { 0 }, Solve(new[] { 0 }).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 550: System.Threading.Channels flow / scenario 11
// Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by11. Preserve order. No leaked reader waiting for completion.
// Hint: ReadAllAsync finishes only after writer completion and buffer drainage.
// Practice: --practice 550; reference: --verify 550
static class E550 {

 public static async Task<int[]> Practice(int[] values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 550");
 }
 public static async Task<int[]> Reference(int[] values) {
  var channel=Channel.CreateUnbounded<int>();foreach(var n in values)await channel.Writer.WriteAsync(n);channel.Writer.Complete();var result=new List<int>();await foreach(var n in channel.Reader.ReadAllAsync())result.Add(checked(n*11));return result.ToArray();
 }
 private static Task<int[]> Solve(int[] values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal(new int[] { 11, -11 }, Solve(new[] { 1,-1 }).GetAwaiter().GetResult());
  Check.Equal(new int[] {  }, Solve(Array.Empty<int>()).GetAwaiter().GetResult());
  Check.Equal(new int[] { 0 }, Solve(new[] { 0 }).GetAwaiter().GetResult());
 }
}

// ======================================================================
// 551: StringReader line processing / scenario 1
// Read CRLF/LF/CR lines, trim each, retain lines of length>=1. Dispose reader. Trailing newline does not create a retained blank line.
// Hint: ReadLine returns null at end, distinct from an empty line.
// Practice: --practice 551; reference: --verify 551
static class E551 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 551");
 }
 public static string[] Reference(string text) {
  using var reader=new StringReader(text);var result=new List<string>();string? line;while((line=reader.ReadLine()) is not null){var trimmed=line.Trim();if(trimmed.Length>=1)result.Add(trimmed);}return result.ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "a", "b" }, Solve(" a \r\nb\n"));
  Check.Equal(new string[] {  }, Solve(""));
  Check.Equal(new string[] {  }, Solve(""));
 }
}

// ======================================================================
// 552: StringReader line processing / scenario 2
// Read CRLF/LF/CR lines, trim each, retain lines of length>=2. Dispose reader. Trailing newline does not create a retained blank line.
// Hint: ReadLine returns null at end, distinct from an empty line.
// Practice: --practice 552; reference: --verify 552
static class E552 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 552");
 }
 public static string[] Reference(string text) {
  using var reader=new StringReader(text);var result=new List<string>();string? line;while((line=reader.ReadLine()) is not null){var trimmed=line.Trim();if(trimmed.Length>=2)result.Add(trimmed);}return result.ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aa", "bb" }, Solve(" aa \r\nbb\n"));
  Check.Equal(new string[] {  }, Solve(""));
  Check.Equal(new string[] {  }, Solve("x"));
 }
}

// ======================================================================
// 553: StringReader line processing / scenario 3
// Read CRLF/LF/CR lines, trim each, retain lines of length>=3. Dispose reader. Trailing newline does not create a retained blank line.
// Hint: ReadLine returns null at end, distinct from an empty line.
// Practice: --practice 553; reference: --verify 553
static class E553 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 553");
 }
 public static string[] Reference(string text) {
  using var reader=new StringReader(text);var result=new List<string>();string? line;while((line=reader.ReadLine()) is not null){var trimmed=line.Trim();if(trimmed.Length>=3)result.Add(trimmed);}return result.ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaa", "bbb" }, Solve(" aaa \r\nbbb\n"));
  Check.Equal(new string[] {  }, Solve(""));
  Check.Equal(new string[] {  }, Solve("xx"));
 }
}

// ======================================================================
// 554: StringReader line processing / scenario 4
// Read CRLF/LF/CR lines, trim each, retain lines of length>=4. Dispose reader. Trailing newline does not create a retained blank line.
// Hint: ReadLine returns null at end, distinct from an empty line.
// Practice: --practice 554; reference: --verify 554
static class E554 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 554");
 }
 public static string[] Reference(string text) {
  using var reader=new StringReader(text);var result=new List<string>();string? line;while((line=reader.ReadLine()) is not null){var trimmed=line.Trim();if(trimmed.Length>=4)result.Add(trimmed);}return result.ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaa", "bbbb" }, Solve(" aaaa \r\nbbbb\n"));
  Check.Equal(new string[] {  }, Solve(""));
  Check.Equal(new string[] {  }, Solve("xxx"));
 }
}

// ======================================================================
// 555: StringReader line processing / scenario 5
// Read CRLF/LF/CR lines, trim each, retain lines of length>=5. Dispose reader. Trailing newline does not create a retained blank line.
// Hint: ReadLine returns null at end, distinct from an empty line.
// Practice: --practice 555; reference: --verify 555
static class E555 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 555");
 }
 public static string[] Reference(string text) {
  using var reader=new StringReader(text);var result=new List<string>();string? line;while((line=reader.ReadLine()) is not null){var trimmed=line.Trim();if(trimmed.Length>=5)result.Add(trimmed);}return result.ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaaa", "bbbbb" }, Solve(" aaaaa \r\nbbbbb\n"));
  Check.Equal(new string[] {  }, Solve(""));
  Check.Equal(new string[] {  }, Solve("xxxx"));
 }
}

// ======================================================================
// 556: StringReader line processing / scenario 6
// Read CRLF/LF/CR lines, trim each, retain lines of length>=6. Dispose reader. Trailing newline does not create a retained blank line.
// Hint: ReadLine returns null at end, distinct from an empty line.
// Practice: --practice 556; reference: --verify 556
static class E556 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 556");
 }
 public static string[] Reference(string text) {
  using var reader=new StringReader(text);var result=new List<string>();string? line;while((line=reader.ReadLine()) is not null){var trimmed=line.Trim();if(trimmed.Length>=6)result.Add(trimmed);}return result.ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaaaa", "bbbbbb" }, Solve(" aaaaaa \r\nbbbbbb\n"));
  Check.Equal(new string[] {  }, Solve(""));
  Check.Equal(new string[] {  }, Solve("xxxxx"));
 }
}

// ======================================================================
// 557: StringReader line processing / scenario 7
// Read CRLF/LF/CR lines, trim each, retain lines of length>=7. Dispose reader. Trailing newline does not create a retained blank line.
// Hint: ReadLine returns null at end, distinct from an empty line.
// Practice: --practice 557; reference: --verify 557
static class E557 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 557");
 }
 public static string[] Reference(string text) {
  using var reader=new StringReader(text);var result=new List<string>();string? line;while((line=reader.ReadLine()) is not null){var trimmed=line.Trim();if(trimmed.Length>=7)result.Add(trimmed);}return result.ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaaaaa", "bbbbbbb" }, Solve(" aaaaaaa \r\nbbbbbbb\n"));
  Check.Equal(new string[] {  }, Solve(""));
  Check.Equal(new string[] {  }, Solve("xxxxxx"));
 }
}

// ======================================================================
// 558: StringReader line processing / scenario 8
// Read CRLF/LF/CR lines, trim each, retain lines of length>=8. Dispose reader. Trailing newline does not create a retained blank line.
// Hint: ReadLine returns null at end, distinct from an empty line.
// Practice: --practice 558; reference: --verify 558
static class E558 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 558");
 }
 public static string[] Reference(string text) {
  using var reader=new StringReader(text);var result=new List<string>();string? line;while((line=reader.ReadLine()) is not null){var trimmed=line.Trim();if(trimmed.Length>=8)result.Add(trimmed);}return result.ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaaaaaa", "bbbbbbbb" }, Solve(" aaaaaaaa \r\nbbbbbbbb\n"));
  Check.Equal(new string[] {  }, Solve(""));
  Check.Equal(new string[] {  }, Solve("xxxxxxx"));
 }
}

// ======================================================================
// 559: StringReader line processing / scenario 9
// Read CRLF/LF/CR lines, trim each, retain lines of length>=9. Dispose reader. Trailing newline does not create a retained blank line.
// Hint: ReadLine returns null at end, distinct from an empty line.
// Practice: --practice 559; reference: --verify 559
static class E559 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 559");
 }
 public static string[] Reference(string text) {
  using var reader=new StringReader(text);var result=new List<string>();string? line;while((line=reader.ReadLine()) is not null){var trimmed=line.Trim();if(trimmed.Length>=9)result.Add(trimmed);}return result.ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaaaaaaa", "bbbbbbbbb" }, Solve(" aaaaaaaaa \r\nbbbbbbbbb\n"));
  Check.Equal(new string[] {  }, Solve(""));
  Check.Equal(new string[] {  }, Solve("xxxxxxxx"));
 }
}

// ======================================================================
// 560: StringReader line processing / scenario 10
// Read CRLF/LF/CR lines, trim each, retain lines of length>=10. Dispose reader. Trailing newline does not create a retained blank line.
// Hint: ReadLine returns null at end, distinct from an empty line.
// Practice: --practice 560; reference: --verify 560
static class E560 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 560");
 }
 public static string[] Reference(string text) {
  using var reader=new StringReader(text);var result=new List<string>();string? line;while((line=reader.ReadLine()) is not null){var trimmed=line.Trim();if(trimmed.Length>=10)result.Add(trimmed);}return result.ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaaaaaaaa", "bbbbbbbbbb" }, Solve(" aaaaaaaaaa \r\nbbbbbbbbbb\n"));
  Check.Equal(new string[] {  }, Solve(""));
  Check.Equal(new string[] {  }, Solve("xxxxxxxxx"));
 }
}

// ======================================================================
// 561: StringReader line processing / scenario 11
// Read CRLF/LF/CR lines, trim each, retain lines of length>=11. Dispose reader. Trailing newline does not create a retained blank line.
// Hint: ReadLine returns null at end, distinct from an empty line.
// Practice: --practice 561; reference: --verify 561
static class E561 {

 public static string[] Practice(string text) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 561");
 }
 public static string[] Reference(string text) {
  using var reader=new StringReader(text);var result=new List<string>();string? line;while((line=reader.ReadLine()) is not null){var trimmed=line.Trim();if(trimmed.Length>=11)result.Add(trimmed);}return result.ToArray();
 }
 private static string[] Solve(string text) => Check.PracticeMode ? Practice(text) : Reference(text);
 public static void Verify() {
  Check.Equal(new string[] { "aaaaaaaaaaa", "bbbbbbbbbbb" }, Solve(" aaaaaaaaaaa \r\nbbbbbbbbbbb\n"));
  Check.Equal(new string[] {  }, Solve(""));
  Check.Equal(new string[] {  }, Solve("xxxxxxxxxx"));
 }
}

// ======================================================================
// 562: Exception filters and domain errors / scenario 1
// Negative input throws ArgumentOutOfRangeException. Nonnegative input below1 becomes retry through an exception filter catching only InvalidOperationException("small"). At/above threshold returns ok.
// Hint: Do not catch Exception broadly and hide programming errors.
// Practice: --practice 562; reference: --verify 562
static class E562 {

 public static string Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 562");
 }
 public static string Reference(int value) {
  try { if(value<0)throw new ArgumentOutOfRangeException(nameof(value)); if(value<1)throw new InvalidOperationException("small");return "ok"; } catch(InvalidOperationException error) when(error.Message=="small") { return "retry"; }
 }
 private static string Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal("retry", Solve(0));
  Check.Equal("ok", Solve(1));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 563: Exception filters and domain errors / scenario 2
// Negative input throws ArgumentOutOfRangeException. Nonnegative input below2 becomes retry through an exception filter catching only InvalidOperationException("small"). At/above threshold returns ok.
// Hint: Do not catch Exception broadly and hide programming errors.
// Practice: --practice 563; reference: --verify 563
static class E563 {

 public static string Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 563");
 }
 public static string Reference(int value) {
  try { if(value<0)throw new ArgumentOutOfRangeException(nameof(value)); if(value<2)throw new InvalidOperationException("small");return "ok"; } catch(InvalidOperationException error) when(error.Message=="small") { return "retry"; }
 }
 private static string Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal("retry", Solve(0));
  Check.Equal("ok", Solve(2));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 564: Exception filters and domain errors / scenario 3
// Negative input throws ArgumentOutOfRangeException. Nonnegative input below3 becomes retry through an exception filter catching only InvalidOperationException("small"). At/above threshold returns ok.
// Hint: Do not catch Exception broadly and hide programming errors.
// Practice: --practice 564; reference: --verify 564
static class E564 {

 public static string Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 564");
 }
 public static string Reference(int value) {
  try { if(value<0)throw new ArgumentOutOfRangeException(nameof(value)); if(value<3)throw new InvalidOperationException("small");return "ok"; } catch(InvalidOperationException error) when(error.Message=="small") { return "retry"; }
 }
 private static string Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal("retry", Solve(0));
  Check.Equal("ok", Solve(3));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 565: Exception filters and domain errors / scenario 4
// Negative input throws ArgumentOutOfRangeException. Nonnegative input below4 becomes retry through an exception filter catching only InvalidOperationException("small"). At/above threshold returns ok.
// Hint: Do not catch Exception broadly and hide programming errors.
// Practice: --practice 565; reference: --verify 565
static class E565 {

 public static string Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 565");
 }
 public static string Reference(int value) {
  try { if(value<0)throw new ArgumentOutOfRangeException(nameof(value)); if(value<4)throw new InvalidOperationException("small");return "ok"; } catch(InvalidOperationException error) when(error.Message=="small") { return "retry"; }
 }
 private static string Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal("retry", Solve(0));
  Check.Equal("ok", Solve(4));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 566: Exception filters and domain errors / scenario 5
// Negative input throws ArgumentOutOfRangeException. Nonnegative input below5 becomes retry through an exception filter catching only InvalidOperationException("small"). At/above threshold returns ok.
// Hint: Do not catch Exception broadly and hide programming errors.
// Practice: --practice 566; reference: --verify 566
static class E566 {

 public static string Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 566");
 }
 public static string Reference(int value) {
  try { if(value<0)throw new ArgumentOutOfRangeException(nameof(value)); if(value<5)throw new InvalidOperationException("small");return "ok"; } catch(InvalidOperationException error) when(error.Message=="small") { return "retry"; }
 }
 private static string Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal("retry", Solve(0));
  Check.Equal("ok", Solve(5));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 567: Exception filters and domain errors / scenario 6
// Negative input throws ArgumentOutOfRangeException. Nonnegative input below6 becomes retry through an exception filter catching only InvalidOperationException("small"). At/above threshold returns ok.
// Hint: Do not catch Exception broadly and hide programming errors.
// Practice: --practice 567; reference: --verify 567
static class E567 {

 public static string Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 567");
 }
 public static string Reference(int value) {
  try { if(value<0)throw new ArgumentOutOfRangeException(nameof(value)); if(value<6)throw new InvalidOperationException("small");return "ok"; } catch(InvalidOperationException error) when(error.Message=="small") { return "retry"; }
 }
 private static string Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal("retry", Solve(0));
  Check.Equal("ok", Solve(6));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 568: Exception filters and domain errors / scenario 7
// Negative input throws ArgumentOutOfRangeException. Nonnegative input below7 becomes retry through an exception filter catching only InvalidOperationException("small"). At/above threshold returns ok.
// Hint: Do not catch Exception broadly and hide programming errors.
// Practice: --practice 568; reference: --verify 568
static class E568 {

 public static string Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 568");
 }
 public static string Reference(int value) {
  try { if(value<0)throw new ArgumentOutOfRangeException(nameof(value)); if(value<7)throw new InvalidOperationException("small");return "ok"; } catch(InvalidOperationException error) when(error.Message=="small") { return "retry"; }
 }
 private static string Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal("retry", Solve(0));
  Check.Equal("ok", Solve(7));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 569: Exception filters and domain errors / scenario 8
// Negative input throws ArgumentOutOfRangeException. Nonnegative input below8 becomes retry through an exception filter catching only InvalidOperationException("small"). At/above threshold returns ok.
// Hint: Do not catch Exception broadly and hide programming errors.
// Practice: --practice 569; reference: --verify 569
static class E569 {

 public static string Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 569");
 }
 public static string Reference(int value) {
  try { if(value<0)throw new ArgumentOutOfRangeException(nameof(value)); if(value<8)throw new InvalidOperationException("small");return "ok"; } catch(InvalidOperationException error) when(error.Message=="small") { return "retry"; }
 }
 private static string Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal("retry", Solve(0));
  Check.Equal("ok", Solve(8));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 570: Exception filters and domain errors / scenario 9
// Negative input throws ArgumentOutOfRangeException. Nonnegative input below9 becomes retry through an exception filter catching only InvalidOperationException("small"). At/above threshold returns ok.
// Hint: Do not catch Exception broadly and hide programming errors.
// Practice: --practice 570; reference: --verify 570
static class E570 {

 public static string Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 570");
 }
 public static string Reference(int value) {
  try { if(value<0)throw new ArgumentOutOfRangeException(nameof(value)); if(value<9)throw new InvalidOperationException("small");return "ok"; } catch(InvalidOperationException error) when(error.Message=="small") { return "retry"; }
 }
 private static string Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal("retry", Solve(0));
  Check.Equal("ok", Solve(9));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 571: Exception filters and domain errors / scenario 10
// Negative input throws ArgumentOutOfRangeException. Nonnegative input below10 becomes retry through an exception filter catching only InvalidOperationException("small"). At/above threshold returns ok.
// Hint: Do not catch Exception broadly and hide programming errors.
// Practice: --practice 571; reference: --verify 571
static class E571 {

 public static string Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 571");
 }
 public static string Reference(int value) {
  try { if(value<0)throw new ArgumentOutOfRangeException(nameof(value)); if(value<10)throw new InvalidOperationException("small");return "ok"; } catch(InvalidOperationException error) when(error.Message=="small") { return "retry"; }
 }
 private static string Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal("retry", Solve(0));
  Check.Equal("ok", Solve(10));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 572: Exception filters and domain errors / scenario 11
// Negative input throws ArgumentOutOfRangeException. Nonnegative input below11 becomes retry through an exception filter catching only InvalidOperationException("small"). At/above threshold returns ok.
// Hint: Do not catch Exception broadly and hide programming errors.
// Practice: --practice 572; reference: --verify 572
static class E572 {

 public static string Practice(int value) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 572");
 }
 public static string Reference(int value) {
  try { if(value<0)throw new ArgumentOutOfRangeException(nameof(value)); if(value<11)throw new InvalidOperationException("small");return "ok"; } catch(InvalidOperationException error) when(error.Message=="small") { return "retry"; }
 }
 private static string Solve(int value) => Check.PracticeMode ? Practice(value) : Reference(value);
 public static void Verify() {
  Check.Equal("retry", Solve(0));
  Check.Equal("ok", Solve(11));
  Check.Throws<ArgumentOutOfRangeException>(() => { Solve(-1); });
 }
}

// ======================================================================
// 573: StringBuilder delimited formatting / scenario 1
// Format prefix 'S0:' followed by values joined with '|'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.
// Hint: A first-item flag distinguishes empty sequence from an empty element.
// Practice: --practice 573; reference: --verify 573
static class E573 {

 public static string Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 573");
 }
 public static string Reference(IEnumerable<string> values) {
  var builder=new StringBuilder("S0:");bool first=true;foreach(var value in values){if(!first)builder.Append('|');builder.Append(value);first=false;}return builder.ToString();
 }
 private static string Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal("S0:", Solve(Array.Empty<string>()));
  Check.Equal("S0:a|b", Solve(new[] { "a","b" }));
  Check.Equal("S0:|x", Solve(new[] { "","x" }));
 }
}

// ======================================================================
// 574: StringBuilder delimited formatting / scenario 2
// Format prefix 'S1:' followed by values joined with ','. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.
// Hint: A first-item flag distinguishes empty sequence from an empty element.
// Practice: --practice 574; reference: --verify 574
static class E574 {

 public static string Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 574");
 }
 public static string Reference(IEnumerable<string> values) {
  var builder=new StringBuilder("S1:");bool first=true;foreach(var value in values){if(!first)builder.Append(',');builder.Append(value);first=false;}return builder.ToString();
 }
 private static string Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal("S1:", Solve(Array.Empty<string>()));
  Check.Equal("S1:a,b", Solve(new[] { "a","b" }));
  Check.Equal("S1:,x", Solve(new[] { "","x" }));
 }
}

// ======================================================================
// 575: StringBuilder delimited formatting / scenario 3
// Format prefix 'S2:' followed by values joined with ';'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.
// Hint: A first-item flag distinguishes empty sequence from an empty element.
// Practice: --practice 575; reference: --verify 575
static class E575 {

 public static string Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 575");
 }
 public static string Reference(IEnumerable<string> values) {
  var builder=new StringBuilder("S2:");bool first=true;foreach(var value in values){if(!first)builder.Append(';');builder.Append(value);first=false;}return builder.ToString();
 }
 private static string Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal("S2:", Solve(Array.Empty<string>()));
  Check.Equal("S2:a;b", Solve(new[] { "a","b" }));
  Check.Equal("S2:;x", Solve(new[] { "","x" }));
 }
}

// ======================================================================
// 576: StringBuilder delimited formatting / scenario 4
// Format prefix 'S3:' followed by values joined with ':'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.
// Hint: A first-item flag distinguishes empty sequence from an empty element.
// Practice: --practice 576; reference: --verify 576
static class E576 {

 public static string Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 576");
 }
 public static string Reference(IEnumerable<string> values) {
  var builder=new StringBuilder("S3:");bool first=true;foreach(var value in values){if(!first)builder.Append(':');builder.Append(value);first=false;}return builder.ToString();
 }
 private static string Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal("S3:", Solve(Array.Empty<string>()));
  Check.Equal("S3:a:b", Solve(new[] { "a","b" }));
  Check.Equal("S3::x", Solve(new[] { "","x" }));
 }
}

// ======================================================================
// 577: StringBuilder delimited formatting / scenario 5
// Format prefix 'S4:' followed by values joined with '/'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.
// Hint: A first-item flag distinguishes empty sequence from an empty element.
// Practice: --practice 577; reference: --verify 577
static class E577 {

 public static string Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 577");
 }
 public static string Reference(IEnumerable<string> values) {
  var builder=new StringBuilder("S4:");bool first=true;foreach(var value in values){if(!first)builder.Append('/');builder.Append(value);first=false;}return builder.ToString();
 }
 private static string Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal("S4:", Solve(Array.Empty<string>()));
  Check.Equal("S4:a/b", Solve(new[] { "a","b" }));
  Check.Equal("S4:/x", Solve(new[] { "","x" }));
 }
}

// ======================================================================
// 578: StringBuilder delimited formatting / scenario 6
// Format prefix 'S5:' followed by values joined with '|'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.
// Hint: A first-item flag distinguishes empty sequence from an empty element.
// Practice: --practice 578; reference: --verify 578
static class E578 {

 public static string Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 578");
 }
 public static string Reference(IEnumerable<string> values) {
  var builder=new StringBuilder("S5:");bool first=true;foreach(var value in values){if(!first)builder.Append('|');builder.Append(value);first=false;}return builder.ToString();
 }
 private static string Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal("S5:", Solve(Array.Empty<string>()));
  Check.Equal("S5:a|b", Solve(new[] { "a","b" }));
  Check.Equal("S5:|x", Solve(new[] { "","x" }));
 }
}

// ======================================================================
// 579: StringBuilder delimited formatting / scenario 7
// Format prefix 'S6:' followed by values joined with ','. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.
// Hint: A first-item flag distinguishes empty sequence from an empty element.
// Practice: --practice 579; reference: --verify 579
static class E579 {

 public static string Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 579");
 }
 public static string Reference(IEnumerable<string> values) {
  var builder=new StringBuilder("S6:");bool first=true;foreach(var value in values){if(!first)builder.Append(',');builder.Append(value);first=false;}return builder.ToString();
 }
 private static string Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal("S6:", Solve(Array.Empty<string>()));
  Check.Equal("S6:a,b", Solve(new[] { "a","b" }));
  Check.Equal("S6:,x", Solve(new[] { "","x" }));
 }
}

// ======================================================================
// 580: StringBuilder delimited formatting / scenario 8
// Format prefix 'S7:' followed by values joined with ';'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.
// Hint: A first-item flag distinguishes empty sequence from an empty element.
// Practice: --practice 580; reference: --verify 580
static class E580 {

 public static string Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 580");
 }
 public static string Reference(IEnumerable<string> values) {
  var builder=new StringBuilder("S7:");bool first=true;foreach(var value in values){if(!first)builder.Append(';');builder.Append(value);first=false;}return builder.ToString();
 }
 private static string Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal("S7:", Solve(Array.Empty<string>()));
  Check.Equal("S7:a;b", Solve(new[] { "a","b" }));
  Check.Equal("S7:;x", Solve(new[] { "","x" }));
 }
}

// ======================================================================
// 581: StringBuilder delimited formatting / scenario 9
// Format prefix 'S8:' followed by values joined with ':'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.
// Hint: A first-item flag distinguishes empty sequence from an empty element.
// Practice: --practice 581; reference: --verify 581
static class E581 {

 public static string Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 581");
 }
 public static string Reference(IEnumerable<string> values) {
  var builder=new StringBuilder("S8:");bool first=true;foreach(var value in values){if(!first)builder.Append(':');builder.Append(value);first=false;}return builder.ToString();
 }
 private static string Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal("S8:", Solve(Array.Empty<string>()));
  Check.Equal("S8:a:b", Solve(new[] { "a","b" }));
  Check.Equal("S8::x", Solve(new[] { "","x" }));
 }
}

// ======================================================================
// 582: StringBuilder delimited formatting / scenario 10
// Format prefix 'S9:' followed by values joined with '/'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.
// Hint: A first-item flag distinguishes empty sequence from an empty element.
// Practice: --practice 582; reference: --verify 582
static class E582 {

 public static string Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 582");
 }
 public static string Reference(IEnumerable<string> values) {
  var builder=new StringBuilder("S9:");bool first=true;foreach(var value in values){if(!first)builder.Append('/');builder.Append(value);first=false;}return builder.ToString();
 }
 private static string Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal("S9:", Solve(Array.Empty<string>()));
  Check.Equal("S9:a/b", Solve(new[] { "a","b" }));
  Check.Equal("S9:/x", Solve(new[] { "","x" }));
 }
}

// ======================================================================
// 583: StringBuilder delimited formatting / scenario 11
// Format prefix 'S10:' followed by values joined with '|'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.
// Hint: A first-item flag distinguishes empty sequence from an empty element.
// Practice: --practice 583; reference: --verify 583
static class E583 {

 public static string Practice(IEnumerable<string> values) {
  // TODO: implement the exercise without calling Reference.
  throw new NotImplementedException("Exercise 583");
 }
 public static string Reference(IEnumerable<string> values) {
  var builder=new StringBuilder("S10:");bool first=true;foreach(var value in values){if(!first)builder.Append('|');builder.Append(value);first=false;}return builder.ToString();
 }
 private static string Solve(IEnumerable<string> values) => Check.PracticeMode ? Practice(values) : Reference(values);
 public static void Verify() {
  Check.Equal("S10:", Solve(Array.Empty<string>()));
  Check.Equal("S10:a|b", Solve(new[] { "a","b" }));
  Check.Equal("S10:|x", Solve(new[] { "","x" }));
 }
}
