using static DotnetWeb.W148;
namespace DotnetWeb;
public static class TestsW148 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();Configure(services);using var provider=services.BuildServiceProvider();var a=provider.GetRequiredKeyedService<IChannel>("mobile");var b=provider.GetRequiredKeyedService<IChannel>("default");Check.Equal("mobile",a.Name);Check.Equal("default",b.Name);Check.True(ReferenceEquals(a,provider.GetRequiredKeyedService<IChannel>("mobile")));Check.True(!ReferenceEquals(a,b));Check.Throws<InvalidOperationException>(()=>provider.GetRequiredKeyedService<IChannel>("missing"));Check.True(provider.GetService<IChannel>() is null);
 }
} }
