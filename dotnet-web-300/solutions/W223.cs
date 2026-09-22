// W223: Protected endpoint policy metadata / scenario 3
// /private3 requires Editors3; no anonymous override
// Read prompts/W223.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W223 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/private3"),0);builder.Metadata.Add(new HttpMethodMetadata(new[]{"POST"}));builder.Metadata.Add(new AuthorizeAttribute{Policy="Editors3"});return (RouteEndpoint)builder.Build();
 }
}
