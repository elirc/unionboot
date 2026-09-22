using static DotnetWeb.W133;
namespace DotnetWeb;
public static class TestsW133 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();Configure(services);Check.Equal(1,services.Count);Check.Equal(ServiceLifetime.Singleton,services[0].Lifetime);using var provider=services.BuildServiceProvider(new ServiceProviderOptions{ValidateScopes=true});using var a=provider.CreateScope();using var b=provider.CreateScope();var x=a.ServiceProvider.GetRequiredService<Stamp>();var y=a.ServiceProvider.GetRequiredService<Stamp>();var z=b.ServiceProvider.GetRequiredService<Stamp>();Check.Equal(true,ReferenceEquals(x,y));Check.Equal(true,ReferenceEquals(x,z));
 }
 {
 Check.Throws<ArgumentNullException>(()=>Configure(null!));
 }
} }
