// W327: Custom IResult implementations / JSON result executor status 410
namespace DotnetWeb;
public static class W327{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W327.ExecuteAsync(context,payload);}
public static Task ExecuteAsync(HttpContext context,string payload){throw new NotImplementedException("W327");}
}
