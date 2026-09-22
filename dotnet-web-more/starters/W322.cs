// W322: Custom IResult implementations / JSON result executor status 201
namespace DotnetWeb;
public static class W322{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W322.ExecuteAsync(context,payload);}
public static Task ExecuteAsync(HttpContext context,string payload){throw new NotImplementedException("W322");}
}
