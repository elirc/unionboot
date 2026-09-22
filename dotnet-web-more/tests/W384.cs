using static DotnetWeb.W384;
namespace DotnetWeb;
public static class TestsW384{public static async Task Run(){await Task.CompletedTask;
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("charlie-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();var c=await Check.Execute(Verify("body",sig,"charlie-key"));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"verified",true);
}
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("charlie-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();Check.Status(401,Verify("other",sig,"charlie-key"));Check.Status(400,Verify("body","zz","charlie-key"));Check.Status(400,Verify("body","abc","charlie-key"));Check.Status(200,Verify("body",sig.ToUpperInvariant(),"charlie-key"));
}
}}
