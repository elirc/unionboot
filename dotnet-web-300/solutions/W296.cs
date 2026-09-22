// W296: Binary file HTTP results / scenario 6
// Download report-6.txt; UTF-8 text attachment
// Read prompts/W296.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W296 {

 public static IResult Handle(string? text) {
  if(text is null)return Results.NotFound();return Results.File(Encoding.UTF8.GetBytes(text),"text/plain; charset=utf-8","report-6.txt",enableRangeProcessing:false);
 }
}
