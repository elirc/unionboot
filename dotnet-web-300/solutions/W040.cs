// W040: ValidationProblem field errors / scenario 10
// Quantity 1..14; required display name
// Read prompts/W040.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W040 {

 public static IResult Handle(string? name, int quantity) {
  var errors=new Dictionary<string,string[]>();if(string.IsNullOrWhiteSpace(name))errors["name"]=new[]{"required"};if(quantity<1||quantity>14)errors["quantity"]=new[]{"range"};if(errors.Count>0)return Results.ValidationProblem(errors);return Results.Ok(new { name=name!.Trim(),quantity });
 }
}
