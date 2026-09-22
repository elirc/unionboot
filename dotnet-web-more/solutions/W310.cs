// W310: Rate limiting partition counters / Fixed window 10 permits keyed by subject
namespace DotnetWeb;
public static class W310{
public sealed class Policy:IRateLimiterPolicy<string>{public Func<OnRejectedContext,CancellationToken,ValueTask>? OnRejected=>null;public RateLimitPartition<string> GetPartition(HttpContext context)=>Partition(context);}
public static RateLimitPartition<string> Partition(HttpContext context){
var key=context.Request.Headers["X-subject"].ToString();return RateLimitPartition.GetFixedWindowLimiter(key,_=>new FixedWindowRateLimiterOptions{PermitLimit=10,Window=TimeSpan.FromHours(1),AutoReplenishment=false,QueueLimit=0});
}
}
