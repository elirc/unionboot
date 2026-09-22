using static DotnetWeb.W147;
namespace DotnetWeb;
public static class TestsW147 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();Configure(services);using var provider=services.BuildServiceProvider();var a=provider.GetRequiredKeyedService<IChannel>("batch");var b=provider.GetRequiredKeyedService<IChannel>("default");Check.Equal("batch",a.Name);Check.Equal("default",b.Name);Check.True(ReferenceEquals(a,provider.GetRequiredKeyedService<IChannel>("batch")));Check.True(!ReferenceEquals(a,b));Check.Throws<InvalidOperationException>(()=>provider.GetRequiredKeyedService<IChannel>("missing"));Check.True(provider.GetService<IChannel>() is null);
 }
} }
