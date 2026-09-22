// W301: Rate limiting partition counters / Fixed window 1 permits keyed by tenant
namespace DotnetWeb;
public static class W301{
public sealed class Policy:IRateLimiterPolicy<string>{public Func<OnRejectedContext,CancellationToken,ValueTask>? OnRejected=>null;public RateLimitPartition<string> GetPartition(HttpContext context)=>Partition(context);}
public static RateLimitPartition<string> Partition(HttpContext context){
var key=context.Request.Headers["X-tenant"].ToString();return RateLimitPartition.GetFixedWindowLimiter(key,_=>new FixedWindowRateLimiterOptions{PermitLimit=1,Window=TimeSpan.FromHours(1),AutoReplenishment=false,QueueLimit=0});
}
}
