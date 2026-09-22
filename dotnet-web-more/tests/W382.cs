using static DotnetWeb.W382;
namespace DotnetWeb;
public static class TestsW382{public static async Task Run(){await Task.CompletedTask;
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("alpha-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();var c=await Check.Execute(Verify("body",sig,"alpha-key"));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"verified",true);
}
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("alpha-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();Check.Status(401,Verify("other",sig,"alpha-key"));Check.Status(400,Verify("body","zz","alpha-key"));Check.Status(400,Verify("body","abc","alpha-key"));Check.Status(200,Verify("body",sig.ToUpperInvariant(),"alpha-key"));
}
}}
