// W221: Protected endpoint policy metadata / scenario 1
// /private1 requires Editors1; no anonymous override
// Read prompts/W221.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W221 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/private1"),0);builder.Metadata.Add(new HttpMethodMetadata(new[]{"POST"}));builder.Metadata.Add(new AuthorizeAttribute{Policy="Editors1"});return (RouteEndpoint)builder.Build();
 }
}
