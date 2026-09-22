using static DotnetWeb.W154;
namespace DotnetWeb;
public static class TestsW154 { public static async Task Run() {
 await Task.CompletedTask;
{
  foreach(var n in new[]{4,14}){var services=new ServiceCollection();Configure(services,n);using var p=services.BuildServiceProvider();Check.Equal(n,p.GetRequiredService<IOptions<PageOptions>>().Value.Limit);}
 }
 {
 foreach(var n in new[]{3,15}){var services=new ServiceCollection();Configure(services,n);using var p=services.BuildServiceProvider();try{_=p.GetRequiredService<IOptions<PageOptions>>().Value;throw new Exception("Expected options failure");}catch(OptionsValidationException e){Check.True(e.Failures.Contains("limit-range"));}}
 }
} }
