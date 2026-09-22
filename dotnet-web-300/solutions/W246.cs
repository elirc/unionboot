// W246: Explicit content negotiation handlers / scenario 6
// JSON or plain text; payload ready-6
// Read prompts/W246.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W246 {

 public static IResult Handle(HttpRequest request) {
  var values=request.Headers.Accept;if(values.Count==0)return Results.Json(new {state="ready-6"});if(values.Count!=1)return Results.StatusCode(406);return values[0] switch {"application/json" or "*/*"=>Results.Json(new {state="ready-6"}),"text/plain"=>Results.Text("ready-6","text/plain"),_=>Results.StatusCode(406)};
 }
}
