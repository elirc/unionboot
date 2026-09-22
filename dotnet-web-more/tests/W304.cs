using static DotnetWeb.W304;
namespace DotnetWeb;
public static class TestsW304{public static async Task Run(){await Task.CompletedTask;
{
using var limiter=PartitionedRateLimiter.Create<HttpContext,string>(Partition);var c=Check.Context();c.Request.Headers["X-client"]="a";for(int i=0;i<4;i++){using var lease=await limiter.AcquireAsync(c);Check.True(lease.IsAcquired);}using var denied=await limiter.AcquireAsync(c);Check.True(!denied.IsAcquired);var other=Check.Context();other.Request.Headers["X-client"]="b";using var independent=await limiter.AcquireAsync(other);Check.True(independent.IsAcquired);
}
{
var policy=new Policy();Check.Equal("",policy.GetPartition(Check.Context()).PartitionKey);Check.True(policy.OnRejected is null);
}
}}
