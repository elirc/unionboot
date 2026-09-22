// W248: Explicit content negotiation handlers / scenario 8
// JSON or plain text; payload ready-8
// Read prompts/W248.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W248 {

 public static IResult Handle(HttpRequest request) {
  var values=request.Headers.Accept;if(values.Count==0)return Results.Json(new {state="ready-8"});if(values.Count!=1)return Results.StatusCode(406);return values[0] switch {"application/json" or "*/*"=>Results.Json(new {state="ready-8"}),"text/plain"=>Results.Text("ready-8","text/plain"),_=>Results.StatusCode(406)};
 }
}
