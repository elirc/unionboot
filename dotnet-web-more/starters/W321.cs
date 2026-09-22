// W321: Custom IResult implementations / JSON result executor status 200
namespace DotnetWeb;
public static class W321{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W321.ExecuteAsync(context,payload);}
public static Task ExecuteAsync(HttpContext context,string payload){throw new NotImplementedException("W321");}
}
