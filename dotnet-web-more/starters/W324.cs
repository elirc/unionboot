// W324: Custom IResult implementations / JSON result executor status 400
namespace DotnetWeb;
public static class W324{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W324.ExecuteAsync(context,payload);}
public static Task ExecuteAsync(HttpContext context,string payload){throw new NotImplementedException("W324");}
}
