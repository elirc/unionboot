using static DotnetWeb.W385;
namespace DotnetWeb;
public static class TestsW385{public static async Task Run(){await Task.CompletedTask;
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("delta-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();var c=await Check.Execute(Verify("body",sig,"delta-key"));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"verified",true);
}
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("delta-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();Check.Status(401,Verify("other",sig,"delta-key"));Check.Status(400,Verify("body","zz","delta-key"));Check.Status(400,Verify("body","abc","delta-key"));Check.Status(200,Verify("body",sig.ToUpperInvariant(),"delta-key"));
}
}}
