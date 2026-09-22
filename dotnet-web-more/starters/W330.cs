// W330: Custom IResult implementations / JSON result executor status 503
namespace DotnetWeb;
public static class W330{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W330.ExecuteAsync(context,payload);}
public static Task ExecuteAsync(HttpContext context,string payload){throw new NotImplementedException("W330");}
}
