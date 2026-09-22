// W297: Binary file HTTP results / scenario 7
// Download report-7.txt; UTF-8 text attachment
// Read prompts/W297.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W297 {

 public static IResult Handle(string? text) {
  if(text is null)return Results.NotFound();return Results.File(Encoding.UTF8.GetBytes(text),"text/plain; charset=utf-8","report-7.txt",enableRangeProcessing:false);
 }
}
