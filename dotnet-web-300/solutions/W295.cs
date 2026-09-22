// W295: Binary file HTTP results / scenario 5
// Download report-5.txt; UTF-8 text attachment
// Read prompts/W295.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W295 {

 public static IResult Handle(string? text) {
  if(text is null)return Results.NotFound();return Results.File(Encoding.UTF8.GetBytes(text),"text/plain; charset=utf-8","report-5.txt",enableRangeProcessing:false);
 }
}
