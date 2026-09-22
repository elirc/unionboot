// W225: Protected endpoint policy metadata / scenario 5
// /private5 requires Editors5; no anonymous override
// Read prompts/W225.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W225 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/private5"),0);builder.Metadata.Add(new HttpMethodMetadata(new[]{"POST"}));builder.Metadata.Add(new AuthorizeAttribute{Policy="Editors5"});return (RouteEndpoint)builder.Build();
 }
}
