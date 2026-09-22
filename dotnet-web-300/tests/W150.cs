using static DotnetWeb.W150;
namespace DotnetWeb;
public static class TestsW150 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();Configure(services);using var provider=services.BuildServiceProvider();var a=provider.GetRequiredKeyedService<IChannel>("internal");var b=provider.GetRequiredKeyedService<IChannel>("default");Check.Equal("internal",a.Name);Check.Equal("default",b.Name);Check.True(ReferenceEquals(a,provider.GetRequiredKeyedService<IChannel>("internal")));Check.True(!ReferenceEquals(a,b));Check.Throws<InvalidOperationException>(()=>provider.GetRequiredKeyedService<IChannel>("missing"));Check.True(provider.GetService<IChannel>() is null);
 }
} }
