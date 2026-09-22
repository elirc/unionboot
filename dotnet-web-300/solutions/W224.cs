// W224: Protected endpoint policy metadata / scenario 4
// /private4 requires Editors4; no anonymous override
// Read prompts/W224.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W224 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/private4"),0);builder.Metadata.Add(new HttpMethodMetadata(new[]{"POST"}));builder.Metadata.Add(new AuthorizeAttribute{Policy="Editors4"});return (RouteEndpoint)builder.Build();
 }
}
