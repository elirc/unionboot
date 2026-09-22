using static DotnetWeb.W387;
namespace DotnetWeb;
public static class TestsW387{public static async Task Run(){await Task.CompletedTask;
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("foxtrot-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();var c=await Check.Execute(Verify("body",sig,"foxtrot-key"));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"verified",true);
}
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("foxtrot-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();Check.Status(401,Verify("other",sig,"foxtrot-key"));Check.Status(400,Verify("body","zz","foxtrot-key"));Check.Status(400,Verify("body","abc","foxtrot-key"));Check.Status(200,Verify("body",sig.ToUpperInvariant(),"foxtrot-key"));
}
}}
