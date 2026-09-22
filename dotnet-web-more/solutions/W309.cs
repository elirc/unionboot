// W309: Rate limiting partition counters / Fixed window 9 permits keyed by plan
namespace DotnetWeb;
public static class W309{
public sealed class Policy:IRateLimiterPolicy<string>{public Func<OnRejectedContext,CancellationToken,ValueTask>? OnRejected=>null;public RateLimitPartition<string> GetPartition(HttpContext context)=>Partition(context);}
public static RateLimitPartition<string> Partition(HttpContext context){
var key=context.Request.Headers["X-plan"].ToString();return RateLimitPartition.GetFixedWindowLimiter(key,_=>new FixedWindowRateLimiterOptions{PermitLimit=9,Window=TimeSpan.FromHours(1),AutoReplenishment=false,QueueLimit=0});
}
}
