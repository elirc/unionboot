using static DotnetWeb.W223;
namespace DotnetWeb;
public static class TestsW223 { public static async Task Run() {
 await Task.CompletedTask;
{
  var e=Build();Check.Equal("/private3",e.RoutePattern.RawText);Check.Equal(new[]{"POST"},e.Metadata.GetMetadata<IHttpMethodMetadata>()!.HttpMethods.ToArray());var data=e.Metadata.GetOrderedMetadata<IAuthorizeData>();Check.Equal(1,data.Count);Check.Equal("Editors3",data[0].Policy);Check.True(e.Metadata.GetMetadata<IAllowAnonymous>() is null);var services=new ServiceCollection();services.AddLogging();services.AddAuthorization(o=>o.AddPolicy("Editors3",p=>p.RequireAuthenticatedUser()));using var provider=services.BuildServiceProvider();var combined=await AuthorizationPolicy.CombineAsync(provider.GetRequiredService<IAuthorizationPolicyProvider>(),data);var auth=provider.GetRequiredService<IAuthorizationService>();Check.True(!(await auth.AuthorizeAsync(new ClaimsPrincipal(new ClaimsIdentity()),null,combined!)).Succeeded);Check.True((await auth.AuthorizeAsync(Check.User(true,"x","y"),null,combined!)).Succeeded);
 }
} }
