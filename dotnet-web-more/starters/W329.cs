// W329: Custom IResult implementations / JSON result executor status 429
namespace DotnetWeb;
public static class W329{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W329.ExecuteAsync(context,payload);}
public static Task ExecuteAsync(HttpContext context,string payload){throw new NotImplementedException("W329");}
}
