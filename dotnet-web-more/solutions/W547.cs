// W547: Health-check aggregation / Critical check critical-7 failure precedence
namespace DotnetWeb;
public static class W547{

public static HealthStatus Aggregate(IReadOnlyDictionary<string,HealthCheckResult> checks){
if(checks.TryGetValue("critical-7",out var primary)&&primary.Status!=HealthStatus.Healthy)return HealthStatus.Unhealthy;if(checks.Values.Any(x=>x.Status!=HealthStatus.Healthy))return HealthStatus.Degraded;return HealthStatus.Healthy;
}
}
