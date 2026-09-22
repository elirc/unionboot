using static DotnetWeb.W381;
namespace DotnetWeb;
public static class TestsW381{public static async Task Run(){await Task.CompletedTask;
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("s3cret"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();var c=await Check.Execute(Verify("body",sig,"s3cret"));Check.Equal(200,c.Response.StatusCode);Check.Json(c,"verified",true);
}
{
var sig=Convert.ToHexString(HMACSHA256.HashData(Encoding.UTF8.GetBytes("s3cret"),Encoding.UTF8.GetBytes("body"))).ToLowerInvariant();Check.Status(401,Verify("other",sig,"s3cret"));Check.Status(400,Verify("body","zz","s3cret"));Check.Status(400,Verify("body","abc","s3cret"));Check.Status(200,Verify("body",sig.ToUpperInvariant(),"s3cret"));
}
}}
