// W307: Rate limiting partition counters / Fixed window 7 permits keyed by project
namespace DotnetWeb;
public static class W307{
public sealed class Policy:IRateLimiterPolicy<string>{public Func<OnRejectedContext,CancellationToken,ValueTask>? OnRejected=>null;public RateLimitPartition<string> GetPartition(HttpContext context)=>Partition(context);}
public static RateLimitPartition<string> Partition(HttpContext context){
var key=context.Request.Headers["X-project"].ToString();return RateLimitPartition.GetFixedWindowLimiter(key,_=>new FixedWindowRateLimiterOptions{PermitLimit=7,Window=TimeSpan.FromHours(1),AutoReplenishment=false,QueueLimit=0});
}
}
