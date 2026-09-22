// W048: Pagination query handlers / scenario 8
// Default size 9, max 17; strict single-value query
// Read prompts/W048.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W048 {

 public static IResult Handle(HttpRequest request, IReadOnlyList<int> rows) {
  int page=1,size=9;foreach(var key in new[]{"page","size"}){if(!request.Query.TryGetValue(key,out var values))continue;if(values.Count!=1||!int.TryParse(values[0],NumberStyles.None,CultureInfo.InvariantCulture,out var n)||n<1)return Results.BadRequest();if(key=="page")page=n;else size=n;}if(size>17)return Results.BadRequest();long skip=((long)page-1)*size;var items=skip>=rows.Count?Array.Empty<int>():rows.Skip((int)skip).Take(size).ToArray();return Results.Ok(new {page,size,total=rows.Count,items});
 }
}
