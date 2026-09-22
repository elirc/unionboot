// W300: Binary file HTTP results / scenario 10
// Download report-10.txt; UTF-8 text attachment
// Read prompts/W300.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W300 {

 public static IResult Handle(string? text) {
  if(text is null)return Results.NotFound();return Results.File(Encoding.UTF8.GetBytes(text),"text/plain; charset=utf-8","report-10.txt",enableRangeProcessing:false);
 }
}
