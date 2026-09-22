// W228: Protected endpoint policy metadata / scenario 8
// /private8 requires Editors8; no anonymous override
// Read prompts/W228.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W228 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/private8"),0);builder.Metadata.Add(new HttpMethodMetadata(new[]{"POST"}));builder.Metadata.Add(new AuthorizeAttribute{Policy="Editors8"});return (RouteEndpoint)builder.Build();
 }
}
