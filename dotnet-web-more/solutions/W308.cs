// W308: Rate limiting partition counters / Fixed window 8 permits keyed by region
namespace DotnetWeb;
public static class W308{
public sealed class Policy:IRateLimiterPolicy<string>{public Func<OnRejectedContext,CancellationToken,ValueTask>? OnRejected=>null;public RateLimitPartition<string> GetPartition(HttpContext context)=>Partition(context);}
public static RateLimitPartition<string> Partition(HttpContext context){
var key=context.Request.Headers["X-region"].ToString();return RateLimitPartition.GetFixedWindowLimiter(key,_=>new FixedWindowRateLimiterOptions{PermitLimit=8,Window=TimeSpan.FromHours(1),AutoReplenishment=false,QueueLimit=0});
}
}
