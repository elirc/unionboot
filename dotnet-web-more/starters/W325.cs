// W325: Custom IResult implementations / JSON result executor status 404
namespace DotnetWeb;
public static class W325{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W325.ExecuteAsync(context,payload);}
public static Task ExecuteAsync(HttpContext context,string payload){throw new NotImplementedException("W325");}
}
