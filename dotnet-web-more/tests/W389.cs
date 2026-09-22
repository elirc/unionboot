using static DotnetWeb.W389;
namespace DotnetWeb;
public static class TestsW389{public static async Task Run(){await Task.CompletedTask;
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("hotel-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();var c=await Check.Execute(Verify("body",sig,"hotel-key"));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"verified",true);
}
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("hotel-key"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();Check.Status(401,Verify("other",sig,"hotel-key"));Check.Status(400,Verify("body","zz","hotel-key"));Check.Status(400,Verify("body","abc","hotel-key"));Check.Status(200,Verify("body",sig.ToUpperInvariant(),"hotel-key"));
}
}}
