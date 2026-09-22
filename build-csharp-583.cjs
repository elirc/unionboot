'use strict';
// Authoring tool only; CSHARP-583.cs is standalone and does not need Node.
// 53 topic families × 11 labelled scenarios = 583 exercises.
const fs=require('node:fs'),path=require('node:path');
const target=path.join(__dirname,'CSHARP-583.cs');
if(fs.existsSync(target))throw new Error('Refusing to replace an existing C# exercise file.');
const families=[];
const F=(title,make)=>families.push({title,make});
const cs=s=>JSON.stringify(s);
const ints=a=>'new int[] { '+a.join(', ')+' }';
const strings=a=>'new string[] { '+a.map(cs).join(', ')+' }';
const eq=(expected,call)=>`Check.Equal(${expected}, ${call});`;
const raises=(type,call)=>`Check.Throws<${type}>(() => { ${call}; });`;
const spec=(signature,body,requirements,hint,tests,extra='')=>({signature,body,requirements,hint,tests,extra});
F('Checked integer accumulation',v=>{const limit=v+1;return spec('long Solve(IReadOnlyList<int> values)',`long total = 0; foreach (var value in values) if (value >= ${limit}) total += value; return total;`,
`Sum only values >= ${limit}. Return long, avoiding int overflow. Empty input returns0. Do not mutate input.`,
'Accumulate into long before adding; a LINQ int Sum can overflow.',[
eq('0L','Solve(Array.Empty<int>())'),eq(`${limit*2+3}L`,`Solve(${ints([limit-1,limit,limit+3])})`),eq('4294967294L','Solve(new[] { int.MaxValue, int.MaxValue })')]);});
F('Stable LINQ filtering and projection',v=>{const n=v+2;return spec('string[] Solve(IEnumerable<int> values)',`return values.Where(n => n % ${n} == 0).Select(n => $"item:{n}").ToArray();`,
`Select integers divisible by ${n}, format each as item:NUMBER, preserving order and duplicates. Use invariant integer formatting.`,
'Filtering is lazy until ToArray materializes it.',[
eq(strings([]),'Solve(Array.Empty<int>())'),eq(strings([`item:${n}`,`item:${-n}`,`item:${n}`]),`Solve(${ints([n,1,-n,n])})`),eq(strings(['item:0']),`Solve(${ints([0,n+1])})`)]);});
F('Dictionary frequency counting',v=>{const ignore=v%2===1,min=v+1;const a='Tea',b=ignore?'tea':'Tea';return spec('SortedDictionary<string, int> Solve(IEnumerable<string> words)',`var counts = new Dictionary<string,int>(${ignore?'StringComparer.OrdinalIgnoreCase':'StringComparer.Ordinal'}); foreach (var word in words) { ${ignore?'var key = word.ToLowerInvariant();':'var key = word;'} counts[key] = counts.GetValueOrDefault(key) + 1; } var result = new SortedDictionary<string,int>(StringComparer.Ordinal); foreach (var pair in counts) if (pair.Value >= ${min}) result[pair.Key] = pair.Value; return result;`,
`Count words with ${ignore?'ordinal case-insensitive comparison and lowercase output keys':'ordinal case-sensitive comparison'}. Retain counts >=${min}; sort output keys ordinally. Empty input returns an empty dictionary.`,
'Dictionary comparison and output normalization are separate choices.',[
eq('new SortedDictionary<string,int>()','Solve(Array.Empty<string>())'),eq(`new SortedDictionary<string,int> { [${cs(b)}] = ${min} }`,`Solve(Enumerable.Repeat(${cs(a)}, ${min}))`),eq('new SortedDictionary<string,int>()',`Solve(Enumerable.Repeat("x", ${min-1}))`)]);});
F('Numeric sorting with tie rules',v=>{const desc=v%2===1,k=v+1;const arr=[1,4,2,4,3],out=[...arr].sort((a,b)=>desc?b-a:a-b).slice(0,k);return spec('int[] Solve(IEnumerable<int> values)',`return values.${desc?'OrderByDescending':'OrderBy'}(n => n).Take(${k}).ToArray();`,
`Return at most ${k} values sorted ${desc?'descending':'ascending'}. Retain duplicates; never sort the caller's array in place.`,
'OrderBy returns a new sequence; List.Sort would mutate a list.',[
eq(ints(out),`Solve(${ints(arr)})`),eq(ints([]),'Solve(Array.Empty<int>())'),eq(ints([-2]),'Solve(new[] { -2 })'),`var input = new[] { 3, 1, 2 }; _ = Solve(input); Check.Equal(new[] { 3, 1, 2 }, input);`]);});
F('Sliding window sums',v=>{const width=v+1;return spec('long[] Solve(IReadOnlyList<int> values)',`const int width = ${width}; var result = new List<long>(); long sum = 0; for (int i = 0; i < values.Count; i++) { sum += values[i]; if (i >= width) sum -= values[i-width]; if (i >= width-1) result.Add(sum); } return result.ToArray();`,
`Return sums for all contiguous windows of width${width}. Fewer than width values yields[]. O(n) time; long sums.`,
'Add the entering element and subtract the departing one.',[
eq('Array.Empty<long>()','Solve(Array.Empty<int>())'),eq(`new long[] { ${width}, ${width} }`,`Solve(Enumerable.Repeat(1, ${width+1}).ToArray())`),eq(`new long[] { ${-2*width} }`,`Solve(Enumerable.Repeat(-2, ${width}).ToArray())`)]);});
F('Validated pagination records',v=>{const size=v+1;return spec('Page Solve(IReadOnlyList<int> values, int requestedPage)',`if (requestedPage < 1) throw new ArgumentOutOfRangeException(nameof(requestedPage)); int totalPages = (int)Math.Ceiling(values.Count / (double)${size}); int page = Math.Min(requestedPage, Math.Max(1, totalPages)); return new Page(values.Skip((page-1)*${size}).Take(${size}).ToArray(), page, totalPages);`,
`Page size${size}. Requested page must be >=1; clamp to last page. Empty input has effective page1 and totalPages0. Return Page(Items,Number,TotalPages).`,
'Validate, compute total pages, clamp, then slice.',[
eq('new Page(Array.Empty<int>(), 1, 0)','Solve(Array.Empty<int>(), 99)'),eq(`new Page(new[] { ${size+1} }, 2, 2)`,`Solve(Enumerable.Range(1, ${size+1}).ToArray(), 99)`),raises('ArgumentOutOfRangeException','Solve(Array.Empty<int>(), 0)')], 'public sealed record Page(int[] Items, int Number, int TotalPages);');});
F('Ordinal text normalization',v=>{const modes=['upper','lower','trim','collapse'],mode=modes[v%4],max=v+3;const normalize=s=>{let r=mode==='upper'?s.toUpperCase():mode==='lower'?s.toLowerCase():mode==='trim'?s.trim():s.trim().replace(/\s+/g,' ');return r.slice(0,max);};return spec('string Solve(string text)',`ArgumentNullException.ThrowIfNull(text); var normalized = ${mode==='upper'?'text.ToUpperInvariant()':mode==='lower'?'text.ToLowerInvariant()':mode==='trim'?'text.Trim()':'Regex.Replace(text.Trim(), @"\\s+", " ")'}; return normalized.Length <= ${max} ? normalized : normalized[..${max}];`,
`Apply ${mode} normalization, then limit to${max} UTF-16 code units. upper/lower use invariant culture; collapse means trim and collapse whitespace to one space. Null throws ArgumentNullException.`,
'Normalization happens before truncation. This exercise counts UTF-16 units, not graphemes.',[
eq(cs(normalize('  HeLLo  x  ')),'Solve("  HeLLo  x  ")'),eq('""','Solve("")'),eq(cs(normalize('a')),'Solve("a")'),raises('ArgumentNullException','Solve(null!)')]);});
F('Safe integer parsing with TryParse',v=>{const min=v-5;return spec('int[] Solve(IEnumerable<string> values)',`var result = new List<int>(); foreach (var value in values) if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) && n >= ${min}) result.Add(n); return result.ToArray();`,
`Parse invariant signed int32 strings with surrounding whitespace. Ignore invalid, overflowing, and values below${min}. Preserve order.`,
'TryParse communicates failure without exceptions.',[
eq(ints([min,min+2]),`Solve(${strings([String(min),'bad','2147483648',String(min+2),String(min-1)])})`),eq(ints([]),'Solve(Array.Empty<string>())'),eq(ints([20]),'Solve(new[] { " +20 " })')]);});
F('Decimal pricing and midpoint rounding',v=>{const places=v%3,mode=v%2?'AwayFromZero':'ToEven',rate=(v+1)/100;function rounded(x){const f=10**places;return Math.round((x+1e-10)*f)/f;}return spec('decimal Solve(decimal subtotal)',`if (subtotal < 0) throw new ArgumentOutOfRangeException(nameof(subtotal)); return Math.Round(subtotal * (1m + ${(v+1)}m / 100m), ${places}, MidpointRounding.${mode});`,
`Apply${v+1}% tax to a nonnegative decimal subtotal, then round to${places} places using ${mode}. Reject negative subtotal. No binary floating-point conversion.`,
'Use decimal literals with the m suffix throughout.',[
eq('0m','Solve(0m)'),eq(`${100+v+1}m`,'Solve(100m)'),eq(`${rounded(200*(1+rate))}m`,'Solve(200m)'),raises('ArgumentOutOfRangeException','Solve(-1m)')]);});
F('Flags enum permissions',v=>{const mask=v%7+1;return spec('bool Solve(Permission granted)',`const Permission required = (Permission)${mask}; return (granted & required) == required;`,
`Return true iff granted includes every bit of mask${mask}. Read=1,Write=2,Execute=4. Extra flags do not invalidate access.`,
'Checking any bit is not the same as checking every required bit.',[
eq('true',`Solve((Permission)${mask})`),eq('true','Solve((Permission)15)'),eq('false','Solve(Permission.None)'),eq(mask===1?'true':'false','Solve(Permission.Read)')], '[Flags] public enum Permission { None=0, Read=1, Write=2, Execute=4 }');});
F('Pattern matching result types',v=>{const bonus=v+1;return spec('string Solve(Result result)',`return result switch { Success { Value: var n } => $"ok:{n + ${bonus}}", Failure { Message: var message } => $"error:{message}", _ => throw new ArgumentException("Unknown result") };`,
`Match Success(int Value) and Failure(string Message). Success formats ok:(Value+${bonus}); failure formats error:MESSAGE. Null or unknown subclasses throw ArgumentException.`,
'Record inheritance supplies data variants; a switch expression handles each case.',[
eq(cs(`ok:${bonus+2}`),'Solve(new Success(2))'),eq('"error:offline"','Solve(new Failure("offline"))'),raises('ArgumentException','Solve(null!)')], 'public abstract record Result; public sealed record Success(int Value):Result; public sealed record Failure(string Message):Result;');});
F('Immutable record updates',v=>{const delta=v+1;return spec('Account Solve(Account account)',`return account with { Balance = checked(account.Balance + ${delta}) };`,
`Return a new Account with Balance increased by${delta}, Name unchanged. Preserve original. Throw OverflowException on int overflow.`,
'The with expression copies a record without mutating its source.',[
eq('new Account("Ada", '+(delta+4)+')','Solve(new Account("Ada", 4))'),`var a = new Account("A", 0); var b = Solve(a); Check.Equal(0, a.Balance); Check.True(!ReferenceEquals(a,b));`,raises('OverflowException','Solve(new Account("A", int.MaxValue))')], 'public sealed record Account(string Name, int Balance);');});
F('Nullable fallback rules',v=>{const fallback=v-5;return spec('int Solve(int? value)',`return value ?? ${fallback};`,
`Return supplied nullable integer or fallback${fallback} when null. Preserve0 and negative values; do not use truthiness-style rules.`,
'Null-coalescing examines null, not the numeric value.',[
eq(String(fallback),'Solve(null)'),eq('0','Solve(0)'),eq('-20','Solve(-20)'),eq('20','Solve(20)')]);});
F('Generic stable deduplication',v=>{const cap=v+1;return spec('T[] Solve<T>(IEnumerable<T> values) where T : notnull',`var seen = new HashSet<T>(); var result = new List<T>(); foreach(var value in values) if(seen.Add(value)) { result.Add(value); if(result.Count == ${cap}) break; } return result.ToArray();`,
`Return up to${cap} distinct values in first occurrence order, using EqualityComparer<T>.Default. Generic constraint T:notnull. Stop enumerating once cap reached.`,
'A HashSet detects duplicates while a List retains order.',[
eq(ints([1,2,3].slice(0,cap)),'Solve(new[] { 1, 1, 2, 3 })'),eq(strings(['a','b'].slice(0,cap)),'Solve(new[] { "a", "a", "b" })'),eq(ints([]),'Solve(Array.Empty<int>())')]);});
F('Custom equality comparers',v=>{const ignore=v%2===1;return spec('int Solve(IEnumerable<string> names)',`return names.Distinct(${ignore?'StringComparer.OrdinalIgnoreCase':'StringComparer.Ordinal'}).Count();`,
`Count distinct strings using ${ignore?'OrdinalIgnoreCase':'Ordinal'} comparison. Culture-independent; do not trim whitespace. Scenario${v+1}.`,
'Passing the comparer avoids allocating normalized strings.',[
eq(ignore?'2':'3','Solve(new[] { "Ada", "ada", "Bo" })'),eq('0','Solve(Array.Empty<string>())'),eq('2','Solve(new[] { "a", " a" })')]);});
F('Lazy iterator sampling',v=>{const stride=v+1;return spec('IEnumerable<int> Solve(IEnumerable<int> values)',`int index = 0; foreach (var value in values) { if(index % ${stride} == 0) yield return value; index++; }`,
`Lazily yield elements at zero-based indices divisible by${stride}. Do not enumerate until requested. Preserve order, support finite prefixes of infinite sequences.`,
'yield return builds a state machine; it should not call ToArray internally.',[
eq(ints([0,stride,stride*2]),`Solve(Enumerable.Range(0, ${stride*3})).ToArray()`),eq(ints([]),'Solve(Array.Empty<int>()).ToArray()'),`int visited=0; IEnumerable<int> Source(){for(int i=0;i<100;i++){visited++;yield return i;}} var lazy=Solve(Source()); Check.Equal(0,visited); Check.Equal(0,lazy.First()); Check.Equal(1,visited);`]);});
F('Span-based parsing',v=>{const sep=[':',',',';','|'][v%4];return spec('int Solve(ReadOnlySpan<char> text)',`int split = text.IndexOf('${sep}'); var token = split < 0 ? text : text[..split]; if (!int.TryParse(token, NumberStyles.Integer, CultureInfo.InvariantCulture, out var value)) throw new FormatException("Invalid first integer"); return value;`,
`Read first signed int32 before '${sep}' using ReadOnlySpan<char>. If delimiter absent use entire input. Ignore suffix. Invalid/overflowing first token throws FormatException.`,
'Span slicing avoids allocating a substring.',[
eq('42',`Solve("42${sep}ignored".AsSpan())`),eq('-2','Solve(" -2 ".AsSpan())'),raises('FormatException',`Solve("x${sep}1".AsSpan())`),raises('FormatException','Solve("2147483648".AsSpan())')]);});
F('Unicode Rune counting',v=>{const min=65+v;return spec('int Solve(string text)',`int count=0; foreach(var rune in text.EnumerateRunes()) if(rune.Value >= ${min}) count++; return count;`,
`Count Unicode scalar values with code point >=${min}. Enumerate Run es rather than char so surrogate pairs count once. Inputs are well-formed UTF-16.`,
'String.Length counts code units; Rune enumeration counts scalar values.',[
eq('0','Solve("")'),eq('1',`Solve(${cs(String.fromCharCode(min))})`),eq('1','Solve("😀")'),eq('0','Solve("012")')]);});
F('Regular expression capture extraction',v=>{const min=v+1;return spec('string[] Solve(string text)',`return Regex.Matches(text, @"[A-Za-z]+").Select(m => m.Value).Where(word => word.Length >= ${min}).ToArray();`,
`Extract maximal ASCII-letter runs, retaining words of length >=${min}. Preserve case/order. Digits/punctuation split runs.`,
'Regex.Matches supplies Match objects; project Value explicitly.',[
eq(strings(['a'.repeat(min)]),`Solve(${cs('x'.repeat(min-1)+'1'+'a'.repeat(min))})`),eq(strings([]),'Solve("123--")'),eq(strings([]),'Solve("")')]);});
F('JSON property selection',v=>{const key='field'+v;return spec('int? Solve(string json)',`using var doc = JsonDocument.Parse(json); if(doc.RootElement.ValueKind != JsonValueKind.Object) return null; if(!doc.RootElement.TryGetProperty("${key}", out var property) || property.ValueKind != JsonValueKind.Number || !property.TryGetInt32(out var n)) return null; return n;`,
`Parse JSON; return int32 property '${key}' only if root is object and property is an integer number. Missing, wrong type, overflow returns null. Invalid JSON throws JsonException. Dispose document.`,
'JsonElement values depend on document lifetime; return a copied int, not the element.',[
eq('(int?)7',`Solve(${cs(JSON.stringify({[key]:7}))})`),eq('(int?)null',`Solve(${cs(JSON.stringify({[key]:'7'}))})`),eq('(int?)null','Solve("[]")'),raises('JsonException','Solve("{")')]);});
F('DateOnly calendar arithmetic',v=>{const days=v+1;return spec('DateOnly Solve(DateOnly date)',`return date.AddDays(${days});`,
`Add${days} calendar days to DateOnly, including leap days and month boundaries. Do not treat dates as culture-dependent strings.`,
'DateOnly.AddDays handles calendar transitions.',[
eq(`new DateOnly(2024, 3, ${days-1||1})`,days===1?'Solve(new DateOnly(2024, 2, 29))':`Solve(new DateOnly(2024, 2, 29))`),eq(`new DateOnly(2025, 1, ${days})`,'Solve(new DateOnly(2024, 12, 31))'),eq(`new DateOnly(2024, 1, ${days+1})`,'Solve(new DateOnly(2024, 1, 1))')]);});
F('TimeOnly wraparound',v=>{const minutes=15*(v+1);return spec('TimeOnly Solve(TimeOnly time)',`return time.AddMinutes(${minutes});`,
`Add${minutes} minutes and wrap at midnight. Return TimeOnly, ignoring date.`,
'TimeOnly handles the24-hour wrap automatically.',[
eq(`new TimeOnly(${Math.floor(minutes/60)}, ${minutes%60})`,'Solve(new TimeOnly(0, 0))'),eq(`new TimeOnly(${Math.floor((23*60+50+minutes)%1440/60)}, ${(23*60+50+minutes)%60})`,'Solve(new TimeOnly(23, 50))'),eq(`new TimeOnly(${12+Math.floor(minutes/60)}, ${minutes%60})`,'Solve(new TimeOnly(12, 0))')]);});
F('DateTimeOffset instant comparison',v=>{const span=v+1;return spec('bool Solve(DateTimeOffset start, DateTimeOffset end)',`return end - start >= TimeSpan.FromMinutes(${span});`,
`Return true when elapsed real time from start to end is at least${span} minutes. Offsets may differ; compare instants, not clock-face hours.`,
'DateTimeOffset subtraction normalizes offsets.',[
eq('true',`Solve(DateTimeOffset.Parse("2024-01-01T00:00:00Z"), DateTimeOffset.Parse("2024-01-01T00:${String(span).padStart(2,'0')}:00Z"))`),eq('false','Solve(DateTimeOffset.Parse("2024-01-01T01:00:00+01:00"), DateTimeOffset.Parse("2024-01-01T00:00:00Z"))'),eq('false','Solve(DateTimeOffset.Parse("2024-01-01T00:01:00Z"), DateTimeOffset.Parse("2024-01-01T00:00:00Z"))')]);});
F('BigInteger factorials',v=>{const max=v+10;return spec('BigInteger Solve(int n)',`if(n < 0 || n > ${max}) throw new ArgumentOutOfRangeException(nameof(n)); BigInteger result=BigInteger.One; for(int i=2;i<=n;i++) result*=i; return result;`,
`Return n! using BigInteger for 0<=n<=${max}; reject other inputs. 0!=1.`,
'An int or long factorial overflows quickly.',[
eq('BigInteger.One','Solve(0)'),eq('new BigInteger(120)','Solve(5)'),eq('new BigInteger(3628800)','Solve(10)'),raises('ArgumentOutOfRangeException',`Solve(${max+1})`)]);});
F('Checked integer multiplication',v=>{const factor=v+2;return spec('int Solve(int value)',`return checked(value * ${factor});`,
`Multiply int32 by${factor}; throw OverflowException rather than wrap when out of range.`,
'checked changes integral arithmetic overflow behavior.',[
eq(String(factor*3),'Solve(3)'),eq(String(-factor),'Solve(-1)'),eq('0','Solve(0)'),raises('OverflowException','Solve(int.MaxValue)')]);});
F('Binary bit masks',v=>{const bit=v;return spec('uint Solve(uint value, bool enabled)',`uint mask = 1u << ${bit}; return enabled ? value | mask : value & ~mask;`,
`Set or clear bit${bit} of a uint according to enabled, preserving every other bit.`,
'Set with OR, clear with AND of the complemented mask.',[
eq(`${2**bit}u`,'Solve(0u, true)'),eq('0u',`Solve(${2**bit}u, false)`),eq(`${4294967295-2**bit}u`,'Solve(uint.MaxValue, false)'),eq('uint.MaxValue','Solve(uint.MaxValue, true)')]);});
F('Little-endian binary encoding',v=>{const offset=v;return spec('int Solve(byte[] buffer)',`if(buffer.Length < ${offset+4}) throw new ArgumentException("Buffer too short"); return BinaryPrimitives.ReadInt32LittleEndian(buffer.AsSpan(${offset}, 4));`,
`Read a signed little-endian int32 beginning at offset${offset}. Reject buffers shorter than${offset+4}. Do not mutate input.`,
'BinaryPrimitives makes endianness explicit and independent of hardware.',[
eq('16909060',`Solve(new byte[] { ${Array(offset).fill(0).concat([4,3,2,1]).join(',')} })`),eq('-1',`Solve(Enumerable.Repeat((byte)255, ${offset+4}).ToArray())`),raises('ArgumentException','Solve(Array.Empty<byte>())')]);});
F('Queue bounded-buffer policies',v=>{const cap=v+1;return spec('int[] Solve(IEnumerable<int> values)',`var queue=new Queue<int>(); foreach(var value in values){ if(queue.Count == ${cap}) queue.Dequeue(); queue.Enqueue(value); } return queue.ToArray();`,
`Keep only the newest${cap} integers, returning them oldest-first. Empty input yields[]. Use Queue<T>.`,
'Evict before enqueueing when at capacity.',[
eq(ints([]),'Solve(Array.Empty<int>())'),eq(ints(Array.from({length:cap},(_,i)=>i+2)),`Solve(Enumerable.Range(1, ${cap+1}))`),eq(ints([7]),'Solve(new[] { 7 })')]);});
F('Stack-based delimiter validation',v=>{const max=v+1;return spec('bool Solve(string text)',`var stack=new Stack<char>(); foreach(var c in text){if(c is '(' or '[' or '{'){stack.Push(c);if(stack.Count>${max})return false;}else if(c is ')' or ']' or '}'){if(stack.Count==0)return false;char open=stack.Pop();if((c==')'&&open!='(')||(c==']'&&open!='[')||(c=='}'&&open!='{'))return false;}} return stack.Count==0;`,
`Validate (),[],{} nesting, ignoring other characters. Return false when nesting depth exceeds${max}, even if balanced.`,
'Compare each closer to the most recent opener, and check leftovers.',[
eq('true','Solve("(x)")'),eq('false','Solve("([)]")'),eq('true','Solve("")'),eq('false',`Solve(${cs('('.repeat(max+1)+')'.repeat(max+1))})`)]);});
F('PriorityQueue stable scheduling',v=>{const take=v+1;return spec('string[] Solve(Job[] jobs)',`var queue=new PriorityQueue<Job,(int Priority,int Index)>(); for(int i=0;i<jobs.Length;i++)queue.Enqueue(jobs[i],(jobs[i].Priority,i));var result=new List<string>();while(queue.Count>0&&result.Count<${take})result.Add(queue.Dequeue().Name);return result.ToArray();`,
`Return names of up to${take} jobs by lowest priority number first; preserve input order on ties. Use PriorityQueue and explicit tie-breaker.`,
'PriorityQueue does not promise stable equal-priority ordering.',[
eq(strings(['b','c','a'].slice(0,take)),'Solve(new[] { new Job("a",2), new Job("b",1), new Job("c",1) })'),eq(strings([]),'Solve(Array.Empty<Job>())'),eq(strings(['x']),'Solve(new[] { new Job("x",0) })')], 'public sealed record Job(string Name,int Priority);');});
F('Set algebra with comparer',v=>{const mode=v%4,ignore=v%2===1;return spec('string[] Solve(string[] left, string[] right)',`var set = new HashSet<string>(left, ${ignore?'StringComparer.OrdinalIgnoreCase':'StringComparer.Ordinal'}); set.${['IntersectWith','UnionWith','ExceptWith','SymmetricExceptWith'][mode]}(right); return set.Select(s=>${ignore?'s.ToLowerInvariant()':'s'}).Order(StringComparer.Ordinal).ToArray();`,
`Perform ${['intersection','union','left difference','symmetric difference'][mode]} with ${ignore?'ordinal case-insensitive':'ordinal case-sensitive'} comparison. ${ignore?'Lowercase output.':''} Return ordinal-sorted distinct values.`,
'HashSet mutates itself, so construct a new set from caller data.',[
eq(strings([['b'],['a','b','c'],['a'],['a','c']][mode]),'Solve(new[] { "a", "b", "b" }, new[] { "b", "c" })'),eq(strings([]),'Solve(Array.Empty<string>(),Array.Empty<string>())'),eq(strings(mode===0||mode===2?[]:ignore?['x']:['X']),'Solve(Array.Empty<string>(),new[] { "X" })')]);});
F('GroupBy record summaries',v=>{const min=v+1;return spec('Summary[] Solve(Row[] rows)',`return rows.GroupBy(r=>r.Team,StringComparer.Ordinal).Select(g=>new Summary(g.Key,g.Count(),g.Sum(r=>(long)r.Points))).Where(s=>s.Count>=${min}).OrderBy(s=>s.Team,StringComparer.Ordinal).ToArray();`,
`Group Row(Team,Points), retain groups of at least${min} rows, return Summary(Team,Count,Total) sorted by team ordinally. Sum into long.`,
'A group key and an aggregate are separate projection fields.',[
eq('Array.Empty<Summary>()','Solve(Array.Empty<Row>())'),eq(`new[] { new Summary("a", ${min}, ${2*min}L) }`,`Solve(Enumerable.Repeat(new Row("a",2), ${min}).ToArray())`),eq('Array.Empty<Summary>()',`Solve(Enumerable.Repeat(new Row("x",1), ${min-1}).ToArray())`)], 'public sealed record Row(string Team,int Points); public sealed record Summary(string Team,int Count,long Total);');});
F('Dictionary joins',v=>{const include=v%2===1;return spec('Joined[] Solve(Person[] people, Team[] teams)',`var lookup=teams.ToDictionary(t=>t.Id);var result=new List<Joined>();foreach(var person in people){if(lookup.TryGetValue(person.TeamId,out var team))result.Add(new Joined(person.Name,team.Name));${include?'else result.Add(new Joined(person.Name,null));':''}}return result.ToArray();`,
`${include?'Left':'Inner'} join Person(Name,TeamId) to Team(Id,Name). Teams have unique IDs. Preserve people order; unmatched ${include?'get null team':'are omitted'}. Scenario${v+1}.`,
'TryGetValue distinguishes a missing team without exceptions.',[
eq(include?'new[] { new Joined("Ada","Red"), new Joined("Bo",null) }':'new[] { new Joined("Ada","Red") }','Solve(new[] { new Person("Ada",1),new Person("Bo",9) },new[] { new Team(1,"Red") })'),eq('Array.Empty<Joined>()','Solve(Array.Empty<Person>(),Array.Empty<Team>())'),eq(include?'new[] { new Joined("X",null) }':'Array.Empty<Joined>()','Solve(new[] { new Person("X",0) },Array.Empty<Team>())')], 'public sealed record Person(string Name,int TeamId); public sealed record Team(int Id,string Name); public sealed record Joined(string Name,string? Team);');});
F('Tuple interval merging',v=>{const touching=v%2===0;return spec('(int Start,int End)[] Solve((int Start,int End)[] intervals)',`var sorted=intervals.OrderBy(p=>p.Start).ThenBy(p=>p.End).ToArray();var result=new List<(int Start,int End)>();foreach(var item in sorted){if(result.Count>0&&item.Start ${touching?'<=':'<'} result[^1].End){var last=result[^1];result[^1]=(last.Start,Math.Max(last.End,item.End));}else result.Add(item);}return result.ToArray();`,
`Merge overlapping valid intervals, ${touching?'including':'excluding'} merely touching endpoints. Return sorted named tuples without mutating input. Scenario${v+1}.`,
'ValueTuple is a value type; replace the last tuple rather than mutating a copy.',[
eq(touching?'new[] { (1,5) }':'new[] { (1,3),(3,5) }','Solve(new[] { (3,5),(1,3) })'),eq('new[] { (1,7) }','Solve(new[] { (1,5),(2,7) })'),eq('Array.Empty<(int,int)>()','Solve(Array.Empty<(int,int)>())')]);});
F('Binary search lower bound',v=>{const target=v-5;return spec('int Solve(int[] sorted)',`int lo=0,hi=sorted.Length;while(lo<hi){int mid=lo+(hi-lo)/2;if(sorted[mid]<${target})lo=mid+1;else hi=mid;}return lo;`,
`Find first index with value >=${target} in sorted ascending int array, or length. Duplicates return first position. O(log n), no mutation.`,
'Use half-open [lo,hi) search bounds.',[
eq('1',`Solve(${ints([target-1,target,target,target+1])})`),eq('0','Solve(Array.Empty<int>())'),eq('2',`Solve(${ints([target-2,target-1])})`)]);});
F('Tree traversal with explicit stack',v=>{const min=v-5;return spec('int[] Solve(Node? root)',`if(root is null)return Array.Empty<int>();var stack=new Stack<Node>();stack.Push(root);var result=new List<int>();while(stack.Count>0){var node=stack.Pop();if(node.Value>=${min})result.Add(node.Value);for(int i=node.Children.Length-1;i>=0;i--)stack.Push(node.Children[i]);}return result.ToArray();`,
`Depth-first preorder traversal; return values >=${min}, preserving child order. Null root returns[]. Use stack instead of recursion.`,
'Push children in reverse order because the stack is LIFO.',[
eq('Array.Empty<int>()','Solve(null)'),eq(ints([min,min+2]),`Solve(new Node(${min},new[] { new Node(${min-1},Array.Empty<Node>()),new Node(${min+2},Array.Empty<Node>()) }))`),eq(ints([min]),`Solve(new Node(${min},Array.Empty<Node>()))`)], 'public sealed record Node(int Value,Node[] Children);');});
F('Graph breadth-first distances',v=>{const cap=v+1;return spec('SortedDictionary<string,int> Solve(Dictionary<string,string[]> graph,string start)',`var distances=new SortedDictionary<string,int>(StringComparer.Ordinal) { [start]=0 };var queue=new Queue<string>();queue.Enqueue(start);while(queue.Count>0){var node=queue.Dequeue();if(distances[node]>=${cap})continue;foreach(var next in graph.GetValueOrDefault(node,Array.Empty<string>()))if(!distances.ContainsKey(next)){distances[next]=distances[node]+1;queue.Enqueue(next);}}return distances;`,
`Find shortest directed edge counts from start, including only nodes within${cap} edges. Missing keys are leaves; cycles and duplicate edges allowed. Sort result keys ordinally.`,
'Mark visited when enqueueing, not when dequeueing.',[
eq(`new SortedDictionary<string,int> { ["a"]=0,["b"]=1${cap>=2?',["c"]=2':''} }`,'Solve(new() { ["a"]=new[] { "b","b" },["b"]=new[] { "a","c" } },"a")'),eq('new SortedDictionary<string,int> { ["x"]=0 }','Solve(new(),"x")'),eq('new SortedDictionary<string,int> { ["a"]=0 }','Solve(new() { ["a"]=new[] { "a" } },"a")')]);});
F('Delegate composition',v=>{const delta=v+1;return spec('Func<int,int> Solve(Func<int,int> transform)',`ArgumentNullException.ThrowIfNull(transform);return value => checked(transform(value) + ${delta});`,
`Return a new delegate applying transform then adding${delta} with checked arithmetic. Do not invoke transform during construction; reject null.`,
'A closure captures the transform for later calls.',[
eq(String(6+delta),'Solve(n=>n*2)(3)'),eq(String(delta),'Solve(n=>0)(99)'),`int calls=0;var f=Solve(n=>{calls++;return n;});Check.Equal(0,calls);_ = f(1);Check.Equal(1,calls);`,raises('ArgumentNullException','Solve(null!)')]);});
F('Events and subscription cleanup',v=>{const count=v+1;return spec('int Solve()',`var source=new Source();int total=0;void Handler(int n)=>total+=n;source.Changed+=Handler;for(int i=1;i<=${count};i++)source.Raise(i);source.Changed-=Handler;source.Raise(1000);return total;`,
`Subscribe to Source.Changed, raise1 through${count}, unsubscribe, then raise1000. Return sum observed by handler. Use event subscription and removal, not a direct arithmetic formula.`,
'Removing a named handler requires the same delegate identity.',[
eq(String(count*(count+1)/2),'Solve()'),eq(String(count*(count+1)/2),'Solve()'),`var source=new Source();source.Raise(1);Check.True(true);`], 'public sealed class Source { public event Action<int>? Changed; public void Raise(int n)=>Changed?.Invoke(n); }');});
F('IDisposable and exception safety',v=>{const times=v+1;return spec('int Solve(bool fail)',`int disposed=0;try { for(int i=0;i<${times};i++){using var lease=new Lease(()=>disposed++);if(fail&&i==0)throw new InvalidOperationException("simulated");} } catch(InvalidOperationException) { } return disposed;`,
`Acquire${times} Lease resources sequentially, disposing each once. If fail=true, throw inside first using scope, catch the exception outside loop, stop acquiring. Return disposal count.`,
'using executes cleanup even when its body throws.',[
eq(String(times),'Solve(false)'),eq('1','Solve(true)'),`int n=0;var lease=new Lease(()=>n++);lease.Dispose();lease.Dispose();Check.Equal(1,n);`], 'public sealed class Lease(Action onDispose):IDisposable { private bool disposed; public void Dispose(){if(disposed)return;disposed=true;onDispose();} }');});
F('Interface-based strategy injection',v=>{const offset=v+1;return spec('int[] Solve(IEnumerable<int> values,ITransform transform)',`ArgumentNullException.ThrowIfNull(transform);return values.Select(n=>checked(transform.Apply(n)+${offset})).ToArray();`,
`Call injected ITransform for each value and add${offset} using checked arithmetic. Return array in order; reject null strategy.`,
'An interface lets tests inject behavior without inheritance from a concrete service.',[
eq(ints([2+offset,4+offset]),'Solve(new[] { 1,2 },new DoubleTransform())'),eq(ints([]),'Solve(Array.Empty<int>(),new DoubleTransform())'),raises('ArgumentNullException','Solve(new[] { 1 },null!)')], 'public interface ITransform { int Apply(int value); } public sealed class DoubleTransform:ITransform { public int Apply(int value)=>checked(value*2); }');});
F('Virtual dispatch and inheritance',v=>{const bonus=v+1;return spec('string Solve(Animal animal)',`ArgumentNullException.ThrowIfNull(animal);return animal.Describe()+"/${bonus}";`,
`Call virtual Describe through an Animal reference, then append /${bonus}. Dog must override description. Null throws ArgumentNullException.`,
'Virtual dispatch chooses implementation from runtime type.',[
eq(cs(`animal:A/${bonus}`),'Solve(new Animal("A"))'),eq(cs(`dog:Rex/${bonus}`),'Solve(new Dog("Rex"))'),raises('ArgumentNullException','Solve(null!)')], 'public class Animal(string name) { protected string Name { get; }=name; public virtual string Describe()=>"animal:"+Name; } public sealed class Dog(string name):Animal(name) { public override string Describe()=>"dog:"+Name; }');});
F('Async Task result composition',v=>{const delta=v+1;return spec('async Task<int> Solve(Func<Task<int>> operation)',`ArgumentNullException.ThrowIfNull(operation);int result=await operation().ConfigureAwait(false);return checked(result+${delta});`,
`Await operation then add${delta}. Propagate operation exceptions; reject null. Never use Result or Wait.`,
'await unwraps the result and preserves exception types.',[
eq(String(delta+3),'Solve(()=>Task.FromResult(3)).GetAwaiter().GetResult()'),eq(String(delta),'Solve(async()=>{await Task.Yield();return 0;}).GetAwaiter().GetResult()'),raises('InvalidOperationException','Solve(()=>Task.FromException<int>(new InvalidOperationException())).GetAwaiter().GetResult()')]);});
F('Task.WhenAll ordering',v=>{const factor=v+1;return spec('async Task<int[]> Solve(IEnumerable<Task<int>> operations)',`var values=await Task.WhenAll(operations).ConfigureAwait(false);return values.Select(n=>checked(n*${factor})).ToArray();`,
`Await all operations and return results in input order multiplied by${factor}. Preserve failure propagation. Empty sequence returns[].`,
'WhenAll result order follows input order, not completion order.',[
eq(ints([factor,2*factor]),'Solve(new[] { Task.FromResult(1),Task.FromResult(2) }).GetAwaiter().GetResult()'),eq(ints([]),'Solve(Array.Empty<Task<int>>()).GetAwaiter().GetResult()'),raises('InvalidOperationException','Solve(new[] { Task.FromException<int>(new InvalidOperationException()) }).GetAwaiter().GetResult()')]);});
F('CancellationToken cooperative checks',v=>{const delta=v+1;return spec('async Task<int> Solve(int value,CancellationToken cancellationToken)',`cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();return checked(value+${delta});`,
`Check cancellation before and after one asynchronous yield, then add${delta}. Cancellation must throw OperationCanceledException instead of returning a sentinel.`,
'Cancellation is cooperative, not automatic termination of arbitrary code.',[
eq(String(delta+2),'Solve(2,CancellationToken.None).GetAwaiter().GetResult()'),raises('OperationCanceledException','Solve(2,new CancellationToken(true)).GetAwaiter().GetResult()'),eq(String(delta),'Solve(0,CancellationToken.None).GetAwaiter().GetResult()')]);});
F('IAsyncEnumerable streaming',v=>{const limit=v+1;return spec('async IAsyncEnumerable<int> Solve([EnumeratorCancellation] CancellationToken cancellationToken=default)',`for(int i=0;i<${limit};i++){cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();yield return i;}`,
`Asynchronously yield0 through${limit-1}; honor cancellation between values. Enumeration must remain lazy. No Task.Delay or external services.`,
'An async iterator combines yield return with await; EnumeratorCancellation wires the token.',[
eq(ints(Array.from({length:limit},(_,i)=>i)),'Collect(Solve()).GetAwaiter().GetResult()'),raises('OperationCanceledException','Collect(Solve(new CancellationToken(true))).GetAwaiter().GetResult()'),eq(ints(Array.from({length:limit},(_,i)=>i)),'Collect(Solve()).GetAwaiter().GetResult()')], 'private static async Task<int[]> Collect(IAsyncEnumerable<int> values){var list=new List<int>();await foreach(var n in values)list.Add(n);return list.ToArray();}');});
F('Retry with explicit attempt limits',v=>{const attempts=v+1;return spec('async Task<int> Solve(Func<Task<int>> operation)',`for(int attempt=1;;attempt++){try{return await operation().ConfigureAwait(false);}catch(InvalidOperationException) when(attempt<${attempts}){}}`,
`Try operation at most${attempts} total times. Retry only InvalidOperationException; rethrow last error. Other exception types propagate immediately. No timers needed.`,
'An exception filter encodes which failures are retryable.',[
eq('7','Solve(()=>Task.FromResult(7)).GetAwaiter().GetResult()'),`int calls=0;Check.Throws<InvalidOperationException>(()=>Solve(()=>{calls++;return Task.FromException<int>(new InvalidOperationException());}).GetAwaiter().GetResult());Check.Equal(${attempts},calls);`,raises('ArgumentException','Solve(()=>Task.FromException<int>(new ArgumentException())).GetAwaiter().GetResult()')]);});
F('SemaphoreSlim bounded concurrency',v=>{const limit=v%4+1;return spec('async Task<int[]> Solve(int[] values,Func<int,Task<int>> worker)',`using var gate=new SemaphoreSlim(${limit});var tasks=values.Select(async value=>{await gate.WaitAsync().ConfigureAwait(false);try{return await worker(value).ConfigureAwait(false);}finally{gate.Release();}}).ToArray();return await Task.WhenAll(tasks).ConfigureAwait(false);`,
`Map values asynchronously with at most${limit} active workers; preserve result order. Release permits in finally even on failure. Scenario${v+1}.`,
'Acquire before invoking worker, not merely before awaiting its already-started task.',[
eq(ints([2,4,6]),'Solve(new[] { 1,2,3 },n=>Task.FromResult(n*2)).GetAwaiter().GetResult()'),eq(ints([]),'Solve(Array.Empty<int>(),n=>Task.FromResult(n)).GetAwaiter().GetResult()'),`int active=0,peak=0;var mutex=new object();var result=Solve(Enumerable.Range(0,12).ToArray(),async n=>{lock(mutex){active++;peak=Math.Max(peak,active);}await Task.Yield();lock(mutex){active--;}return n;}).GetAwaiter().GetResult();Check.True(peak<=${limit});Check.Equal(Enumerable.Range(0,12).ToArray(),result);`]);});
F('ConcurrentDictionary atomic increments',v=>{const repetitions=v+2;return spec('int Solve(int workers)',`if(workers<0)throw new ArgumentOutOfRangeException(nameof(workers));var counts=new ConcurrentDictionary<string,int>();Parallel.For(0,workers,_=>{for(int i=0;i<${repetitions};i++)counts.AddOrUpdate("x",1,(_,old)=>checked(old+1));});return counts.GetValueOrDefault("x");`,
`Run workers parallel loops, each incrementing shared key x ${repetitions} times. Return exact count. Reject negative workers. Use atomic AddOrUpdate; do not keep side effects in its update delegate.`,
'Update factories can run more than once under contention.',[
eq('0','Solve(0)'),eq(String(repetitions*8),'Solve(8)'),eq(String(repetitions),'Solve(1)'),raises('ArgumentOutOfRangeException','Solve(-1)')]);});
F('System.Threading.Channels flow',v=>{const factor=v+1;return spec('async Task<int[]> Solve(int[] values)',`var channel=Channel.CreateUnbounded<int>();foreach(var n in values)await channel.Writer.WriteAsync(n);channel.Writer.Complete();var result=new List<int>();await foreach(var n in channel.Reader.ReadAllAsync())result.Add(checked(n*${factor}));return result.ToArray();`,
`Write all integers to an unbounded channel, complete the writer, then read until drained and multiply by${factor}. Preserve order. No leaked reader waiting for completion.`,
'ReadAllAsync finishes only after writer completion and buffer drainage.',[
eq(ints([factor,-factor]),'Solve(new[] { 1,-1 }).GetAwaiter().GetResult()'),eq(ints([]),'Solve(Array.Empty<int>()).GetAwaiter().GetResult()'),eq(ints([0]),'Solve(new[] { 0 }).GetAwaiter().GetResult()')]);});
F('StringReader line processing',v=>{const min=v+1;return spec('string[] Solve(string text)',`using var reader=new StringReader(text);var result=new List<string>();string? line;while((line=reader.ReadLine()) is not null){var trimmed=line.Trim();if(trimmed.Length>=${min})result.Add(trimmed);}return result.ToArray();`,
`Read CRLF/LF/CR lines, trim each, retain lines of length>=${min}. Dispose reader. Trailing newline does not create a retained blank line.`,
'ReadLine returns null at end, distinct from an empty line.',[
eq(strings(['a'.repeat(min),'b'.repeat(min)]),`Solve(${cs(' a'.replace('a','a'.repeat(min))+' \r\n'+'b'.repeat(min)+'\n').replace(/\\r\\n/g,'\\r\\n')})`),eq(strings([]),'Solve("")'),eq(strings([]),`Solve(${cs('x'.repeat(min-1))})`)]);});
F('Exception filters and domain errors',v=>{const threshold=v+1;return spec('string Solve(int value)',`try { if(value<0)throw new ArgumentOutOfRangeException(nameof(value)); if(value<${threshold})throw new InvalidOperationException("small");return "ok"; } catch(InvalidOperationException error) when(error.Message=="small") { return "retry"; }`,
`Negative input throws ArgumentOutOfRangeException. Nonnegative input below${threshold} becomes retry through an exception filter catching only InvalidOperationException("small"). At/above threshold returns ok.`,
'Do not catch Exception broadly and hide programming errors.',[
eq('"retry"','Solve(0)'),eq('"ok"',`Solve(${threshold})`),raises('ArgumentOutOfRangeException','Solve(-1)')]);});
F('StringBuilder delimited formatting',v=>{const sep=['|',',',';',':','/'][v%5],prefix='S'+v;return spec('string Solve(IEnumerable<string> values)',`var builder=new StringBuilder("${prefix}:");bool first=true;foreach(var value in values){if(!first)builder.Append('${sep}');builder.Append(value);first=false;}return builder.ToString();`,
`Format prefix '${prefix}:' followed by values joined with '${sep}'. No leading/trailing delimiter; empty strings are valid items. Use StringBuilder.`,
'A first-item flag distinguishes empty sequence from an empty element.',[
eq(cs(prefix+':'),'Solve(Array.Empty<string>())'),eq(cs(prefix+':a'+sep+'b'),'Solve(new[] { "a","b" })'),eq(cs(prefix+':'+sep+'x'),'Solve(new[] { "","x" })')]);});

