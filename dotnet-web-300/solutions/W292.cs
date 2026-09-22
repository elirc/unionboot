// W292: Binary file HTTP results / scenario 2
// Download report-2.txt; UTF-8 text attachment
// Read prompts/W292.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W292 {

 public static IResult Handle(string? text) {
  if(text is null)return Results.NotFound();return Results.File(Encoding.UTF8.GetBytes(text),"text/plain; charset=utf-8","report-2.txt",enableRangeProcessing:false);
 }
}
