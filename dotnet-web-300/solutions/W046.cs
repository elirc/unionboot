// W046: Pagination query handlers / scenario 6
// Default size 7, max 15; strict single-value query
// Read prompts/W046.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W046 {

 public static IResult Handle(HttpRequest request, IReadOnlyList<int> rows) {
  int page=1,size=7;foreach(var key in new[]{"page","size"}){if(!request.Query.TryGetValue(key,out var values))continue;if(values.Count!=1||!int.TryParse(values[0],NumberStyles.None,CultureInfo.InvariantCulture,out var n)||n<1)return Results.BadRequest();if(key=="page")page=n;else size=n;}if(size>15)return Results.BadRequest();long skip=((long)page-1)*size;var items=skip>=rows.Count?Array.Empty<int>():rows.Skip((int)skip).Take(size).ToArray();return Results.Ok(new {page,size,total=rows.Count,items});
 }
}
