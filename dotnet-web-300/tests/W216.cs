using static DotnetWeb.W216;
namespace DotnetWeb;
public static class TestsW216 { public static async Task Run() {
 await Task.CompletedTask;
{
  var services=new ServiceCollection();services.AddLogging();Configure(services);using var provider=services.BuildServiceProvider();var auth=provider.GetRequiredService<IAuthorizationService>();Check.True((await auth.AuthorizeAsync(Check.User(true,"permission","boards.write"),null,"permission-6")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(false,"permission","boards.write"),null,"permission-6")).Succeeded);Check.True(!(await auth.AuthorizeAsync(Check.User(true,"permission","other"),null,"permission-6")).Succeeded);Check.True(!(await auth.AuthorizeAsync(new ClaimsPrincipal(new ClaimsIdentity(new[]{new Claim("other","boards.write")},"test")),null,"permission-6")).Succeeded);
 }
} }
