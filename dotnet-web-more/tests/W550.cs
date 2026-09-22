using static DotnetWeb.W550;
namespace DotnetWeb;
public static class TestsW550{public static async Task Run(){await Task.CompletedTask;
{
Check.Equal(HealthStatus.Healthy,Aggregate(new Dictionary<string,HealthCheckResult>()));Check.Equal(HealthStatus.Healthy,Aggregate(new Dictionary<string,HealthCheckResult>{["critical-10"]=HealthCheckResult.Healthy(),["other"]=HealthCheckResult.Healthy()}));
}
{
Check.Equal(HealthStatus.Unhealthy,Aggregate(new Dictionary<string,HealthCheckResult>{["critical-10"]=HealthCheckResult.Degraded()}));Check.Equal(HealthStatus.Unhealthy,Aggregate(new Dictionary<string,HealthCheckResult>{["critical-10"]=HealthCheckResult.Unhealthy()}));Check.Equal(HealthStatus.Degraded,Aggregate(new Dictionary<string,HealthCheckResult>{["other"]=HealthCheckResult.Unhealthy()}));Check.Equal(HealthStatus.Degraded,Aggregate(new Dictionary<string,HealthCheckResult>{["other"]=HealthCheckResult.Degraded()}));
}
}}
