// W298: Binary file HTTP results / scenario 8
// Download report-8.txt; UTF-8 text attachment
// Read prompts/W298.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W298 {

 public static IResult Handle(string? text) {
  if(text is null)return Results.NotFound();return Results.File(Encoding.UTF8.GetBytes(text),"text/plain; charset=utf-8","report-8.txt",enableRangeProcessing:false);
 }
}
