'use strict';
// Authoring tool only; CSHARP-MORE-583.cs is standalone and does not need Node.
// 53 NEW topic families x 11 honestly labelled related scenarios = 583 exercises.
// This generator writes ONLY its own output. Never regenerates CSHARP-583.cs.
const fs=require('node:fs'),path=require('node:path');
const target=path.join(__dirname,'CSHARP-MORE-583.cs');
if(fs.existsSync(target))throw new Error('Refusing to replace an existing C# exercise file. Preserve learner work before regenerating.');
const families=[];
const F=(title,make)=>families.push({title,make});
const cs=s=>JSON.stringify(s);
const ints=a=>'new int[] { '+a.join(', ')+' }';
const strings=a=>'new string[] { '+a.map(cs).join(', ')+' }';
const eq=(expected,call)=>`Check.Equal(${expected}, ${call});`;
const raises=(type,call)=>`Check.Throws<${type}>(() => { ${call}; });`;
// Explicit callArgs on EVERY specification: never split C# generic/tuple/array signatures on commas.
const spec=(signature,callArgs,body,requirements,hint,tests,extra='')=>({signature,callArgs,body,requirements,hint,tests,extra});

F('Struct copies versus class aliases',v=>{const n=v+1;return spec('(int OriginalValue,int CopyValue,int SharedValue) Solve(int seed)','seed',`var original=new CounterValue { Value=seed };var copy=original;copy.Value=checked(copy.Value+${n});var first=new CounterObject { Value=seed };var alias=first;alias.Value=checked(alias.Value+${n});return (original.Value,copy.Value,first.Value);`,
`Copy a mutable CounterValue struct and alias a CounterObject class. Increment each copy/alias by ${n} using checked arithmetic. Return original struct value, copied struct value, and aliased object value.`,
'Assignment copies a struct but copies only a reference for a class.',[
eq(`(4,${4+n},${4+n})`,'Solve(4)'),eq(`(0,${n},${n})`,'Solve(0)'),eq(`(-20,${-20+n},${-20+n})`,'Solve(-20)'),raises('OverflowException','Solve(int.MaxValue)')],
'public struct CounterValue { public int Value; } public sealed class CounterObject { public int Value; }');});
F('Readonly struct translation',v=>{const n=v+1;return spec('Vector Solve(Vector value)','value',`return new Vector(checked(value.X+${n}),checked(value.Y-${n}));`,
`Translate readonly Vector by (${n},-${n}), returning a new value. Preserve input and detect int overflow. The readonly fields cannot be assigned after construction.`,
'Reconstruct an immutable value rather than trying to change readonly fields.',[
eq(`new Vector(${2+n},${5-n})`,'Solve(new Vector(2,5))'),`var original=new Vector(0,0);var result=Solve(original);Check.Equal(0,original.X);Check.Equal(${n},result.X);Check.Equal(${-n},result.Y);`,raises('OverflowException','Solve(new Vector(int.MaxValue,0))')],
'public readonly struct Vector(int x,int y) { public readonly int X=x; public readonly int Y=y; }');});
F('Init-only option construction',v=>{const n=v+1;return spec('Options Solve(string name,int requested)','name, requested',`ArgumentNullException.ThrowIfNull(name);if(requested<0)throw new ArgumentOutOfRangeException(nameof(requested));return new Options { Name=name.Trim(),Capacity=Math.Min(requested,${n}) };`,
`Build Options with init-only Name and Capacity. Trim name, clamp nonnegative requested capacity to ${n}, reject negative capacity and null name. Always return a new object.`,
'Object initializers can assign init-only properties during construction.',[
eq(`new Options { Name="Ada",Capacity=${n} }`,'Solve(" Ada ",100)'),eq('new Options { Name="",Capacity=0 }','Solve(" ",0)'),raises('ArgumentOutOfRangeException','Solve("x",-1)'),raises('ArgumentNullException','Solve(null!,0)'),`Check.True(!ReferenceEquals(Solve("x",1),Solve("x",1)));`],
'public sealed class Options { public string Name { get; init; }=""; public int Capacity { get; init; } }');});
F('Required member DTO factories',v=>{const n=v+1;return spec('Request Solve(string? user,string? subject)','user, subject',`if(string.IsNullOrWhiteSpace(user)||string.IsNullOrWhiteSpace(subject))throw new ArgumentException("Required text");return new Request { User=user.Trim(),Subject=subject.Trim(),Attempts=${n} };`,
`Construct Request, initializing both required strings and Attempts=${n}. Reject null/blank user or subject. Trim both. required enforces initialization, not runtime nonblank validation.`,
'Combine compile-time required members with explicit runtime validation.',[
eq(`new Request { User="Ada",Subject="Help",Attempts=${n} }`,'Solve(" Ada "," Help ")'),raises('ArgumentException','Solve(null,"ok")'),raises('ArgumentException','Solve("ok"," ")'),eq(cs('X'), 'Solve("X","Y").User')],
'public sealed class Request { public required string User { get; init; } public required string Subject { get; init; } public int Attempts { get; init; } }');});
F('Positional pattern geometry',v=>{const n=v+1;return spec('string Solve(Point point)','point',`return point switch { (0,0)=>"origin", (var x,var y) when Math.Abs((long)x)+Math.Abs((long)y)<=${n}=>"near", _=>"far" };`,
`Use positional Point deconstruction. Origin gets origin; nonorigin Manhattan distance <=${n} gets near; otherwise far. Avoid Math.Abs(int.MinValue) overflow.`,
'Cast coordinates to long before taking absolute values.',[
eq('"origin"','Solve(new Point(0,0))'),eq('"near"',`Solve(new Point(${-n},0))`),eq('"far"',`Solve(new Point(${n},1))`),eq('"far"','Solve(new Point(int.MinValue,0))')],
'public readonly record struct Point(int X,int Y);');});
F('List pattern packet classification',v=>{const n=v+1;return spec('string Solve(int[] packet)','packet',`return packet switch { []=>"empty", [${n}]=>"marker", [${n},..,0]=>"framed", [${n},..]=>"open", _=>"foreign" };`,
`Classify arrays using list patterns: empty; singleton ${n} marker; two or more items starting ${n} and ending 0 framed; other ${n}-prefixed packets open; all others foreign. Do not mutate.`,
'Order more specific list patterns before a broad prefix pattern.',[
eq('"empty"','Solve(Array.Empty<int>())'),eq('"marker"',`Solve(new[] { ${n} })`),eq('"framed"',`Solve(new[] { ${n},7,0 })`),eq('"open"',`Solve(new[] { ${n},3 })`),eq('"foreign"','Solve(new[] { -1,0 })')]);});
F('Relational switch range routing',v=>{const n=v+1;return spec('string Solve(int value)','value',`return value switch { <0=>"invalid", <${n}=>"low", <=${n*2}=>"normal", _=>"high" };`,
`Route integer measurements using relational patterns: negative invalid; 0 through ${n-1} low; ${n} through ${n*2} normal; larger high.`,
'Boundary ordering determines which switch arm matches.',[
eq('"invalid"','Solve(-1)'),eq('"low"','Solve(0)'),eq('"normal"',`Solve(${n})`),eq('"normal"',`Solve(${n*2})`),eq('"high"',`Solve(${n*2+1})`)]);});
F('Nullable reference flow guards',v=>{const n=v+1;return spec('string Solve(Profile? profile)','profile',`if(profile?.Contact?.Email is not string email || string.IsNullOrWhiteSpace(email))return "missing";var trimmed=email.Trim();return trimmed.Length>=${n}?trimmed:"short";`,
`Safely navigate nullable Profile.Contact.Email. Missing/null/blank email returns missing. Trim present text; length below ${n} returns short, otherwise return text unchanged in case. This is flow analysis, not email syntax validation.`,
'A successful is string pattern gives the compiler a non-null local.',[
eq('"missing"','Solve(null)'),eq('"missing"','Solve(new Profile(null))'),eq('"missing"','Solve(new Profile(new Contact(" ")))'),eq(cs('A'.repeat(n)),`Solve(new Profile(new Contact(${cs(' '+'A'.repeat(n)+' ')})))`),eq(n===1?'"missing"':'"short"',`Solve(new Profile(new Contact(${cs('a'.repeat(n-1))})))`)],
'public sealed record Contact(string? Email); public sealed record Profile(Contact? Contact);');});
F('Stackalloc scratch reversal',v=>{const n=v+1;return spec('int[] Solve(ReadOnlySpan<int> values)','values',`if(values.Length>${n})throw new ArgumentException("Too many values");Span<int> scratch=stackalloc int[${n}];for(int i=0;i<values.Length;i++)scratch[i]=values[values.Length-1-i];return scratch[..values.Length].ToArray();`,
`Reverse up to ${n} integers through stackalloc scratch space, returning an independent array. Empty allowed; longer spans throw ArgumentException. Never return a stack span or mutate input.`,
'Only copy the initialized slice of stack memory to the managed result.',[
eq(ints([]),'Solve(ReadOnlySpan<int>.Empty)'),eq(ints(Array.from({length:n},(_,i)=>n-i)),`Solve(Enumerable.Range(1,${n}).ToArray())`),raises('ArgumentException',`Solve(new int[${n+1}])`),`var input=new[] { 9 };var output=Solve(input);output[0]=8;Check.Equal(9,input[0]);`]);});
F('Memory slices and shared backing storage',v=>{const n=v+1;return spec('Memory<int> Solve(int[] values)','values',`if(values.Length<${n})throw new ArgumentException("Too short");return values.AsMemory(${n-1},1);`,
`Return a one-element Memory<int> view at index ${n-1}. It MUST alias caller storage, not copy it. Arrays shorter than ${n} throw ArgumentException.`,
'Memory survives ordinary method returns because its backing array is managed.',[
`var input=Enumerable.Range(1,${n+1}).ToArray();var view=Solve(input);Check.Equal(1,view.Length);Check.Equal(${n},view.Span[0]);view.Span[0]=99;Check.Equal(99,input[${n-1}]);`,raises('ArgumentException',`Solve(new int[${n-1}])`)]);});
F('Raw interpolated invariant reports',v=>{const n=v+1;return spec('string Solve(decimal amount)','amount',`var formatted=amount.ToString("F2",CultureInfo.InvariantCulture);return $$"""{"scenario":${n},"amount":"{{formatted}}"}""";`,
`Return exactly {"scenario":${n},"amount":"AMOUNT"}, formatting decimal to two invariant places. Use a raw interpolated string so JSON braces and quotes need no backslashes. No newline.`,
'Two dollar signs reserve double braces for interpolation; single JSON braces remain literal.',[
eq(cs(`{"scenario":${n},"amount":"12.50"}`),'Solve(12.5m)'),eq(cs(`{"scenario":${n},"amount":"0.00"}`),'Solve(0m)'),eq(cs(`{"scenario":${n},"amount":"-2.25"}`),'Solve(-2.25m)')]);});
F('Record struct composite key lookup',v=>{const n=v+1;return spec('int Solve(string tenant,int number)','tenant, number',`var map=new Dictionary<Key,int> { [new Key("main",${n})]=${n*10} };return map.GetValueOrDefault(new Key(tenant,number),-1);`,
`Use record struct Key(Tenant,Number) as a composite dictionary key. Seed (main,${n}) with ${n*10}. Query by value equality and ordinal case-sensitive string equality; missing returns -1.`,
'Generated record-struct equality combines all positional members.',[
eq(String(n*10),`Solve("main",${n})`),eq('-1',`Solve("MAIN",${n})`),eq('-1',`Solve("main",${n+1})`),`Check.Equal(new Key("x",1),new Key("x",1));`],
'public readonly record struct Key(string Tenant,int Number);');});
F('Operator overloaded vector arithmetic',v=>{const n=v+1;return spec('Vector Solve(Vector left,Vector right)','left, right',`return (left+right)*${n};`,
`Return (left+right)*${n} through supplied Vector operators. Operators use checked long arithmetic; do not modify operands.`,
'User-defined operators can preserve domain return types and checked behavior.',[
eq(`new Vector(${4*n}L,${6*n}L)`,'Solve(new Vector(1,2),new Vector(3,4))'),eq('new Vector(0,0)','Solve(new Vector(2,-2),new Vector(-2,2))'),raises('OverflowException','Solve(new Vector(long.MaxValue,0),new Vector(1,0))')],
'public readonly record struct Vector(long X,long Y) { public static Vector operator +(Vector a,Vector b)=>new(checked(a.X+b.X),checked(a.Y+b.Y)); public static Vector operator *(Vector a,int n)=>new(checked(a.X*n),checked(a.Y*n)); }');});
F('IComparable domain ordering',v=>{const n=v+1;return spec('string[] Solve(Candidate[] values)','values',`return values.Where(x=>x.Score>=${n}).Order().Select(x=>x.Name).ToArray();`,
`Keep Candidate scores >=${n}, order through IComparable<Candidate> (descending score then ordinal ascending name), and return names. Null array elements are outside the contract.`,
'CompareTo must define a consistent ordering; avoid subtraction-based comparisons that overflow.',[
eq(strings(['a','b','z']),`Solve(new[] { new Candidate("z",${n}),new Candidate("b",${n+1}),new Candidate("a",${n+1}) })`),eq(strings([]),`Solve(new[] { new Candidate("x",${n-1}) })`),eq(strings(['top']), 'Solve(new[] { new Candidate("top",int.MaxValue) })')],
'public sealed record Candidate(string Name,int Score):IComparable<Candidate> { public int CompareTo(Candidate? other){if(other is null)return -1;int byScore=other.Score.CompareTo(Score);return byScore!=0?byScore:StringComparer.Ordinal.Compare(Name,other.Name);} }');});
F('Generic comparer driven first match',v=>{const n=v+1;return spec('int Solve<T>(T[] values,T target,IEqualityComparer<T> comparer)','values, target, comparer',`ArgumentNullException.ThrowIfNull(comparer);for(int i=${n-1};i<values.Length;i++)if(comparer.Equals(values[i],target))return i;return -1;`,
`Find the first target index at or after ${n-1}, using the injected IEqualityComparer<T>. Return -1 when no eligible match. Forward generic T to both implementations; null comparer throws.`,
'A comparer controls equality without requiring normalization or IEquatable on T.',[
eq(String(n),`Solve(Enumerable.Repeat("x",${n}).Append("ADA").ToArray(),"ada",StringComparer.OrdinalIgnoreCase)`),eq('-1',`Solve(Enumerable.Repeat("ADA",${n+1}).ToArray(),"ada",StringComparer.Ordinal)`),eq(String(n-1),`Solve(Enumerable.Repeat(3,${n}).ToArray(),3,EqualityComparer<int>.Default)`),raises('ArgumentNullException','Solve(Array.Empty<int>(),1,null!)')]);});
F('Async running total producers',v=>{const n=v+1;return spec('async IAsyncEnumerable<long> Solve(int[] values,[EnumeratorCancellation] CancellationToken cancellationToken=default)','values, cancellationToken',`long total=${n};foreach(var value in values){cancellationToken.ThrowIfCancellationRequested();await Task.Yield();cancellationToken.ThrowIfCancellationRequested();total+=value;yield return total;}`,
`Lazily produce running long totals seeded with ${n}. Yield once asynchronously per input, honoring cancellation before and after the yield. Read the input during enumeration, not factory construction.`,
'Async iterator Practice remains a non-async throwing factory until you implement yield return.',[
eq(`new long[] { ${n+1},${n-1},${n+2} }`,'Collect(Solve(new[] { 1,-2,3 })).GetAwaiter().GetResult()'),eq('Array.Empty<long>()','Collect(Solve(Array.Empty<int>())).GetAwaiter().GetResult()'),raises('OperationCanceledException','Collect(Solve(new[] { 1 },new CancellationToken(true))).GetAwaiter().GetResult()'),`var input=new[] { 1 };var lazy=Solve(input);input[0]=4;Check.Equal(new long[] { ${n+4} },Collect(lazy).GetAwaiter().GetResult());`],
'private static async Task<long[]> Collect(IAsyncEnumerable<long> values){var result=new List<long>();await foreach(var item in values)result.Add(item);return result.ToArray();}');});
F('Bounded channel drop-oldest policy',v=>{const n=v+1;return spec('async Task<int[]> Solve(int[] values)','values',`var channel=Channel.CreateBounded<int>(new BoundedChannelOptions(${n}) { SingleReader=true,SingleWriter=true,FullMode=BoundedChannelFullMode.DropOldest });foreach(var value in values)await channel.Writer.WriteAsync(value);channel.Writer.Complete();var result=new List<int>();await foreach(var value in channel.Reader.ReadAllAsync())result.Add(value);return result.ToArray();`,
`Configure a bounded single-reader/single-writer Channel with capacity ${n} and DropOldest. Write before draining; complete then return retained values oldest first. Unlike an unbounded channel, full writes discard the oldest item.`,
'DropOldest permits producer-first use without the deadlock that Wait mode would cause.',[
eq(ints(Array.from({length:n},(_,i)=>i+3)),`Solve(Enumerable.Range(1,${n+2}).ToArray()).GetAwaiter().GetResult()`),eq(ints([]),'Solve(Array.Empty<int>()).GetAwaiter().GetResult()'),eq(ints([-1]),'Solve(new[] { -1 }).GetAwaiter().GetResult()')]);});
F('ValueTask synchronous cache fast paths',v=>{const n=v+1;return spec('ValueTask<int> Solve(int key,Func<int,Task<int>> loader)','key, loader',`ArgumentNullException.ThrowIfNull(loader);if(key==${n})return new ValueTask<int>(${n*10});return new ValueTask<int>(loader(key));`,
`Key ${n} is cached as ${n*10}: return a synchronously completed ValueTask without invoking loader. Other keys invoke loader exactly once. Null loader throws even on a cache hit; propagate loader failures. Consume each ValueTask once.`,
'Wrap a value on the fast path and the underlying Task on the slow path.',[
`int calls=0;var hit=Solve(${n},k=>{calls++;return Task.FromResult(0);});Check.True(hit.IsCompletedSuccessfully);Check.Equal(${n*10},hit.GetAwaiter().GetResult());Check.Equal(0,calls);`,eq('9',`Solve(-1,k=>Task.FromResult(9)).GetAwaiter().GetResult()`),raises('InvalidOperationException','Solve(-1,k=>Task.FromException<int>(new InvalidOperationException())).GetAwaiter().GetResult()'),raises('ArgumentNullException',`Solve(${n},null!)`)]);});
F('Task WhenAny winner observation',v=>{const n=v+1;return spec('async Task<int> Solve(Task<int>[] operations)','operations',`if(operations.Length==0)throw new ArgumentException("No contenders");var winner=await Task.WhenAny(operations).ConfigureAwait(false);return checked(await winner.ConfigureAwait(false)+${n});`,
`Await the first completed task and add ${n} checked. If multiple inputs are already complete, choose the first input (Task.WhenAny behavior). Await the winning task itself to observe its failure. Reject empty input. No cancellation of other tasks.`,
'WhenAny succeeds with a Task object even when the winning task faulted.',[
eq(String(n+7),'Solve(new[] { Task.FromResult(7),Task.FromResult(2) }).GetAwaiter().GetResult()'),`var pending=new TaskCompletionSource<int>();Check.Equal(${n+3},Solve(new[] { pending.Task,Task.FromResult(3) }).GetAwaiter().GetResult());pending.SetResult(0);`,raises('InvalidOperationException','Solve(new[] { Task.FromException<int>(new InvalidOperationException()) }).GetAwaiter().GetResult()'),raises('ArgumentException','Solve(Array.Empty<Task<int>>()).GetAwaiter().GetResult()')]);});
F('Parallel ForEachAsync indexed mapping',v=>{const n=v+1;return spec('async Task<int[]> Solve(int[] values,Func<int,Task<int>> worker)','values, worker',`ArgumentNullException.ThrowIfNull(worker);var result=new int[values.Length];await Parallel.ForEachAsync(Enumerable.Range(0,values.Length),new ParallelOptions { MaxDegreeOfParallelism=${n} },async (i,token)=>{result[i]=await worker(values[i]).ConfigureAwait(false);});return result;`,
`Use Parallel.ForEachAsync with maximum ${n} workers. Map each input exactly once into its original index. Empty array returns []; reject null worker and propagate worker failure.`,
'Workers own distinct result indices, so completion order need not equal output order.',[
eq(ints([6,2,6]),'Solve(new[] { 3,1,3 },x=>Task.FromResult(x*2)).GetAwaiter().GetResult()'),eq(ints([]),'Solve(Array.Empty<int>(),x=>Task.FromResult(x)).GetAwaiter().GetResult()'),`int active=0,peak=0,calls=0;var mutex=new object();var result=Solve(Enumerable.Range(0,24).ToArray(),async x=>{lock(mutex){active++;calls++;peak=Math.Max(peak,active);}await Task.Yield();lock(mutex){active--;}return x;}).GetAwaiter().GetResult();Check.True(peak<=${n});Check.Equal(24,calls);Check.Equal(Enumerable.Range(0,24).ToArray(),result);`,raises('InvalidOperationException','Solve(new[] { 1 },x=>Task.FromException<int>(new InvalidOperationException())).GetAwaiter().GetResult()')]);});
F('Interlocked ticket allocation',v=>{const n=v+1;return spec('int[] Solve(int workers)','workers',`if(workers<0)throw new ArgumentOutOfRangeException(nameof(workers));int counter=${n*100};var tickets=new int[workers];Parallel.For(0,workers,i=>tickets[i]=Interlocked.Increment(ref counter));Array.Sort(tickets);return tickets;`,
`Allocate one unique ticket per parallel worker using Interlocked.Increment from seed ${n*100}. Return tickets sorted. Negative workers throw; zero workers returns []. Do not use non-atomic ++ on shared state.`,
'Increment returns the newly reserved value in the same atomic operation.',[
eq(ints(Array.from({length:8},(_,i)=>n*100+i+1)),'Solve(8)'),eq(ints([]),'Solve(0)'),eq(ints([n*100+1]),'Solve(1)'),raises('ArgumentOutOfRangeException','Solve(-1)')]);});
F('TimeProvider expiration boundaries',v=>{const n=v+1;return spec('bool Solve(DateTimeOffset created,TimeProvider clock)','created, clock',`ArgumentNullException.ThrowIfNull(clock);return clock.GetUtcNow()>=created.AddMinutes(${n});`,
`An item expires exactly ${n} minutes after created. Compare using injected TimeProvider.GetUtcNow; never read wall-clock time. Different offsets represent the same instant. Null clock throws.`,
'A frozen TimeProvider makes just-before and exact-boundary checks deterministic.',[
eq('false',`Solve(Epoch,new FrozenTime(Epoch.AddMinutes(${n}).AddTicks(-1)))`),eq('true',`Solve(Epoch,new FrozenTime(Epoch.AddMinutes(${n})))`),eq('false','Solve(Epoch,new FrozenTime(Epoch.AddMinutes(-1)))'),eq('true',`Solve(Epoch.ToOffset(TimeSpan.FromHours(3)),new FrozenTime(Epoch.AddMinutes(${n})))`),raises('ArgumentNullException','Solve(Epoch,null!)')],
'private static readonly DateTimeOffset Epoch=new(2024,2,29,0,0,0,TimeSpan.Zero); public sealed class FrozenTime(DateTimeOffset now):TimeProvider { public override DateTimeOffset GetUtcNow()=>now; }');});
F('Injected periodic tick coalescing',v=>{const n=v+1;return spec('long[] Solve(long[] observedTicks)','observedTicks',`var result=new List<long>();long last=0;foreach(var tick in observedTicks){if(tick<last)throw new ArgumentException("Time moved backward");long previous=last/${n},current=tick/${n};if(current>previous)result.Add(current);last=tick;}return result.ToArray();`,
`Model a coalescing periodic timer with injected nonnegative monotonically increasing integer timestamps and period ${n}. Starting at time 0, emit the latest period number only when advancing into a new period; skipped periods coalesce. Repeated timestamps emit nothing. No sleeping or real Timer.`,
'Compare integer period buckets rather than replaying every missed callback.',[
eq('new long[] { 1,3 }',`Solve(new long[] { 0,${n-1},${n},${n},${3*n} })`),eq('Array.Empty<long>()','Solve(Array.Empty<long>())'),raises('ArgumentException','Solve(new long[] { 2,1 })'),raises('ArgumentException','Solve(new long[] { -1 })')]);});
F('Web-default typed JSON DTOs',v=>{const n=v+1;return spec('string Solve(string json)','json',`var options=new JsonSerializerOptions(JsonSerializerDefaults.Web);var dto=JsonSerializer.Deserialize<Payload>(json,options)??throw new JsonException("Null payload");if(dto.Count<0)throw new ArgumentException("Negative count");dto.Count=checked(dto.Count+${n});return JsonSerializer.Serialize(dto,options);`,
`Deserialize a typed Payload with JsonSerializerDefaults.Web (case-insensitive properties, quoted numbers accepted, camelCase output). Add ${n} checked to nonnegative Count and serialize. Missing Name defaults empty; JSON null and malformed input throw JsonException. This models a typed DTO boundary, not a real source generator.`,
'Web defaults differ from the plain options used by the shared grading helper.',[
eq(cs(`{"name":"Ada","count":${n+2}}`),`Solve(${cs('{"NAME":"Ada","COUNT":"2"}')})`),eq(cs(`{"name":"","count":${n}}`),'Solve("{}")'),raises('JsonException','Solve("null")'),raises('JsonException','Solve("{")'),raises('ArgumentException',`Solve(${cs('{"count":-1}')})`)],
'public sealed class Payload { public string Name { get; set; }=""; public int Count { get; set; } }');});
F('Custom JSON scalar converters',v=>{const n=v+1;return spec('int Solve(string json)','json',`var options=new JsonSerializerOptions();options.Converters.Add(new CodeConverter());var code=JsonSerializer.Deserialize<Code>(json,options);return checked(code.Value+${n});`,
`Deserialize Code using a custom converter accepting only JSON strings of form C:SIGNED_INT32. Parse invariantly, allowing a sign but no whitespace. Return parsed value plus ${n}, checked. All other JSON values/token formats throw JsonException.`,
'A converter validates token kind before asking Utf8JsonReader for a string.',[
eq(String(n+12),`Solve(${cs('"C:12"')})`),eq(String(n-2),`Solve(${cs('"C:-2"')})`),raises('JsonException','Solve("12")'),raises('JsonException',`Solve(${cs('"C: 2"')})`),raises('JsonException',`Solve(${cs('"D:2"')})`),raises('OverflowException',`Solve(${cs('"C:2147483647"')})`)],
'public readonly record struct Code(int Value); public sealed class CodeConverter:System.Text.Json.Serialization.JsonConverter<Code> { public override Code Read(ref Utf8JsonReader reader,Type type,JsonSerializerOptions options){if(reader.TokenType!=JsonTokenType.String)throw new JsonException("Expected string");string text=reader.GetString()!;if(!text.StartsWith("C:",StringComparison.Ordinal)||!int.TryParse(text.AsSpan(2),NumberStyles.AllowLeadingSign,CultureInfo.InvariantCulture,out int value))throw new JsonException("Invalid code");return new Code(value);} public override void Write(Utf8JsonWriter writer,Code value,JsonSerializerOptions options)=>writer.WriteStringValue("C:"+value.Value.ToString(CultureInfo.InvariantCulture)); }');});
F('Deferred query versus materialized snapshot',v=>{const n=v+1;return spec('(int[] Snapshot,int[] Current) Solve(List<int> values,Action<List<int>> mutate)','values, mutate',`var query=values.Where(x=>x>=${n});var snapshot=query.ToArray();mutate(values);return (snapshot,query.ToArray());`,
`Create a deferred Where query retaining values >=${n}, materialize a snapshot, invoke injected mutation exactly once, then materialize the same query again. Return both arrays. Mutating the supplied list is intentional.`,
'The query stores computation, while ToArray captures values at a point in time.',[
`var values=new List<int> { ${n-1},${n} };int calls=0;var pair=Solve(values,x=>{calls++;x.Add(${n+1});});Check.Equal(new[] { ${n} },pair.Snapshot);Check.Equal(new[] { ${n},${n+1} },pair.Current);Check.Equal(1,calls);`,
`var pair2=Solve(new List<int> { ${n} },x=>x.Clear());Check.Equal(new[] { ${n} },pair2.Snapshot);Check.Equal(Array.Empty<int>(),pair2.Current);`]);});
F('IQueryable expression composition',v=>{const n=v+1;return spec('IQueryable<int> Solve(IQueryable<int> source)','source',`return source.Where(x=>x>=${n}).OrderByDescending(x=>x);`,
`Compose an IQueryable filter >=${n} and descending ordering without enumeration. Return the query, not a materialized array. Tests use EnumerableQuery locally; no claim of SQL translation.`,
'IQueryable operators receive expression trees; execution is owned by the provider.',[
eq(ints([n+2,n]),`Solve(new[] { ${n-1},${n},${n+2} }.AsQueryable()).ToArray()`),eq(ints([]),'Solve(Array.Empty<int>().AsQueryable()).ToArray()'),`int reads=0;IEnumerable<int> Source(){reads++;yield return ${n};}var query=Solve(Source().AsQueryable());Check.Equal(0,reads);Check.True(query.Expression is System.Linq.Expressions.MethodCallExpression);Check.Equal(new[] { ${n} },query.ToArray());Check.Equal(1,reads);`]);});
F('Expression tree affine builders',v=>{const n=v+1;return spec('System.Linq.Expressions.Expression<Func<int,int>> Solve(int offset)','offset',`var x=System.Linq.Expressions.Expression.Parameter(typeof(int),"x");var product=System.Linq.Expressions.Expression.MultiplyChecked(x,System.Linq.Expressions.Expression.Constant(${n}));var sum=System.Linq.Expressions.Expression.AddChecked(product,System.Linq.Expressions.Expression.Constant(offset));return System.Linq.Expressions.Expression.Lambda<Func<int,int>>(sum,x);`,
`Build (do not execute) an Expression<Func<int,int>> representing checked x*${n}+offset. One int parameter named x. Tests compile locally and inspect AddChecked structure; no Reflection.Emit.`,
'Expression factory nodes are data describing operations until a consumer compiles or interprets them.',[
eq(String(n*3+2),'Solve(2).Compile()(3)'),eq('-4','Solve(-4).Compile()(0)'),raises('OverflowException','Solve(1).Compile()(int.MaxValue)'),`Check.Equal(System.Linq.Expressions.ExpressionType.AddChecked,Solve(0).Body.NodeType);Check.Equal("x",Solve(0).Parameters[0].Name);`]);});
F('Read-only attribute metadata scanning',v=>{const n=v+1;return spec('string[] Solve(Type type)','type',`return type.GetProperties(System.Reflection.BindingFlags.Public|System.Reflection.BindingFlags.Instance).Where(p=>p.GetCustomAttributesData().Any(a=>a.AttributeType==typeof(RankAttribute)&&(int)a.ConstructorArguments[0].Value!>=${n})).Select(p=>p.Name).Order(StringComparer.Ordinal).ToArray();`,
`Read public instance property metadata only. Select properties with RankAttribute constructor rank >=${n}, return ordinal-sorted names. Do not instantiate attributes, invoke getters, emit code, or scan external assemblies.`,
'CustomAttributeData reads metadata without running attribute constructors.',[
eq(strings(['Always','Boundary']),'Solve(typeof(Sample))'),eq(strings([]),'Solve(typeof(Empty))'),`Check.Equal(0,RankAttribute.Constructions);`],
`[AttributeUsage(AttributeTargets.Property)] public sealed class RankAttribute:Attribute { public static int Constructions; public RankAttribute(int rank){Constructions++;} } public sealed class Sample { [Rank(${n})] public int Boundary=>throw new Exception("Do not invoke getter"); [Rank(${n-1})] public int Below=>0; [Rank(100)] public int Always=>0; public int Plain=>0; } public sealed class Empty { public int Plain=>0; }`);});
F('BitOperations rotation and hexadecimal',v=>{const n=v+1;return spec('(string Hex,int Ones) Solve(uint value)','value',`uint rotated=BitOperations.RotateLeft(value,${n});return (rotated.ToString("X8",CultureInfo.InvariantCulture),BitOperations.PopCount(rotated));`,
`Rotate uint left ${n} bits, return eight uppercase invariant hexadecimal digits and population count. Rotation wraps high bits, unlike a lossy shift.`,
'BitOperations makes width and circular movement explicit.',[
eq(`(${cs((2**n).toString(16).toUpperCase().padStart(8,'0'))},1)`,'Solve(1u)'),eq('("FFFFFFFF",32)','Solve(uint.MaxValue)'),eq('("00000000",0)','Solve(0u)'),eq(`(${cs((2**(n-1)).toString(16).toUpperCase().padStart(8,'0'))},1)`,'Solve(0x80000000u)')]);});
F('UTF8 Base64 wire round trips',v=>{const n=v+1,text='café-'+n;return spec('string Solve(string text)','text',`var utf8=new UTF8Encoding(false,true);var bytes=utf8.GetBytes("${n}:"+text);var wire=Convert.ToBase64String(bytes);var roundTrip=utf8.GetString(Convert.FromBase64String(wire));if(roundTrip!="${n}:"+text)throw new InvalidOperationException("Round trip mismatch");return wire;`,
`Prefix text with ${n}:, encode strict UTF-8 without BOM, Base64 encode, validate the reverse round trip, and return the wire Base64. Invalid UTF-16 surrogate sequences throw EncoderFallbackException. Base64 is encoding, not encryption.`,
'Use UTF8Encoding with throwOnInvalidBytes to avoid silent replacement.',[
eq(cs(Buffer.from(`${n}:${text}`,'utf8').toString('base64')),`Solve(${cs(text)})`),eq(cs(Buffer.from(`${n}:`,'utf8').toString('base64')),'Solve("")'),eq(cs(Buffer.from(`${n}:😀`,'utf8').toString('base64')),'Solve("😀")'),raises('EncoderFallbackException',`Solve(${cs('\uD800')})`)]);});
F('Invariant TimeSpan scaling and formatting',v=>{const n=v+1;return spec('string Solve(string duration)','duration',`if(!TimeSpan.TryParseExact(duration,"c",CultureInfo.InvariantCulture,out var parsed))throw new FormatException("Expected constant duration");return TimeSpan.FromTicks(checked(parsed.Ticks*${n})).ToString("c",CultureInfo.InvariantCulture);`,
`Parse constant-format TimeSpan (c), multiply ticks by ${n} checked, and return invariant c format. Invalid input throws FormatException. Preserve subsecond precision; no floating-point conversion.`,
'Tick arithmetic avoids rounding fractional seconds.',[
eq(cs(`00:00:${String(n).padStart(2,'0')}`),'Solve("00:00:01")'),eq('"00:00:00"','Solve("00:00:00")'),eq(cs(`-00:00:${String(n).padStart(2,'0')}`),'Solve("-00:00:01")'),raises('FormatException','Solve("not-time")')]);});
F('Business-day calendars with holidays',v=>{const n=v+1;const add=(s,k,holidays=[])=>{let d=new Date(s+'T00:00:00Z');while(k){d.setUTCDate(d.getUTCDate()+1);if(![0,6].includes(d.getUTCDay())&&!holidays.includes(d.toISOString().slice(0,10)))k--;}return d.toISOString().slice(0,10);};const date=s=>`new DateOnly(${s.split('-').map(Number).join(',')})`;return spec('DateOnly Solve(DateOnly start,ISet<DateOnly> holidays)','start, holidays',`var date=start;int remaining=${n};while(remaining>0){date=date.AddDays(1);if(date.DayOfWeek is not (DayOfWeek.Saturday or DayOfWeek.Sunday)&&!holidays.Contains(date))remaining--;}return date;`,
`Advance ${n} business days after start, excluding weekends and injected holidays. Start itself never counts. Holidays on weekends have no additional effect. Include leap-year boundaries correctly.`,
'This differs from adding calendar days: advance one day then decide whether it counts.',[
eq(date(add('2024-02-28',n)),'Solve(new DateOnly(2024,2,28),new HashSet<DateOnly>())'),eq(date(add('2024-02-28',n,['2024-02-29'])),'Solve(new DateOnly(2024,2,28),new HashSet<DateOnly> { new(2024,2,29) })'),eq(date(add('2024-03-01',n)),'Solve(new DateOnly(2024,3,1),new HashSet<DateOnly>())')]);});
F('Injected time zone instant conversion',v=>{const n=v-5;return spec('DateTimeOffset Solve(DateTimeOffset instant,TimeZoneInfo zone)','instant, zone',`ArgumentNullException.ThrowIfNull(zone);return TimeZoneInfo.ConvertTime(instant.AddMinutes(${v+1}),zone);`,
`Move instant forward ${v+1} minutes then convert to an injected TimeZoneInfo. Preserve the shifted UTC instant and expose destination offset. Scenario fixture uses a custom fixed UTC${n>=0?'+':''}${n} zone, not OS-specific zone IDs.`,
'DateTimeOffset conversion preserves instants; offset must be asserted separately because value equality compares UTC.',[
`var zone=TimeZoneInfo.CreateCustomTimeZone("fixture",TimeSpan.FromHours(${n}),"fixture","fixture");var instant=new DateTimeOffset(2024,2,29,23,59,0,TimeSpan.Zero);var result=Solve(instant,zone);Check.Equal(instant.AddMinutes(${v+1}),result);Check.Equal(TimeSpan.FromHours(${n}),result.Offset);Check.Equal(new DateOnly(2024,${n<0?'2,29':'3,1'}),DateOnly.FromDateTime(result.DateTime));`,raises('ArgumentNullException','Solve(DateTimeOffset.UnixEpoch,null!)')]);});
F('Exact minor-unit money allocation',v=>{const n=v+1;return spec('long[] Solve(decimal total)','total',`if(total<0||total*100m!=decimal.Truncate(total*100m))throw new ArgumentException("Nonnegative whole cents required");long cents=checked((long)(total*100m));long each=cents/${n},remainder=cents%${n};var result=new long[${n}];for(int i=0;i<result.Length;i++)result[i]=each+(i<remainder?1:0);return result;`,
`Allocate nonnegative money with at most two effective decimal places across ${n} recipients. Return long cents, assigning remainder cents to earliest recipients. Preserve every cent; reject subcent amounts and negative totals. Decimal scale alone must not affect equality.`,
'Integer quotient plus remainder avoids independently rounded shares losing money.',[
eq(`new long[] { ${Array.from({length:n},(_,i)=>Math.floor(100/n)+(i<100%n?1:0)).join(',')} }`,'Solve(1.00m)'),eq(`new long[${n}]`,'Solve(0m)'),`var amounts=Solve(12.30m);Check.Equal(1230L,amounts.Sum());Check.Equal(Solve(1m),Solve(1.000m));`,raises('ArgumentException','Solve(0.001m)'),raises('ArgumentException','Solve(-1m)')]);});
F('BigInteger modular exponentiation',v=>{const n=v+2;const pow=(x,e,m)=>{let r=1n;for(let i=0;i<e;i++)r=r*BigInt(x)%BigInt(m);return Number(r);};return spec('BigInteger Solve(BigInteger value,int exponent)','value, exponent',`if(exponent<0)throw new ArgumentOutOfRangeException(nameof(exponent));BigInteger modulus=${n};value=((value%modulus)+modulus)%modulus;return BigInteger.ModPow(value,exponent,modulus);`,
`Compute value^exponent modulo ${n} using BigInteger. Normalize negative bases into [0,modulus). Reject negative exponents; exponent zero returns 1 (including base zero).`,
'Normalize a negative remainder before calling modular exponentiation.',[
eq(`new BigInteger(${pow(3,5,n)})`,'Solve(new BigInteger(3),5)'),eq(`new BigInteger(${(n-1)**2%n})`,'Solve(new BigInteger(-1),2)'),eq('BigInteger.One','Solve(BigInteger.Zero,0)'),raises('ArgumentOutOfRangeException','Solve(BigInteger.One,-1)')]);});
F('Deterministic topological dependency ordering',v=>{const n=v+1;return spec('string[] Solve(Dictionary<string,string[]> graph,IComparer<string> comparer)','graph, comparer',`var nodes=new HashSet<string>(graph.Keys,StringComparer.Ordinal);foreach(var edges in graph.Values)nodes.UnionWith(edges);var degree=nodes.ToDictionary(x=>x,_=>0,StringComparer.Ordinal);foreach(var edges in graph.Values)foreach(var next in edges.Distinct(StringComparer.Ordinal))degree[next]++;var ready=new SortedSet<string>(nodes.Where(x=>degree[x]==0),comparer);var result=new List<string>();while(ready.Count>0){var node=ready.Min!;ready.Remove(node);result.Add(node);foreach(var next in graph.GetValueOrDefault(node,Array.Empty<string>()).Distinct(StringComparer.Ordinal))if(--degree[next]==0)ready.Add(next);}if(result.Count!=nodes.Count)throw new InvalidOperationException("Cycle");return result.ToArray();`,
`Kahn topological sort of directed graph (source before target). Include leaf-only nodes; collapse duplicate edges; choose ready nodes with injected total comparer distinguishing unequal strings. Reject cycles. Related scenario has ${n} independent prerequisites.`,
'Indegree must count the same distinct edges that the release step decrements.',[
eq(strings(['a','b','c']),'Solve(new() { ["b"]=new[] { "c" },["a"]=new[] { "c","c" } },StringComparer.Ordinal)'),eq(strings(['b','a','c']),'Solve(new() { ["b"]=new[] { "c" },["a"]=new[] { "c" } },Comparer<string>.Create((a,b)=>StringComparer.Ordinal.Compare(b,a)))'),raises('InvalidOperationException','Solve(new() { ["a"]=new[] { "a" } },StringComparer.Ordinal)'),eq(String(n),`Solve(Enumerable.Range(0,${n}).ToDictionary(x=>x.ToString("D2",CultureInfo.InvariantCulture),_=>Array.Empty<string>()),StringComparer.Ordinal).Length`),eq(strings([]),'Solve(new(),StringComparer.Ordinal)')]);});
F('Dijkstra weighted graph distances',v=>{const n=v+1;return spec('SortedDictionary<string,long> Solve(Dictionary<string,Edge[]> graph,string start)','graph, start',`foreach(var edges in graph.Values)if(edges.Any(e=>e.Cost<0))throw new ArgumentException("Negative edge");var distance=new SortedDictionary<string,long>(StringComparer.Ordinal) { [start]=0 };var queue=new PriorityQueue<string,long>();queue.Enqueue(start,0);while(queue.TryDequeue(out var node,out var cost)){if(cost!=distance[node])continue;foreach(var edge in graph.GetValueOrDefault(node,Array.Empty<Edge>())){long candidate=checked(cost+edge.Cost+${n});if(!distance.TryGetValue(edge.To,out var old)||candidate<old){distance[edge.To]=candidate;queue.Enqueue(edge.To,candidate);}}}return distance;`,
`Shortest directed weighted distances from start, charging edge Cost plus per-edge toll ${n}. Reject any negative raw edge even if unreachable. Missing keys are leaves. Return only reachable keys sorted ordinally; long checked costs; tolerate stale priority queue entries.`,
'Only relax a shorter path and ignore dequeued entries whose cost is obsolete.',[
eq(`new SortedDictionary<string,long> { ["a"]=0,["b"]=${n+1},["c"]=${Math.min(20+n,2+2*n)} }`,'Solve(new() { ["a"]=new[] { new Edge("b",1),new Edge("c",20) },["b"]=new[] { new Edge("c",1) } },"a")'),eq('new SortedDictionary<string,long> { ["x"]=0 }','Solve(new(),"x")'),raises('ArgumentException','Solve(new() { ["z"]=new[] { new Edge("q",-1) } },"x")')],
'public sealed record Edge(string To,int Cost);');});
F('Half-open interval overlap queries',v=>{const n=v+1;return spec('int[] Solve((int Start,int End)[] intervals,int[] points)','intervals, points',`if(intervals.Any(x=>x.Start>x.End))throw new ArgumentException("Reversed interval");return points.Select(p=>intervals.Count(x=>x.Start<=p&&p<x.End&&x.End-(long)x.Start>=${n})).ToArray();`,
`For each point count half-open intervals [Start,End) containing it and with length >=${n}. Preserve point order; empty intervals contain nothing. Reject reversed intervals. Use long subtraction for extreme endpoints. This is a coverage query, not interval merging.`,
'The right endpoint is excluded and interval length may exceed int.MaxValue.',[
eq(ints([1,1,0]),`Solve(new[] { (0,${n}) },new[] { 0,${n-1},${n} })`),eq(ints([0]),`Solve(new[] { (0,${n-1}) },new[] { 0 })`),eq(ints([1]),'Solve(new[] { (int.MinValue,int.MaxValue) },new[] { 0 })'),raises('ArgumentException','Solve(new[] { (2,1) },Array.Empty<int>())')]);});
F('Trie prefix completion',v=>{const n=v+1;return spec('string[] Solve(string[] words,string prefix)','words, prefix',`var root=new TrieNode();foreach(var word in words){var node=root;foreach(char c in word){if(!node.Children.TryGetValue(c,out var next)){next=new TrieNode();node.Children[c]=next;}node=next;}node.Terminal=true;}var current=root;foreach(char c in prefix){if(!current.Children.TryGetValue(c,out var next))return Array.Empty<string>();current=next;}var result=new List<string>();void Visit(TrieNode node,string text){if(result.Count>=${n})return;if(node.Terminal)result.Add(text);foreach(var pair in node.Children)Visit(pair.Value,text+pair.Key);}Visit(current,prefix);return result.ToArray();`,
`Build a char trie and return at most ${n} distinct words beginning with prefix, sorted ordinally. Prefix itself may be a word; empty words and empty prefix are valid. Case-sensitive UTF-16 char ordering, no normalization.`,
'Terminal nodes distinguish a complete word from an internal prefix.',[
eq(strings(['a','ab','ac'].slice(0,n)),'Solve(new[] { "ac","a","ab","a","b" },"a")'),eq(strings([]),'Solve(new[] { "a" },"z")'),eq(strings(['','x'].slice(0,n)),'Solve(new[] { "x","" },"")'),eq(strings([]),'Solve(Array.Empty<string>(),"")')],
'private sealed class TrieNode { public bool Terminal; public SortedDictionary<char,TrieNode> Children { get; }=new(); }');});
F('LRU access order with eviction callbacks',v=>{const n=v+1;return spec('string[] Solve(string[] accesses,Action<string> evict)','accesses, evict',`ArgumentNullException.ThrowIfNull(evict);var order=new LinkedList<string>();var nodes=new Dictionary<string,LinkedListNode<string>>(StringComparer.Ordinal);foreach(var key in accesses){if(nodes.Remove(key,out var existing))order.Remove(existing);else if(order.Count==${n}){string old=order.First!.Value;order.RemoveFirst();nodes.Remove(old);evict(old);}nodes[key]=order.AddLast(key);}return order.ToArray();`,
`Simulate an LRU cache of capacity ${n}. Every access inserts or promotes a key. On insertion at capacity evict least recent and call injected callback once. Return least-to-most-recent keys. Repeated keys do not consume capacity or trigger eviction.`,
'A dictionary plus linked list supports O(1) promotion and eviction.',[
`var removed=new List<string>();var keys=Enumerable.Range(0,${n+1}).Select(x=>"k"+x.ToString(CultureInfo.InvariantCulture)).ToArray();Check.Equal(keys.Skip(1).ToArray(),Solve(keys,removed.Add));Check.Equal(new[] { "k0" },removed.ToArray());`,eq(strings(['x']),'Solve(new[] { "x","x" },_=>throw new Exception("Unexpected eviction"))'),eq(strings([]),'Solve(Array.Empty<string>(),_=>{})'),
`var promoted=Solve(new[] { "a","b","a" },_=>{});Check.Equal(${n===1?'new[] { "a" }':'new[] { "b","a" }'},promoted);`]);});
F('Disjoint-set union components',v=>{const n=v+2;return spec('int[] Solve((int Left,int Right)[] edges)','edges',`var parent=Enumerable.Range(0,${n}).ToArray();int Find(int x){while(parent[x]!=x){parent[x]=parent[parent[x]];x=parent[x];}return x;}foreach(var (left,right) in edges){if(left<0||left>=${n}||right<0||right>=${n})throw new ArgumentOutOfRangeException(nameof(edges));int a=Find(left),b=Find(right);if(a!=b)parent[Math.Max(a,b)]=Math.Min(a,b);}return Enumerable.Range(0,${n}).Select(Find).ToArray();`,
`Union undirected edges over vertices 0..${n-1}; return each vertex's smallest component member as canonical root. Use path compression, handle duplicate/self edges, reject out-of-range vertices.`,
'Link larger roots beneath smaller roots to preserve the canonical-minimum invariant.',[
eq(ints([0,0,...Array.from({length:n-2},(_,i)=>i+2)]),'Solve(new[] { (1,0),(0,1),(1,1) })'),eq(ints(Array.from({length:n},(_,i)=>i)),'Solve(Array.Empty<(int,int)>())'),eq(`new int[${n}]`,`Solve(Enumerable.Range(1,${n-1}).Select(i=>(i-1,i)).ToArray())`),raises('ArgumentOutOfRangeException',`Solve(new[] { (0,${n}) })`)]);});
F('Monotonic deque window maxima',v=>{const n=v+1;return spec('int[] Solve(int[] values)','values',`var deque=new LinkedList<int>();var result=new List<int>();for(int i=0;i<values.Length;i++){while(deque.First is not null&&deque.First.Value<=i-${n})deque.RemoveFirst();while(deque.Last is not null&&values[deque.Last.Value]<=values[i])deque.RemoveLast();deque.AddLast(i);if(i>=${n-1})result.Add(values[deque.First!.Value]);}return result.ToArray();`,
`Return maximum for every contiguous window of width ${n}, or [] if too short. O(n) using a decreasing deque of indices. Preserve negatives and input; this is maxima, not running sums.`,
'Expire old indices before discarding smaller candidates from the back.',[
eq(ints([n,n+1]),`Solve(Enumerable.Range(1,${n+1}).ToArray())`),eq(ints([-2,-2]),`Solve(Enumerable.Repeat(-2,${n+1}).ToArray())`),eq(ints([]),`Solve(new int[${n-1}])`),eq(ints([n+1,n]),`Solve(Enumerable.Range(1,${n+1}).Reverse().ToArray())`)]);});
F('Checked matrix multiplication',v=>{const n=v+1;return spec('long[,] Solve(int[,] left,int[,] right)','left, right',`int rows=left.GetLength(0),inner=left.GetLength(1),cols=right.GetLength(1);if(inner!=right.GetLength(0))throw new ArgumentException("Shape mismatch");var result=new long[rows,cols];for(int r=0;r<rows;r++)for(int c=0;c<cols;c++)for(int k=0;k<inner;k++)result[r,c]=checked(result[r,c]+(long)left[r,k]*right[k,c]);return result;`,
`Multiply rectangular matrices into long[,] using checked accumulation and long products. Inner dimensions must agree. Zero-sized dimensions are legal. Related fixture uses ${n} inner terms; verify entries explicitly because JSON does not support multidimensional arrays.`,
'Rows of left dot columns of right; promote before multiplying.',[
`var a=new int[2,${n}];var b=new int[${n},1];for(int i=0;i<${n};i++){a[0,i]=2;a[1,i]=-1;b[i,0]=3;}var result=Solve(a,b);Check.Equal(2,result.GetLength(0));Check.Equal(1,result.GetLength(1));Check.Equal(${n*6}L,result[0,0]);Check.Equal(${-n*3}L,result[1,0]);`,
`Check.Equal(0L,Solve(new int[1,0],new int[0,1])[0,0]);Check.Equal(4611686014132420609L,Solve(new[,] { { int.MaxValue } },new[,] { { int.MaxValue } })[0,0]);`,raises('ArgumentException','Solve(new int[1,2],new int[1,1])')]);});
F('Spiral rectangular matrix traversal',v=>{const n=v+1;return spec('int[] Solve(int[,] matrix)','matrix',`int top=0,bottom=matrix.GetLength(0)-1,left=0,right=matrix.GetLength(1)-1;var result=new List<int>();while(top<=bottom&&left<=right){for(int c=left;c<=right;c++)result.Add(matrix[top,c]);top++;for(int r=top;r<=bottom;r++)result.Add(matrix[r,right]);right--;if(top<=bottom){for(int c=right;c>=left;c--)result.Add(matrix[bottom,c]);bottom--;}if(left<=right){for(int r=bottom;r>=top;r--)result.Add(matrix[r,left]);left++;}}return result.ToArray();`,
`Traverse a rectangular matrix clockwise from top-left in a spiral. Return every element once without mutation. Scenario includes a ${n}-column strip plus odd-center and empty boundaries.`,
'Recheck bounds after each side to avoid duplicating a final row or column.',[
eq(ints([1,2,3,6,9,8,7,4,5]),'Solve(new[,] { {1,2,3},{4,5,6},{7,8,9} })'),`var strip=new int[1,${n}];for(int i=0;i<${n};i++)strip[0,i]=i;Check.Equal(Enumerable.Range(0,${n}).ToArray(),Solve(strip));`,eq(ints([]),'Solve(new int[0,3])'),eq(ints([1,2,3]),'Solve(new[,] { {1},{2},{3} })')]);});
F('Recursive-descent arithmetic DSL',v=>{const n=v+1;return spec('long Solve(string text)','text',`int index=0;void Skip(){while(index<text.Length&&char.IsWhiteSpace(text[index]))index++;}long Atom(){Skip();if(index<text.Length&&text[index]=='('){index++;long value=Sum();Skip();if(index>=text.Length||text[index++]!=')')throw new FormatException("Missing close");return value;}int start=index;while(index<text.Length&&text[index]>='0'&&text[index]<='9')index++;if(start==index)throw new FormatException("Expected integer");return long.Parse(text.AsSpan(start,index-start),NumberStyles.None,CultureInfo.InvariantCulture);}long Product(){long value=Atom();for(;;){Skip();if(index>=text.Length||text[index]!='*')return value;index++;value=checked(value*Atom());}}long Sum(){long value=Product();for(;;){Skip();if(index>=text.Length||text[index]!='+')return value;index++;value=checked(value+Product());}}long result=Sum();Skip();if(index!=text.Length)throw new FormatException("Trailing input");return checked(result+${n});`,
`Parse nonnegative integer expressions with +, *, parentheses and whitespace; multiplication binds tighter. No unary signs. Require full consumption and checked long arithmetic. Return parsed result plus scenario offset ${n}.`,
'One recursive function per precedence level keeps grammar and evaluation aligned.',[
eq(`${n+14}L`,'Solve("2 + 3 * 4")'),eq(`${n+20}L`,'Solve("(2 + 3) * 4")'),raises('FormatException','Solve("1+")'),raises('FormatException','Solve("(2")'),raises('FormatException','Solve("2x")'),raises('OverflowException','Solve("9223372036854775807+1")')]);});
F('Finite-state approval workflow',v=>{const n=v+1;return spec('string Solve(string[] events)','events',`string state="draft";int approvals=0;foreach(var item in events){switch(state,item){case ("draft","submit"):state="pending";break;case ("pending","approve"):if(++approvals==${n})state="approved";break;case ("pending","reject"):state="rejected";break;case ("rejected","reset"):state="draft";approvals=0;break;default:throw new InvalidOperationException("Invalid transition");}}return state;`,
`Workflow begins draft. submit -> pending; ${n} approve events -> approved; reject while pending -> rejected; reset from rejected -> draft and clears approvals. All other transitions, including events after approved, throw.`,
'Treat state and event as a pair; reset associated state when re-entering draft.',[
eq('"draft"','Solve(Array.Empty<string>())'),eq('"approved"',`Solve(new[] { "submit" }.Concat(Enumerable.Repeat("approve",${n})).ToArray())`),eq('"draft"','Solve(new[] { "submit","reject","reset" })'),raises('InvalidOperationException','Solve(new[] { "approve" })'),raises('InvalidOperationException',`Solve(new[] { "submit" }.Concat(Enumerable.Repeat("approve",${n+1})).ToArray())`)]);});
F('Clock-injected circuit breaker simulation',v=>{const n=v+1;return spec('string[] Solve(Attempt[] attempts,Func<long> clock)','attempts, clock',`long? openUntil=null;var result=new List<string>();foreach(var attempt in attempts){long now=clock();if(openUntil is long until&&now<until){result.Add("blocked");continue;}if(attempt.Success){openUntil=null;result.Add("ok");}else{openUntil=checked(now+${n});result.Add("failed");}}return result.ToArray();`,
`A failed attempted call opens the circuit for ${n} injected clock units. Before openUntil return blocked without using the attempted success result. At exact boundary allow a probe; success closes, failure reopens. Read clock once per supplied attempt.`,
'Use nullable openUntil so time zero and negative timestamps remain meaningful.',[
`long[] times={0,0,${n},${n}};int reads=0;Check.Equal(new[] { "failed","blocked","ok","ok" },Solve(new[] { new Attempt(false),new Attempt(true),new Attempt(true),new Attempt(true) },()=>times[reads++]));Check.Equal(4,reads);`,
`long[] times2={0,${n},${n}};int index=0;Check.Equal(new[] { "failed","failed","blocked" },Solve(new[] { new Attempt(false),new Attempt(false),new Attempt(true) },()=>times2[index++]));`,eq(strings([]),'Solve(Array.Empty<Attempt>(),()=>throw new Exception("No clock reads"))')],
'public sealed record Attempt(bool Success);');});
F('Unit-of-work atomic staged transfers',v=>{const n=v+1;return spec('bool Solve(IStore store,int amount)','store, amount',`if(amount<0)throw new ArgumentOutOfRangeException(nameof(amount));var state=store.Read();if(state.Left<amount+${n}L)return false;long left=checked(state.Left-amount-${n});long right=checked(state.Right+amount);store.Commit(left,right);return true;`,
`Transfer amount from Left to Right with fee ${n} removed from Left. Read injected store once; insufficient funds returns false without commit. Validate and compute both new balances before one atomic Commit. Negative amounts throw; overflow must not partially commit.`,
'A unit of work stages all derived values before crossing the commit boundary.',[
`var store=new MemoryStore(100,10);Check.True(Solve(store,20));Check.Equal(${80-n}L,store.Left);Check.Equal(30L,store.Right);Check.Equal(1,store.Commits);`,
`var poor=new MemoryStore(${n-1},0);Check.Equal(false,Solve(poor,0));Check.Equal(0,poor.Commits);`,
`var overflow=new MemoryStore(100,long.MaxValue);Check.Throws<OverflowException>(()=>Solve(overflow,1));Check.Equal(100L,overflow.Left);Check.Equal(0,overflow.Commits);`,raises('ArgumentOutOfRangeException','Solve(new MemoryStore(0,0),-1)')],
'public interface IStore { (long Left,long Right) Read(); void Commit(long left,long right); } public sealed class MemoryStore(long left,long right):IStore { public long Left=left,Right=right; public int Commits; public (long Left,long Right) Read()=>(Left,Right); public void Commit(long left,long right){Left=left;Right=right;Commits++;} }');});
F('Repository optimistic version updates',v=>{const n=v+1;return spec('bool Solve(IRepository repository,int expectedVersion,string value)','repository, expectedVersion, value',`ArgumentNullException.ThrowIfNull(value);var row=repository.Get(${n});if(row is null||row.Version!=expectedVersion)return false;return repository.TryReplace(${n},expectedVersion,row with { Value=value,Version=checked(expectedVersion+1) });`,
`Update repository row ID ${n} only at expectedVersion. Missing/stale returns false. Create a new Row with incremented version and new value, then use atomic TryReplace so a race after Get cannot overwrite newer state. Null value throws.`,
'The early version check is not enough; the write must compare the version again.',[
`var repo=new MemoryRepository(${n},new Row(2,"old"));Check.True(Solve(repo,2,"new"));Check.Equal(new Row(3,"new"),repo.Current);Check.Equal(false,Solve(repo,2,"stale"));Check.Equal("new",repo.Current!.Value);`,
`Check.Equal(false,Solve(new MemoryRepository(${n+1},new Row(1,"x")),1,"y"));`,
`var race=new MemoryRepository(${n},new Row(1,"old")) { RejectWrite=true };Check.Equal(false,Solve(race,1,"new"));Check.Equal("old",race.Current!.Value);`,raises('ArgumentNullException',`Solve(new MemoryRepository(${n},null),1,null!)`)],
'public sealed record Row(int Version,string Value); public interface IRepository { Row? Get(int id); bool TryReplace(int id,int expected,Row replacement); } public sealed class MemoryRepository(int id,Row? initial):IRepository { public Row? Current=initial; public bool RejectWrite; public Row? Get(int key)=>key==id?Current:null; public bool TryReplace(int key,int expected,Row replacement){if(RejectWrite||key!=id||Current?.Version!=expected)return false;Current=replacement;return true;} }');});
F('Dimension-safe unit conversion tables',v=>{const n=v+1;return spec('decimal Solve(decimal value,string from,string to)','value, from, to',`var units=new Dictionary<string,(string Dimension,decimal Scale)>(StringComparer.Ordinal) { ["m"]=("length",1m),["cm"]=("length",0.01m),["km"]=("length",1000m),["s"]=("time",1m),["min"]=("time",60m),["batch"]=("length",${n}m) };if(!units.TryGetValue(from,out var a)||!units.TryGetValue(to,out var b))throw new ArgumentException("Unknown unit");if(a.Dimension!=b.Dimension)throw new ArgumentException("Dimension mismatch");return checked(value*a.Scale/b.Scale);`,
`Convert using exact decimal base-unit scales: m/cm/km length, s/min time, and scenario batch=${n} meters. Unit names are ordinal case-sensitive. Reject unknown or cross-dimension pairs; signed values allowed.`,
'Normalize to a base unit, then divide by destination scale; dimensions must match.',[
eq(`${n*100}m`,'Solve(1m,"batch","cm")'),eq('1m','Solve(100m,"cm","m")'),eq('-120m','Solve(-2m,"min","s")'),eq('1m','Solve(1.000m,"m","m")'),raises('ArgumentException','Solve(1m,"m","s")'),raises('ArgumentException','Solve(1m,"M","m")')]);});
F('Sieve smallest-prime-factor tables',v=>{const n=v+10;const spf=x=>{for(let d=2;d*d<=x;d++)if(x%d===0)return d;return x;};return spec('int[] Solve(int limit)','limit',`if(limit<0||limit>${n})throw new ArgumentOutOfRangeException(nameof(limit));var result=new int[limit+1];for(int p=2;p<=limit;p++){if(result[p]!=0)continue;result[p]=p;if((long)p*p>limit)continue;for(int multiple=p*p;multiple<=limit;multiple+=p)if(result[multiple]==0)result[multiple]=p;}return result;`,
`Build smallest-prime-factor table for indices 0..limit, accepting 0<=limit<=${n}. Entries 0 and 1 stay 0, primes map to themselves, composites map to smallest prime. Use a sieve rather than testing each number independently.`,
'Only the first prime marking a composite is its smallest factor.',[
eq(ints([0]),'Solve(0)'),eq(ints([0,0,2,3,2,5,2,7,2,3,2]),'Solve(10)'),eq(ints(Array.from({length:n+1},(_,i)=>i<2?0:spf(i))),`Solve(${n})`),raises('ArgumentOutOfRangeException',`Solve(${n+1})`),raises('ArgumentOutOfRangeException','Solve(-1)')]);});
F('Markdown-lite block parsing',v=>{const n=v%6+1,cap=v+1;return spec('Block[] Solve(string text)','text',`using var reader=new StringReader(text);var result=new List<Block>();string? line;while((line=reader.ReadLine()) is not null){if(string.IsNullOrWhiteSpace(line))continue;int hashes=0;while(hashes<line.Length&&line[hashes]=='#')hashes++;if(hashes>=1&&hashes<=${n}&&hashes<line.Length&&line[hashes]==' ')result.Add(new Block("h"+hashes.ToString(CultureInfo.InvariantCulture),line[(hashes+1)..].Trim()));else result.Add(new Block("p",line.Trim()));if(result.Count==${cap})break;}return result.ToArray();`,
`Parse up to ${cap} nonblank line blocks. Recognize 1..${n} leading # characters followed by a space as hLEVEL, otherwise p. Trim content, preserve literal markup (no HTML rendering). CRLF, CR and LF line endings work. This is explicitly a Markdown subset, not CommonMark.`,
'StringReader handles platform-independent line endings; heading syntax requires a separating space.',[
eq(`new[] { new Block("h${n}","Title") }`,`Solve(${cs('#'.repeat(n)+' Title\r\n')})`),eq('new[] { new Block("p","#NoSpace") }','Solve("#NoSpace")'),eq('Array.Empty<Block>()',`Solve(${cs(' \r\n\n\r')})`),eq(`new Block[] { ${Array.from({length:cap},()=> 'new Block("p","x")').join(',')} }`,`Solve(string.Join(${cs('\r')},Enumerable.Repeat("x",${cap+2})))`)] ,
'public sealed record Block(string Kind,string Text);');});

