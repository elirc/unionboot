using static DotnetWeb.W383;
namespace DotnetWeb;
public static class TestsW383{public static async Task Run(){await Task.CompletedTask;
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("bravo-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();var c=await Check.Execute(Verify("body",sig,"bravo-key"));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"verified",true);
}
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("bravo-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();Check.Status(401,Verify("other",sig,"bravo-key"));Check.Status(400,Verify("body","zz","bravo-key"));Check.Status(400,Verify("body","abc","bravo-key"));Check.Status(200,Verify("body",sig.ToUpperInvariant(),"bravo-key"));
}
}}
