// W294: Binary file HTTP results / scenario 4
// Download report-4.txt; UTF-8 text attachment
// Read prompts/W294.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W294 {

 public static IResult Handle(string? text) {
  if(text is null)return Results.NotFound();return Results.File(Encoding.UTF8.GetBytes(text),"text/plain; charset=utf-8","report-4.txt",enableRangeProcessing:false);
 }
}
