// W323: Custom IResult implementations / JSON result executor status 202
namespace DotnetWeb;
public static class W323{
public sealed class RenderResult(string payload):IResult{public Task ExecuteAsync(HttpContext context)=>W323.ExecuteAsync(context,payload);}
public static Task ExecuteAsync(HttpContext context,string payload){throw new NotImplementedException("W323");}
}
