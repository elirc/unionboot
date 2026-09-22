// W226: Protected endpoint policy metadata / scenario 6
// /private6 requires Editors6; no anonymous override
// Read prompts/W226.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W226 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/private6"),0);builder.Metadata.Add(new HttpMethodMetadata(new[]{"POST"}));builder.Metadata.Add(new AuthorizeAttribute{Policy="Editors6"});return (RouteEndpoint)builder.Build();
 }
}
