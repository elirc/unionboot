// W293: Binary file HTTP results / scenario 3
// Download report-3.txt; UTF-8 text attachment
// Read prompts/W293.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W293 {

 public static IResult Handle(string? text) {
  if(text is null)return Results.NotFound();return Results.File(Encoding.UTF8.GetBytes(text),"text/plain; charset=utf-8","report-3.txt",enableRangeProcessing:false);
 }
}
