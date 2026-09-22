// W229: Protected endpoint policy metadata / scenario 9
// /private9 requires Editors9; no anonymous override
// Read prompts/W229.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W229 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/private9"),0);builder.Metadata.Add(new HttpMethodMetadata(new[]{"POST"}));builder.Metadata.Add(new AuthorizeAttribute{Policy="Editors9"});return (RouteEndpoint)builder.Build();
 }
}
