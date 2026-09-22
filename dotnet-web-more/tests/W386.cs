using static DotnetWeb.W386;
namespace DotnetWeb;
public static class TestsW386{public static async Task Run(){await Task.CompletedTask;
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("echo-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();var c=await Check.Execute(Verify("body",sig,"echo-key"));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"verified",true);
}
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("echo-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();Check.Status(401,Verify("other",sig,"echo-key"));Check.Status(400,Verify("body","zz","echo-key"));Check.Status(400,Verify("body","abc","echo-key"));Check.Status(200,Verify("body",sig.ToUpperInvariant(),"echo-key"));
}
}}
