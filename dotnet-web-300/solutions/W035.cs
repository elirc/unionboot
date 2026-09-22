// W035: ValidationProblem field errors / scenario 5
// Quantity 1..9; required display name
// Read prompts/W035.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W035 {

 public static IResult Handle(string? name, int quantity) {
  var errors=new Dictionary<string,string[]>();if(string.IsNullOrWhiteSpace(name))errors["name"]=new[]{"required"};if(quantity<1||quantity>9)errors["quantity"]=new[]{"range"};if(errors.Count>0)return Results.ValidationProblem(errors);return Results.Ok(new { name=name!.Trim(),quantity });
 }
}
