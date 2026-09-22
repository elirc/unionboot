// W546: Health-check aggregation / Critical check critical-6 failure precedence
namespace DotnetWeb;
public static class W546{

public static HealthStatus Aggregate(IReadOnlyDictionary<string,HealthCheckResult> checks){
if(checks.TryGetValue("critical-6",out var primary)&&primary.Status!=HealthStatus.Healthy)return HealthStatus.Unhealthy;if(checks.Values.Any(x=>x.Status!=HealthStatus.Healthy))return HealthStatus.Degraded;return HealthStatus.Healthy;
}
}
