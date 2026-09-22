// W304: Rate limiting partition counters / Fixed window 4 permits keyed by client
namespace DotnetWeb;
public static class W304{
public sealed class Policy:IRateLimiterPolicy<string>{public Func<OnRejectedContext,CancellationToken,ValueTask>? OnRejected=>null;public RateLimitPartition<string> GetPartition(HttpContext context)=>Partition(context);}
public static RateLimitPartition<string> Partition(HttpContext context){throw new NotImplementedException("W304");}
}
