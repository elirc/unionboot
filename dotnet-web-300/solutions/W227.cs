// W227: Protected endpoint policy metadata / scenario 7
// /private7 requires Editors7; no anonymous override
// Read prompts/W227.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W227 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/private7"),0);builder.Metadata.Add(new HttpMethodMetadata(new[]{"POST"}));builder.Metadata.Add(new AuthorizeAttribute{Policy="Editors7"});return (RouteEndpoint)builder.Build();
 }
}