if(families.length!==53)throw new Error('Expected 53 families, got '+families.length);
const exercises=[];
for(let f=0;f<families.length;f++)for(let v=0;v<11;v++){
 const id=584+f*11+v,item=families[f].make(v);
 if(typeof item.callArgs!=='string')throw new Error('Explicit callArgs required for '+id);
 exercises.push({id,name:families[f].title,scenario:v+1,...item});
}
const header=`// UNIONBOOT C# MORE — 583 exercises (53 NEW topic families x 11 related scenarios)
// Standalone .NET10 file-based app, no NuGet dependencies.
// dotnet run --file CSHARP-MORE-583.cs -- --verify
// dotnet run --file CSHARP-MORE-583.cs -- --list
// dotnet run --file CSHARP-MORE-583.cs -- --show 584
// dotnet run --file CSHARP-MORE-583.cs -- --verify 584
// dotnet run --file CSHARP-MORE-583.cs -- --practice 584
// Edit E584.Practice etc. References live in the same class as Solve.
// Variants revisit topics with different policies/boundaries/injected fixtures, not 583 unrelated topics.
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
let source=header+exercises.map(e=>`    new(${e.id}, ${cs(e.name+' / scenario '+e.scenario)}, ${cs(e.requirements)}, ${cs(e.hint)}, E${e.id}.Verify),`).join('\n')+`\n};
if(exercises.Length!=583 || !exercises.Select(e=>e.Id).SequenceEqual(Enumerable.Range(584,583)))throw new Exception("Exercise inventory mismatch");
if(args.Length==0 || args[0]=="--help") { Console.WriteLine("UNIONBOOT C# MORE —583 exercises (584–1166)\\n--list | --show ID | --verify [ID] | --practice ID\\nPractice methods intentionally throw until implemented.\\n53 NEW topic families,11 related scenario variants each. No dependencies beyond .NET10.\\nSearch for class E584 etc. in this source file to edit. Reference solutions share the class.\\nA test may use more than one assertion. No tasks access the network or your files."); return; }
if(args[0]=="--list"){foreach(var e in exercises)Console.WriteLine($"{e.Id:000} {e.Title}");return;}
if(args[0] is not ("--verify" or "--practice" or "--show")){Console.Error.WriteLine("Unknown command");Environment.ExitCode=2;return;}
int? id=null;if(args.Length>1){if(!int.TryParse(args[1],out var parsed)||parsed<584||parsed>1166){Console.Error.WriteLine("ID must be584–1166");Environment.ExitCode=2;return;}id=parsed;}
if((args[0]=="--show"||args[0]=="--practice")&&id is null){Console.Error.WriteLine("Specify an ID");Environment.ExitCode=2;return;}
if(args[0]=="--show"){var e=exercises[id!.Value-584];Console.WriteLine($"{e.Id:000} {e.Title}\\n\\n{e.Requirements}\\n\\nHint: {e.Hint}\\n\\nEdit E{e.Id:000}.Practice. Read E{e.Id:000}.Reference for the solution; Verify contains examples.");return;}
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
 const cls='E'+e.id;
 const signature=e.signature;
 // All callArgs are explicit, including Func<int,Task<int>>, Func<int,int>, generic
 // IEqualityComparer<T>, []/[,] arrays, graph+start, and tuple return/parameter commas.
 // Locate Solve by name, never signature.indexOf('(') (tuple returns have their own parentheses).
 const generic=signature.includes('Solve<T>');
 let practiceSig=signature.replace(/\bSolve(?=[<(])/,'Practice');
 const refSig=signature.replace(/\bSolve(?=[<(])/,'Reference');
 const dispatcher=signature.replace(/^async /,'').replace(/\[EnumeratorCancellation\] /g,'');
 if(signature.startsWith('async IAsyncEnumerable<'))practiceSig=practiceSig.replace(/^async /,'').replace(/\[EnumeratorCancellation\] /g,'');
 const dispatchCall=name=>`${name}${generic?'<T>':''}(${e.callArgs})`;
 source+=`\n// ======================================================================\n// ${e.id}: ${e.name} / scenario ${e.scenario}\n// ${e.requirements}\n// Hint: ${e.hint}\n// Practice: --practice ${e.id}; reference: --verify ${e.id}\nstatic class ${cls} {\n${e.extra}\n public static ${practiceSig} {\n  // TODO: implement the exercise without calling Reference.\n  throw new NotImplementedException("Exercise ${e.id}");\n }\n public static ${refSig} {\n  ${e.body}\n }\n private static ${dispatcher} => Check.PracticeMode ? ${dispatchCall('Practice')} : ${dispatchCall('Reference')};\n public static void Verify() {\n  ${e.tests.join('\n  ')}\n }\n}\n`;
}
// Final authoring guard: one blank stub and independent reference/dispatcher/check group per ID.
for(const token of [/^static class E\d+ \{/gm,/public static [^\n]+ Practice(?:<T>)?\(/g,/public static [^\n]+ Reference(?:<T>)?\(/g,/private static [^\n]+ Solve(?:<T>)?\(/g,/public static void Verify\(\)/g]){
 if([...source.matchAll(token)].length!==583)throw new Error('Generated inventory mismatch: '+token);
}
if(/private static [^\n]+\[EnumeratorCancellation\]/.test(source))throw new Error('Iterator attribute on dispatcher');
fs.writeFileSync(target,source);
console.log('Created '+target+' with '+exercises.length+' exercises across '+families.length+' families. IDs 584–1166.');
