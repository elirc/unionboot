using static DotnetWeb.W388;
namespace DotnetWeb;
public static class TestsW388{public static async Task Run(){await Task.CompletedTask;
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("golf-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();var c=await Check.Execute(Verify("body",sig,"golf-key"));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"verified",true);
}
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("golf-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();Check.Status(401,Verify("other",sig,"golf-key"));Check.Status(400,Verify("body","zz","golf-key"));Check.Status(400,Verify("body","abc","golf-key"));Check.Status(200,Verify("body",sig.ToUpperInvariant(),"golf-key"));
}
}}
