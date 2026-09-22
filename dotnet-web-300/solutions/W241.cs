// W241: Explicit content negotiation handlers / scenario 1
// JSON or plain text; payload ready-1
// Read prompts/W241.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W241 {

 public static IResult Handle(HttpRequest request) {
  var values=request.Headers.Accept;if(values.Count==0)return Results.Json(new {state="ready-1"});if(values.Count!=1)return Results.StatusCode(406);return values[0] switch {"application/json" or "*/*"=>Results.Json(new {state="ready-1"}),"text/plain"=>Results.Text("ready-1","text/plain"),_=>Results.StatusCode(406)};
 }
}
