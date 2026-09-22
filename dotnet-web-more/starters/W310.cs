// W310: Rate limiting partition counters / Fixed window 10 permits keyed by subject
namespace DotnetWeb;
public static class W310{
public sealed class Policy:IRateLimiterPolicy<string>{public Func<OnRejectedContext,CancellationToken,ValueTask>? OnRejected=>null;public RateLimitPartition<string> GetPartition(HttpContext context)=>Partition(context);}
public static RateLimitPartition<string> Partition(HttpContext context){throw new NotImplementedException("W310");}
}
