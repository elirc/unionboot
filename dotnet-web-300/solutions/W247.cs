// W247: Explicit content negotiation handlers / scenario 7
// JSON or plain text; payload ready-7
// Read prompts/W247.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W247 {

 public static IResult Handle(HttpRequest request) {
  var values=request.Headers.Accept;if(values.Count==0)return Results.Json(new {state="ready-7"});if(values.Count!=1)return Results.StatusCode(406);return values[0] switch {"application/json" or "*/*"=>Results.Json(new {state="ready-7"}),"text/plain"=>Results.Text("ready-7","text/plain"),_=>Results.StatusCode(406)};
 }
}
