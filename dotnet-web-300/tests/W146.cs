using static DotnetWeb.W146;
namespace DotnetWeb;
public static class TestsW146 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();Configure(services);using var provider=services.BuildServiceProvider();var a=provider.GetRequiredKeyedService<IChannel>("web");var b=provider.GetRequiredKeyedService<IChannel>("default");Check.Equal("web",a.Name);Check.Equal("default",b.Name);Check.True(ReferenceEquals(a,provider.GetRequiredKeyedService<IChannel>("web")));Check.True(!ReferenceEquals(a,b));Check.Throws<InvalidOperationException>(()=>provider.GetRequiredKeyedService<IChannel>("missing"));Check.True(provider.GetService<IChannel>() is null);
 }
} }
