using static DotnetWeb.W151;
namespace DotnetWeb;
public static class TestsW151 { public static async Task Run() {
 await Task.CompletedTask;
{
  foreach(var n in new[]{1,11}){var services=new ServiceCollection();Configure(services,n);using var p=services.BuildServiceProvider();Check.Equal(n,p.GetRequiredService<IOptions<PageOptions>>().Value.Limit);}
 }
 {
 foreach(var n in new[]{0,12}){var services=new ServiceCollection();Configure(services,n);using var p=services.BuildServiceProvider();try{_=p.GetRequiredService<IOptions<PageOptions>>().Value;throw new Exception("Expected options failure");}catch(OptionsValidationException e){Check.True(e.Failures.Contains("limit-range"));}}
 }
} }
