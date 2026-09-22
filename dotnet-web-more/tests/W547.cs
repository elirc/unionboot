using static DotnetWeb.W547;
namespace DotnetWeb;
public static class TestsW547{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal(HealthStatus.Healthy,Aggregate(new Dictionary<string,HealthCheckResult>()));Check.Equal(HealthStatus.Healthy,Aggregate(new Dictionary<string,HealthCheckResult>{["critical-7"]=HealthCheckResult.Healthy(),["other"]=HealthCheckResult.Healthy()}));
}
{
Check.Equal(HealthStatus.Unhealthy,Aggregate(new Dictionary<string,HealthCheckResult>{["critical-7"]=HealthCheckResult.Degraded()}));Check.Equal(HealthStatus.Unhealthy,Aggregate(new Dictionary<string,HealthCheckResult>{["critical-7"]=HealthCheckResult.Unhealthy()}));Check.Equal(HealthStatus.Degraded,Aggregate(new Dictionary<string,HealthCheckResult>{["other"]=HealthCheckResult.Unhealthy()}));Check.Equal(HealthStatus.Degraded,Aggregate(new Dictionary<string,HealthCheckResult>{["other"]=HealthCheckResult.Degraded()}));
}
}}
