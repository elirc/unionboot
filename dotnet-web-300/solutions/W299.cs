// W299: Binary file HTTP results / scenario 9
// Download report-9.txt; UTF-8 text attachment
// Read prompts/W299.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W299 {

 public static IResult Handle(string? text) {
  if(text is null)return Results.NotFound();return Results.File(Encoding.UTF8.GetBytes(text),"text/plain; charset=utf-8","report-9.txt",enableRangeProcessing:false);
 }
}
