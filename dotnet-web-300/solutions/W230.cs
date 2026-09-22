// W230: Protected endpoint policy metadata / scenario 10
// /private10 requires Editors10; no anonymous override
// Read prompts/W230.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W230 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/private10"),0);builder.Metadata.Add(new HttpMethodMetadata(new[]{"POST"}));builder.Metadata.Add(new AuthorizeAttribute{Policy="Editors10"});return (RouteEndpoint)builder.Build();
 }
}