if(families.length!==53)throw new Error('Expected53 families, got '+families.length);
// Correct independent calendar expectations explicitly; February29 + n = March n.
const dateFamily=families.find(f=>f.title==='DateOnly calendar arithmetic');
const dateMake=dateFamily.make;dateFamily.make=v=>{const result=dateMake(v);result.tests[0]=eq(`new DateOnly(2024, 3, ${v+1})`,'Solve(new DateOnly(2024, 2, 29))');return result;};
// Actual C# escaped line endings, not literal backslash text, in reader fixtures.
const readerFamily=families.find(f=>f.title==='StringReader line processing');
const readerMake=readerFamily.make;readerFamily.make=v=>{const r=readerMake(v),n=v+1;r.tests[0]=eq(strings(['a'.repeat(n),'b'.repeat(n)]),`Solve(${cs(' '+'a'.repeat(n)+' \r\n'+'b'.repeat(n)+'\n')})`);return r;};
const exercises=[];
for(let f=0;f<families.length;f++)for(let v=0;v<11;v++){
 const id=f*11+v+1,item=families[f].make(v);
 exercises.push({id,name:families[f].title,scenario:v+1,...item});
}
const header=`// UNIONBOOT C# — 583 exercises (53 topic families × 11 scenario variants)
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
`;
let source=header+exercises.map(e=>`    new(${e.id}, ${cs(e.name+' / scenario '+e.scenario)}, ${cs(e.requirements)}, ${cs(e.hint)}, E${String(e.id).padStart(3,'0')}.Verify),`).join('\n')+`\n};
if(exercises.Length!=583 || !exercises.Select(e=>e.Id).SequenceEqual(Enumerable.Range(1,583)))throw new Exception("Exercise inventory mismatch");
if(args.Length==0 || args[0]=="--help") { Console.WriteLine("UNIONBOOT C# —583 exercises\\n--list | --show ID | --verify [ID] | --practice ID\\nPractice methods intentionally throw until implemented.\\n53 topic families,11 scenario variants each. No dependencies beyond .NET10.\\nSearch for class E001 etc. in this source file to edit. Reference solutions share the class.\\nA test may use more than one assertion. No tasks access the network or your files."); return; }
if(args[0]=="--list"){foreach(var e in exercises)Console.WriteLine($"{e.Id:000} {e.Title}");return;}
if(args[0] is not ("--verify" or "--practice" or "--show")){Console.Error.WriteLine("Unknown command");Environment.ExitCode=2;return;}
int? id=null;if(args.Length>1){if(!int.TryParse(args[1],out var parsed)||parsed<1||parsed>583){Console.Error.WriteLine("ID must be1–583");Environment.ExitCode=2;return;}id=parsed;}
if((args[0]=="--show"||args[0]=="--practice")&&id is null){Console.Error.WriteLine("Specify an ID");Environment.ExitCode=2;return;}
if(args[0]=="--show"){var e=exercises[id!.Value-1];Console.WriteLine($"{e.Id:000} {e.Title}\\n\\n{e.Requirements}\\n\\nHint: {e.Hint}\\n\\nEdit E{e.Id:000}.Practice. Read E{e.Id:000}.Reference for the solution; Verify contains examples.");return;}
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
`;
for(const e of exercises){
 const cls='E'+String(e.id).padStart(3,'0');
 const signature=e.signature;
 const practiceSig=signature.replace(/\bSolve(?=[<(])/,'Practice');
 const refSig=signature.replace(/\bSolve(?=[<(])/,'Reference');
 const generic=signature.includes('Solve<T>');
 // A typed dispatcher keeps the exact same Verify checks for practice/reference.
 // Async iterators cannot simply return another iterator in an async method.
 let dispatcher=signature.replace(/^async /,'');
 const argsText=signature.slice(signature.indexOf('(')+1,signature.lastIndexOf(')'));
 const names=argsText.split(',').map(x=>x.replace(/\[[^\]]+\]/g,'').split('=')[0].trim().split(/\s+/).at(-1)).filter(Boolean);
 // Function generic arguments contain commas; handled per signature here.
 let callArgs=names.join(', ');
 if(signature.includes('Func<int,Task<int>> worker'))callArgs='values, worker';
 if(signature.includes('Func<int,int> transform'))callArgs='transform';
 if(signature.includes('[] intervals'))callArgs='intervals';
 if(signature.includes('graph,string start'))callArgs='graph, start';
 const dispatchCall=(name)=>`${name}${generic?'<T>':''}(${callArgs})`;
 source+=`\n// ======================================================================\n// ${e.id}: ${e.name} / scenario ${e.scenario}\n// ${e.requirements}\n// Hint: ${e.hint}\n// Practice: --practice ${e.id}; reference: --verify ${e.id}\nstatic class ${cls} {\n${e.extra}\n public static ${practiceSig} {\n  // TODO: implement the exercise without calling Reference.\n  throw new NotImplementedException("Exercise ${e.id}");\n }\n public static ${refSig} {\n  ${e.body}\n }\n private static ${dispatcher} => Check.PracticeMode ? ${dispatchCall('Practice')} : ${dispatchCall('Reference')};\n public static void Verify() {\n  ${e.tests.join('\n  ')}\n }\n}\n`;
}
// Attributes belong only on actual async iterators, not forwarding dispatchers.
source=source.replace(/private static IAsyncEnumerable<int> Solve\(\[EnumeratorCancellation\] /g,'private static IAsyncEnumerable<int> Solve(');
// An async iterator stub must contain a yield to compile as an iterator. Use a
// non-async throwing factory for practice until learners implement the iterator.
source=source.replace(/public static async IAsyncEnumerable<int> Practice\(\[EnumeratorCancellation\] /g,'public static IAsyncEnumerable<int> Practice(');
fs.writeFileSync(target,source);
console.log('Created '+target+' with '+exercises.length+' exercises across '+families.length+' families.');
