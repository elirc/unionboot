// W328: Custom IResult implementations / JSON result executor status 422
namespace DotnetWeb;
public static class W328{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W328.ExecuteAsync(context,payload);}
public static Task ExecuteAsync(HttpContext context,string payload){throw new NotImplementedException("W328");}
}
