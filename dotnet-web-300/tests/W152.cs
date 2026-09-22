using static DotnetWeb.W152;
namespace DotnetWeb;
public static class TestsW152 { public static async Task Run() {
 await Task.CompletedTask;
{
  foreach(var n in new[]{2,12}){var services=new ServiceCollection();Configure(services,n);using var p=services.BuildServiceProvider();Check.Equal(n,p.GetRequiredService<IOptions<PageOptions>>().Value.Limit);}
 }
 {
 foreach(var n in new[]{1,13}){var services=new ServiceCollection();Configure(services,n);using var p=services.BuildServiceProvider();try{_=p.GetRequiredService<IOptions<PageOptions>>().Value;throw new Exception("Expected options failure");}catch(OptionsValidationException e){Check.True(e.Failures.Contains("limit-range"));}}
 }
} }
