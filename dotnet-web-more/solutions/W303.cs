// W303: Rate limiting partition counters / Fixed window 3 permits keyed by workspace
namespace DotnetWeb;
public static class W303{
public sealed class Policy:IRateLimiterPolicy<string>{public Func<OnRejectedContext,CancellationToken,ValueTask>? OnRejected=>null;public RateLimitPartition<string> GetPartition(HttpContext context)=>Partition(context);}
public static RateLimitPartition<string> Partition(HttpContext context){
var key=context.Request.Headers["X-workspace"].ToString();return RateLimitPartition.GetFixedWindowLimiter(key,_=>new FixedWindowRateLimiterOptions{PermitLimit=3,Window=TimeSpan.FromHours(1),AutoReplenishment=false,QueueLimit=0});
}
}
