// W326: Custom IResult implementations / JSON result executor status 409
namespace DotnetWeb;
public static class W326{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W326.ExecuteAsync(context,payload);}
public static Task ExecuteAsync(HttpContext context,string payload){throw new NotImplementedException("W326");}
}
