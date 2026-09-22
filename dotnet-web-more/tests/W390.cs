using static DotnetWeb.W390;
namespace DotnetWeb;
public static class TestsW390{public static async Task Run(){await Task.CompletedTask;
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("india-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();var c=await Check.Execute(Verify("body",sig,"india-key"));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"verified",true);
}
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("india-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();Check.Status(401,Verify("other",sig,"india-key"));Check.Status(400,Verify("body","zz","india-key"));Check.Status(400,Verify("body","abc","india-key"));Check.Status(200,Verify("body",sig.ToUpperInvariant(),"india-key"));
}
}}
