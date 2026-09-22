// W541: Health-check aggregation / Critical check critical-1 failure precedence
namespace DotnetWeb;
public static class W541{

public static HealthStatus Aggregate(IReadOnlyDictionary<string,HealthCheckResult> checks){
if(checks.TryGetValue("critical-1",out var primary)&&primary.Status!=HealthStatus.Healthy)return HealthStatus.Unhealthy;if(checks.Values.Any(x=>x.Status!=HealthStatus.Healthy))return HealthStatus.Degraded;return HealthStatus.Healthy;
}
}
