// W222: Protected endpoint policy metadata / scenario 2
// /private2 requires Editors2; no anonymous override
// Read prompts/W222.txt. In-process ASP.NET Core contract, no network.
namespace DotnetWeb;
public static class W222 {

 public static RouteEndpoint Build() {
  var builder=new RouteEndpointBuilder(_=>Task.CompletedTask,RoutePatternFactory.Parse("/private2"),0);builder.Metadata.Add(new HttpMethodMetadata(new[]{"POST"}));builder.Metadata.Add(new AuthorizeAttribute{Policy="Editors2"});return (RouteEndpoint)builder.Build();
 }
}
