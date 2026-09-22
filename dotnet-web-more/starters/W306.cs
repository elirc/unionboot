// W306: Rate limiting partition counters / Fixed window 6 permits keyed by team
namespace DotnetWeb;
public static class W306{
public sealed class Policy:IRateLimiterPolicy<string>{public Func<OnRejectedContext,CancellationToken,ValueTask>? OnRejected=>null;public RateLimitPartition<string> GetPartition(HttpContext context)=>Partition(context);}
public static RateLimitPartition<string> Partition(HttpContext context){throw new NotImplementedException("W306");}
}
