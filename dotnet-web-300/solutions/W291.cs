// W291: Binary file HTTP results / scenario 1
// Download report-1.txt; UTF-8 text attachment
// Read prompts/W291.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W291 {

 public static IResult Handle(string? text) {
  if(text is null)return Results.NotFound();return Results.File(Encoding.UTF8.GetBytes(text),"text/plain; charset=utf-8","report-1.txt",enableRangeProcessing:false);
 }
}
