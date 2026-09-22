using static DotnetWeb.W541;
namespace DotnetWeb;
public static class TestsW541{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal(HealthStatus.Healthy,Aggregate(new Dictionary<string,HealthCheckResult>()));Check.Equal(HealthStatus.Healthy,Aggregate(new Dictionary<string,HealthCheckResult>{["critical-1"]=HealthCheckResult.Healthy(),["other"]=HealthCheckResult.Healthy()}));
}
{
Check.Equal(HealthStatus.Unhealthy,Aggregate(new Dictionary<string,HealthCheckResult>{["critical-1"]=HealthCheckResult.Degraded()}));Check.Equal(HealthStatus.Unhealthy,Aggregate(new Dictionary<string,HealthCheckResult>{["critical-1"]=HealthCheckResult.Unhealthy()}));Check.Equal(HealthStatus.Degraded,Aggregate(new Dictionary<string,HealthCheckResult>{["other"]=HealthCheckResult.Unhealthy()}));Check.Equal(HealthStatus.Degraded,Aggregate(new Dictionary<string,HealthCheckResult>{["other"]=HealthCheckResult.Degraded()}));
}
}}
