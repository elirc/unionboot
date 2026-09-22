// W076: Date range query binding / scenario 6
// ISO dates; maximum inclusive span 6 days
// Read prompts/W076.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W076 {

 public static IResult Handle(HttpRequest request) {
  var a=request.Query["from"];var b=request.Query["to"];if(a.Count!=1||b.Count!=1||!DateOnly.TryParseExact(a[0],"yyyy-MM-dd",CultureInfo.InvariantCulture,DateTimeStyles.None,out var from)||!DateOnly.TryParseExact(b[0],"yyyy-MM-dd",CultureInfo.InvariantCulture,DateTimeStyles.None,out var to)||to<from||to.DayNumber-from.DayNumber+1>6)return Results.BadRequest();return Results.Ok(new {from=from.ToString("yyyy-MM-dd",CultureInfo.InvariantCulture),to=to.ToString("yyyy-MM-dd",CultureInfo.InvariantCulture),days=to.DayNumber-from.DayNumber+1});
 }
}
