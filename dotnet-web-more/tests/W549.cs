using static DotnetWeb.W549;
namespace DotnetWeb;
public static class TestsW549{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal(HealthStatus.Healthy,Aggregate(new Dictionary<string,HealthCheckResult>()));Check.Equal(HealthStatus.Healthy,Aggregate(new Dictionary<string,HealthCheckResult>{["critical-9"]=HealthCheckResult.Healthy(),["other"]=HealthCheckResult.Healthy()}));
}
{
Check.Equal(HealthStatus.Unhealthy,Aggregate(new Dictionary<string,HealthCheckResult>{["critical-9"]=HealthCheckResult.Degraded()}));Check.Equal(HealthStatus.Unhealthy,Aggregate(new Dictionary<string,HealthCheckResult>{["critical-9"]=HealthCheckResult.Unhealthy()}));Check.Equal(HealthStatus.Degraded,Aggregate(new Dictionary<string,HealthCheckResult>{["other"]=HealthCheckResult.Unhealthy()}));Check.Equal(HealthStatus.Degraded,Aggregate(new Dictionary<string,HealthCheckResult>{["other"]=HealthCheckResult.Degraded()}));
}
}}
