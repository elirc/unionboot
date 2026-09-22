// W073: Date range query binding / scenario 3
// ISO dates; maximum inclusive span 3 days
// Read prompts/W073.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W073 {

 public static IResult Handle(HttpRequest request) {
  var a=request.Query["from"];var b=request.Query["to"];if(a.Count!=1||b.Count!=1||!DateOnly.TryParseExact(a[0],"yyyy-MM-dd",CultureInfo.InvariantCulture,DateTimeStyles.None,out var from)||!DateOnly.TryParseExact(b[0],"yyyy-MM-dd",CultureInfo.InvariantCulture,DateTimeStyles.None,out var to)||to<from||to.DayNumber-from.DayNumber+1>3)return Results.BadRequest();return Results.Ok(new {from=from.ToString("yyyy-MM-dd",CultureInfo.InvariantCulture),to=to.ToString("yyyy-MM-dd",CultureInfo.InvariantCulture),days=to.DayNumber-from.DayNumber+1});
 }
}
